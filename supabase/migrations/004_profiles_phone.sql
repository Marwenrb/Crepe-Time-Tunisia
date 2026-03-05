-- Crepe Time Tunisia - Profiles phone support
-- Adds phone column to profiles, backfills existing users, and updates signup trigger.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Backfill from Supabase auth metadata when available.
UPDATE public.profiles p
SET phone = au.raw_user_meta_data->>'phone'
FROM auth.users au
WHERE au.id = p.id
  AND COALESCE(p.phone, '') = ''
  AND COALESCE(au.raw_user_meta_data->>'phone', '') <> '';

-- Ensure new signups persist phone in profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, image, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'picture',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    image = COALESCE(EXCLUDED.image, public.profiles.image),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
