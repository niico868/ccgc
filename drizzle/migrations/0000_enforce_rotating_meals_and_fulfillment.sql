CREATE OR REPLACE FUNCTION public.validate_order_availability() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
 local_now timestamp := now() AT TIME ZONE 'America/Port_of_Spain';
 target date := NEW.required_fulfillment_date;
 week_count integer;
 menu_b boolean;
 it jsonb;
 product text;
BEGIN
 IF target IS NULL OR extract(isodow FROM target) NOT IN (1,3,5) OR target < local_now::date OR target > (local_now::date + interval '6 months')::date THEN
  RAISE EXCEPTION 'Choose an available Monday, Wednesday or Friday within six months';
 END IF;
 IF target = local_now::date AND local_now::time >= time '08:00' THEN RAISE EXCEPTION 'Same-day orders close at 8 AM Trinidad time'; END IF;
 IF NEW.fulfillment = 'Pickup' AND coalesce(NEW.pickup_location,'') NOT IN ('Trincity (2 PM to 5 PM)','St. Clair (11 AM to 1 PM)') THEN RAISE EXCEPTION 'Choose Trincity or St. Clair for pickup'; END IF;
 week_count := ((target - (extract(isodow FROM target)::int - 1)) - date '2026-10-19') / 7;
 menu_b := mod(mod(week_count,2)+2,2) = 1;
 FOR it IN SELECT value FROM jsonb_array_elements(NEW.items) LOOP
  product := coalesce(it->>'itemId',it->>'id','');
  IF it->>'category' = 'meal' OR product LIKE 'meal-%' THEN
   IF (menu_b AND product NOT IN ('meal-zesty-herb-bowl','meal-mediterranean-mex-bowl','meal-moroccan-chicken-couscous')) OR
      (NOT menu_b AND product NOT IN ('meal-quinoa-chow-mein','meal-sweet-potato-basil','meal-cumin-basmati-tandoori','meal-roasted-veg-thai-butter')) THEN
    RAISE EXCEPTION 'Meal unavailable for the selected menu week';
   END IF;
  END IF;
 END LOOP;
 RETURN NEW;
END; $$;
CREATE TRIGGER orders_validate_availability BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.validate_order_availability();