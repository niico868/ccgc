
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='Anyone can insert orders') THEN
    CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT TO anon, authenticated
      WITH CHECK (
        (auth.uid() IS NULL AND user_id IS NULL)
        OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
      );
  END IF;
END $$;

DROP POLICY IF EXISTS "Users insert own orders" ON public.orders;

GRANT INSERT ON public.orders TO anon;
