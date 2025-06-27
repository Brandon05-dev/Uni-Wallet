
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE,
  phone_number TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  university TEXT,
  course TEXT,
  year_of_study INTEGER,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'vendor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_id TEXT UNIQUE NOT NULL DEFAULT ('CW-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8))),
  balance DECIMAL(10,2) DEFAULT 0.00 CHECK (balance >= 0),
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref TEXT UNIQUE NOT NULL DEFAULT ('TXN-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 12))),
  from_wallet_id UUID REFERENCES public.wallets(id),
  to_wallet_id UUID REFERENCES public.wallets(id),
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('transfer', 'topup', 'withdrawal', 'payment', 'split_bill')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create savings goals table
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL CHECK (target_amount > 0),
  current_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (current_amount >= 0),
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('printing', 'laundry', 'wifi', 'cafeteria', 'transport', 'other')),
  location TEXT,
  qr_code TEXT UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  commission_rate DECIMAL(5,4) DEFAULT 0.0250, -- 2.5% default commission
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offers table
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage DECIMAL(5,2) CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_amount DECIMAL(10,2),
  vendor_id UUID REFERENCES public.vendors(id),
  category TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  max_claims INTEGER,
  current_claims INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user rewards table
CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Bronze' CHECK (level IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  total_cashback DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create claimed offers table
CREATE TABLE public.claimed_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, offer_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claimed_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for wallets
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can create transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Create RLS policies for savings goals
CREATE POLICY "Users can manage own savings goals" ON public.savings_goals FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user rewards
CREATE POLICY "Users can view own rewards" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own rewards" ON public.user_rewards FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for claimed offers
CREATE POLICY "Users can manage own claimed offers" ON public.claimed_offers FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for public data (vendors and offers)
CREATE POLICY "Anyone can view vendors" ON public.vendors FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can view active offers" ON public.offers FOR SELECT TO authenticated USING (is_active = true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, first_name, last_name, student_id, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Student'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    NEW.raw_user_meta_data->>'student_id',
    NEW.phone
  );
  
  -- Create wallet
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  
  -- Initialize rewards
  INSERT INTO public.user_rewards (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample vendors
INSERT INTO public.vendors (name, category, location, qr_code) VALUES
('Campus Print Shop', 'printing', 'Library Building', 'QR-PRINT-001'),
('Quick Laundry', 'laundry', 'Hostel Block A', 'QR-LAUNDRY-001'),
('WiFi Plus', 'wifi', 'IT Center', 'QR-WIFI-001'),
('Java Cafe', 'cafeteria', 'Student Center', 'QR-CAFE-001');

-- Insert sample offers
INSERT INTO public.offers (title, description, discount_percentage, vendor_id, category, valid_until, max_claims) VALUES
('20% Off Coffee', 'Get 20% off your entire order at Java Cafe', 20, (SELECT id FROM public.vendors WHERE name = 'Java Cafe'), 'food', NOW() + INTERVAL '7 days', 100),
('Free 10 Pages Print', 'Free black & white printing for new users', 100, (SELECT id FROM public.vendors WHERE name = 'Campus Print Shop'), 'academic', NOW() + INTERVAL '3 days', 50),
('15% Cashback on Laundry', 'Earn 15% cashback on all laundry services', 15, (SELECT id FROM public.vendors WHERE name = 'Quick Laundry'), 'services', NOW() + INTERVAL '14 days', 200);
