
-- 1) Wipe existing orders (fresh start; only new website orders should populate the dashboard)
DELETE FROM public.orders;

-- 2) New columns on orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS required_fulfillment_date date,
  ADD COLUMN IF NOT EXISTS delivery_zone text,
  ADD COLUMN IF NOT EXISTS fulfillment_window text,
  ADD COLUMN IF NOT EXISTS split_for_freshness boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allergy_info text,
  ADD COLUMN IF NOT EXISTS drop_off_instructions text,
  ADD COLUMN IF NOT EXISTS payment_received boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_received_at timestamptz,
  ADD COLUMN IF NOT EXISTS amount_received numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS simple_status text NOT NULL DEFAULT 'pending';

-- constrain simple_status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_simple_status_check'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_simple_status_check CHECK (simple_status IN ('pending','done'));
  END IF;
END$$;

-- 3) order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  category text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  protein text,
  size text,
  seafood boolean NOT NULL DEFAULT false,
  unit_price numeric NOT NULL,
  line_total numeric NOT NULL,
  excluded_ingredients text,
  item_instructions text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins view all order items" ON public.order_items;
CREATE POLICY "Admins view all order items"
  ON public.order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
CREATE POLICY "Users view own order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_simple_status ON public.orders(simple_status);
CREATE INDEX IF NOT EXISTS idx_orders_required_date ON public.orders(required_fulfillment_date);

-- 4) Update submit_order to accept new fields and insert order_items
CREATE OR REPLACE FUNCTION public.submit_order(_payload jsonb, _idem uuid)
 RETURNS TABLE(order_ref text, is_new boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _existing_ref text;
  _items jsonb;
  _food_count int := 0;
  _drink_count int := 0;
  _ref text;
  _uid uuid := auth.uid();
  _row_user uuid;
  _order_id uuid;
  _it jsonb;
BEGIN
  IF _idem IS NULL THEN
    RAISE EXCEPTION 'Idempotency key required';
  END IF;

  SELECT o.order_ref INTO _existing_ref FROM public.orders o WHERE o.idempotency_key = _idem;
  IF _existing_ref IS NOT NULL THEN
    RETURN QUERY SELECT _existing_ref, false;
    RETURN;
  END IF;

  _items := COALESCE(_payload->'items', '[]'::jsonb);
  IF jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'Basket is empty';
  END IF;

  SELECT
    COALESCE(SUM(CASE WHEN it->>'category' IN ('salad','meal') THEN (it->>'quantity')::int ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN it->>'category' = 'juice' THEN (it->>'quantity')::int ELSE 0 END), 0)
  INTO _food_count, _drink_count
  FROM jsonb_array_elements(_items) AS it;

  IF _food_count > 0 AND _food_count < 5 THEN
    RAISE EXCEPTION 'Food minimum not met: 5 required, % provided', _food_count;
  END IF;
  IF _drink_count > 0 AND _drink_count < 6 THEN
    RAISE EXCEPTION 'Drink minimum not met: 6 required, % provided', _drink_count;
  END IF;
  IF _food_count = 0 AND _drink_count = 0 THEN
    RAISE EXCEPTION 'Basket has no valid items';
  END IF;

  IF COALESCE(NULLIF(_payload->>'customer_name',''), NULL) IS NULL THEN
    RAISE EXCEPTION 'Customer name required';
  END IF;
  IF COALESCE(NULLIF(_payload->>'phone',''), NULL) IS NULL THEN
    RAISE EXCEPTION 'Contact phone required';
  END IF;
  IF (_payload->>'fulfillment') = 'Delivery'
     AND COALESCE(NULLIF(_payload->>'delivery_address',''), NULL) IS NULL THEN
    RAISE EXCEPTION 'Delivery address required';
  END IF;

  _ref := 'CCGC-' || nextval('public.order_ref_seq')::text;
  _row_user := CASE WHEN _uid IS NOT NULL THEN _uid ELSE NULL END;

  INSERT INTO public.orders (
    user_id, order_ref, customer_name, phone, email,
    fulfillment, pickup_location, delivery_address, delivery_zone,
    payment_method, notes, allergy_info, drop_off_instructions,
    required_fulfillment_date, fulfillment_window, split_for_freshness,
    items,
    subtotal, delivery_fee, discount_code, discount_amount, total,
    status, simple_status, idempotency_key
  ) VALUES (
    _row_user, _ref,
    _payload->>'customer_name', _payload->>'phone', NULLIF(_payload->>'email',''),
    _payload->>'fulfillment', NULLIF(_payload->>'pickup_location',''), NULLIF(_payload->>'delivery_address',''),
    NULLIF(_payload->>'delivery_zone',''),
    _payload->>'payment_method', NULLIF(_payload->>'notes',''),
    NULLIF(_payload->>'allergy_info',''), NULLIF(_payload->>'drop_off_instructions',''),
    NULLIF(_payload->>'required_fulfillment_date','')::date,
    NULLIF(_payload->>'fulfillment_window',''),
    COALESCE((_payload->>'split_for_freshness')::boolean, false),
    _items,
    COALESCE((_payload->>'subtotal')::numeric, 0),
    COALESCE((_payload->>'delivery_fee')::numeric, 0),
    NULLIF(_payload->>'discount_code',''),
    COALESCE((_payload->>'discount_amount')::numeric, 0),
    COALESCE((_payload->>'total')::numeric, 0),
    'received', 'pending', _idem
  )
  RETURNING id INTO _order_id;

  -- Insert structured line items
  FOR _it IN SELECT * FROM jsonb_array_elements(_items)
  LOOP
    INSERT INTO public.order_items (
      order_id, product_id, product_name, category, quantity,
      protein, size, seafood, unit_price, line_total,
      excluded_ingredients, item_instructions
    ) VALUES (
      _order_id,
      COALESCE(_it->>'itemId', _it->>'id', 'unknown'),
      COALESCE(_it->>'name', 'Unknown product'),
      COALESCE(_it->>'category', 'salad'),
      COALESCE((_it->>'quantity')::int, 1),
      NULLIF(_it->>'protein',''),
      NULLIF(_it->>'size',''),
      COALESCE((_it->>'seafood')::boolean, false),
      COALESCE((_it->>'unitPrice')::numeric, 0),
      COALESCE((_it->>'unitPrice')::numeric, 0) * COALESCE((_it->>'quantity')::int, 1),
      NULLIF(_it->>'preferences',''),
      NULLIF(_it->>'notes','')
    );
  END LOOP;

  RETURN QUERY SELECT _ref, true;
END;
$function$;

-- 5) Grant admin role to founder account, if it exists
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE lower(u.email) = 'dfinetimerestaurant@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
