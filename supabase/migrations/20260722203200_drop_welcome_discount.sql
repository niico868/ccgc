-- Remove the automatic 10% signup discount
DROP TRIGGER IF EXISTS issue_welcome_code_on_profile_insert ON public.profiles;
DROP FUNCTION IF EXISTS public.issue_welcome_code();
