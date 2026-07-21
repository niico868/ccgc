
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS admin_note text;

UPDATE public.orders SET status = 'received'
  WHERE status IS NULL OR status NOT IN ('received','confirmed','prepping','ready','out_for_delivery','completed','cancelled');

ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'received';
ALTER TABLE public.orders ALTER COLUMN status SET NOT NULL;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN (
  'received','confirmed','prepping','ready','out_for_delivery','completed','cancelled'
));

CREATE OR REPLACE FUNCTION public.bump_order_status_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN NEW.status_updated_at = now(); END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS orders_status_updated_at ON public.orders;
CREATE TRIGGER orders_status_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.bump_order_status_updated_at();

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='Admins can update orders') THEN
    CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated
      USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='Admins can view all orders') THEN
    CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_order_status(_order_ref text, _phone_last4 text)
RETURNS TABLE (
  order_ref text, customer_name text, fulfillment text, pickup_location text,
  delivery_address text, items jsonb, subtotal numeric, delivery_fee numeric,
  discount_amount numeric, total numeric, status text, status_updated_at timestamptz,
  admin_note text, created_at timestamptz
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.order_ref, o.customer_name, o.fulfillment, o.pickup_location,
    o.delivery_address, o.items, o.subtotal, o.delivery_fee,
    o.discount_amount, o.total, o.status, o.status_updated_at,
    o.admin_note, o.created_at
  FROM public.orders o
  WHERE o.order_ref = _order_ref
    AND right(regexp_replace(coalesce(o.phone,''), '\D', '', 'g'), 4) = _phone_last4
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_order_status(text, text) TO anon, authenticated;

ALTER TABLE public.orders REPLICA IDENTITY FULL;
DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
