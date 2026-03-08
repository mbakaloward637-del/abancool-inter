
-- Hosting plans (admin-managed)
CREATE TABLE public.hosting_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL,
  price_yearly NUMERIC(10,2),
  disk_space_gb INTEGER NOT NULL DEFAULT 5,
  bandwidth_gb INTEGER NOT NULL DEFAULT 20,
  email_accounts INTEGER NOT NULL DEFAULT 5,
  databases INTEGER NOT NULL DEFAULT 3,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hosting_plans ENABLE ROW LEVEL SECURITY;

-- Anyone can view active plans
CREATE POLICY "Anyone can view active hosting plans"
  ON public.hosting_plans FOR SELECT
  USING (is_active = true);

-- Hosting orders / subscriptions
CREATE TABLE public.hosting_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.hosting_plans(id) NOT NULL,
  domain TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled', 'expired')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'stripe', 'bank_transfer')),
  payment_reference TEXT,
  cpanel_username TEXT,
  cpanel_url TEXT,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hosting_orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own hosting orders"
  ON public.hosting_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create orders (purchase)
CREATE POLICY "Users can create hosting orders"
  ON public.hosting_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Seed some default plans
INSERT INTO public.hosting_plans (name, slug, description, price_monthly, price_yearly, disk_space_gb, bandwidth_gb, email_accounts, databases, features)
VALUES
  ('Starter', 'starter', 'Perfect for personal websites and blogs', 420, 4200, 5, 20, 5, 3, '["1 Website", "Free SSL", "Daily Backups", "24/7 Support"]'::jsonb),
  ('Standard', 'standard', 'Ideal for growing businesses', 1200, 12000, 20, 100, 15, 10, '["5 Websites", "Free SSL", "Daily Backups", "Priority Support", "Free Domain"]'::jsonb),
  ('Business', 'business', 'For high-traffic business websites', 2500, 25000, 50, 250, 50, 25, '["Unlimited Websites", "Free SSL", "Hourly Backups", "Priority Support", "Free Domain", "Staging Environment"]'::jsonb),
  ('Enterprise', 'enterprise', 'Maximum power and resources', 5000, 50000, 100, 500, 100, 50, '["Unlimited Websites", "Free SSL", "Real-time Backups", "Dedicated Support", "Free Domain", "Staging Environment", "Dedicated IP"]'::jsonb);
