-- Order submission: readable order refs + idempotency + server-side validation

CREATE SEQUENCE IF NOT EXISTS public.order_ref_seq START WITH 1048 INCREMENT BY 1;
GRANT USAGE ON SEQUENCE public.order_ref_seq TO anon, authenticated, service_role;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS idempotency_key uuid;

CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key_uidx
  ON public.orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE OR REPLACE FUNCTION public.submit_order(_payload jsonb, _idem uuid)
RETURNS TABLE(order_ref text, is_new boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _existing_ref text;
  _items jsonb;
  _food_count int := 0;
  _drink_count int := 0;
  _ref text;
  _uid uuid := auth.uid();
  _row_user uuid;
BEGIN
  IF _idem IS NULL THEN
    RAISE EXCEPTION 'Idempotency key required';
  END IF;

  -- Idempotent replay
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
    fulfillment, pickup_location, delivery_address,
    payment_method, notes, items,
    subtotal, delivery_fee, discount_code, discount_amount, total,
    status, idempotency_key
  ) VALUES (
    _row_user, _ref,
    _payload->>'customer_name', _payload->>'phone', NULLIF(_payload->>'email',''),
    _payload->>'fulfillment', NULLIF(_payload->>'pickup_location',''), NULLIF(_payload->>'delivery_address',''),
    _payload->>'payment_method', NULLIF(_payload->>'notes',''), _items,
    COALESCE((_payload->>'subtotal')::numeric, 0),
    COALESCE((_payload->>'delivery_fee')::numeric, 0),
    NULLIF(_payload->>'discount_code',''),
    COALESCE((_payload->>'discount_amount')::numeric, 0),
    COALESCE((_payload->>'total')::numeric, 0),
    'received', _idem
  );

  RETURN QUERY SELECT _ref, true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_order(jsonb, uuid) TO anon, authenticated;