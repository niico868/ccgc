
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS default_address text,
  ADD COLUMN IF NOT EXISTS default_delivery_zone text,
  ADD COLUMN IF NOT EXISTS default_payment_method text;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS used_whatsapp_doublecheck boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_doublecheck_at timestamptz;

CREATE OR REPLACE FUNCTION public.mark_order_whatsapp_doublecheck(_order_ref text, _idem uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count int;
BEGIN
  UPDATE public.orders
     SET used_whatsapp_doublecheck = true,
         whatsapp_doublecheck_at = now()
   WHERE order_ref = _order_ref
     AND idempotency_key = _idem;
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_order_whatsapp_doublecheck(text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.mark_order_whatsapp_doublecheck(text, uuid) TO anon, authenticated;
