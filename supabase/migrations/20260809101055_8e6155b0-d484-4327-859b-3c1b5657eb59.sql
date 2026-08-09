ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS recurring_frequency text NOT NULL DEFAULT 'none';

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
    status, simple_status, idempotency_key, recurring_frequency
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
    'received', 'pending', _idem,
    COALESCE(NULLIF(_payload->>'recurring_frequency',''), 'none')
  )
  RETURNING id INTO _order_id;

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