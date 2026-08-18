-- ==============================================================================
-- HomeBite Supabase Schema Setup (Full MVP Version)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to rebuild (in correct order due to FKs)
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.favourite_kitchens CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.kitchen_weekly_menus CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.kitchens CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.customer_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==============================================================================
-- 1. Profiles Table (Linked to auth.users)
-- ==============================================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('customer', 'provider', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. Customer Specific Tables
-- ==============================================================================
CREATE TABLE public.customer_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  dietary_preference TEXT,
  allergies TEXT[],
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_type TEXT CHECK (address_type IN ('Home', 'Work', 'Hostel', 'Other')),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.favourite_kitchens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  kitchen_id UUID NOT NULL, -- FK added after kitchen table
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, kitchen_id)
);

-- ==============================================================================
-- 3. Provider Specific Tables
-- ==============================================================================
CREATE TABLE public.kitchens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  chef_name TEXT,
  bio TEXT,
  cuisine TEXT NOT NULL,
  area TEXT NOT NULL,
  delivery_radius_km DECIMAL(4, 2) DEFAULT 5.0,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  is_verified BOOLEAN DEFAULT FALSE,
  emoji TEXT DEFAULT '👩🏽‍🍳',
  img TEXT DEFAULT '🍛',
  lunch_capacity INTEGER DEFAULT 25,
  dinner_capacity INTEGER DEFAULT 25,
  is_open_today BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add the missing FK for favourites now that kitchens exists
ALTER TABLE public.favourite_kitchens ADD CONSTRAINT fk_kitchen FOREIGN KEY (kitchen_id) REFERENCES public.kitchens(id) ON DELETE CASCADE;

CREATE TABLE public.menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  is_veg BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.kitchen_weekly_menus (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 1=Mon, etc.
  meal_type TEXT CHECK (meal_type IN ('Lunch', 'Dinner')),
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kitchen_id, day_of_week, meal_type)
);

-- ==============================================================================
-- 4. Subscriptions, Orders, and Operations
-- ==============================================================================
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
  plan_type TEXT CHECK (plan_type IN ('Weekly', 'Monthly')),
  meal_type TEXT CHECK (meal_type IN ('Lunch', 'Dinner', 'Both')),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT CHECK (status IN ('Active', 'Paused', 'Cancelled', 'Completed')),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE, -- Null if Trial
  order_type TEXT CHECK (order_type IN ('Trial', 'Subscription')),
  meal_type TEXT CHECK (meal_type IN ('Lunch', 'Dinner')),
  delivery_date DATE NOT NULL,
  status TEXT CHECK (status IN ('Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Skipped', 'Cancelled')),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(order_id) -- One review per order
);

CREATE TABLE public.support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchen_weekly_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourite_kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Customer Profiles
CREATE POLICY "Users can view own customer profile" ON public.customer_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own customer profile" ON public.customer_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own customer profile" ON public.customer_profiles FOR UPDATE USING (auth.uid() = id);

-- Kitchens
CREATE POLICY "Public can view verified kitchens" ON public.kitchens FOR SELECT USING (is_verified = TRUE);
CREATE POLICY "Providers can view own kitchen" ON public.kitchens FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Providers can update own kitchen" ON public.kitchens FOR UPDATE USING (auth.uid() = provider_id);

-- Menu Items & Weekly Menus
CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Providers can manage their menu items" ON public.menu_items USING (
  auth.uid() IN (SELECT provider_id FROM public.kitchens WHERE id = kitchen_id)
);

CREATE POLICY "Public can view weekly menus" ON public.kitchen_weekly_menus FOR SELECT USING (true);
CREATE POLICY "Providers can manage their weekly menus" ON public.kitchen_weekly_menus USING (
  auth.uid() IN (SELECT provider_id FROM public.kitchens WHERE id = kitchen_id)
);

-- Subscriptions
CREATE POLICY "Customers can view their subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Providers can view their kitchen subscriptions" ON public.subscriptions FOR SELECT USING (
  auth.uid() IN (SELECT provider_id FROM public.kitchens WHERE id = kitchen_id)
);

-- Orders
CREATE POLICY "Customers can view their orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Providers can view their kitchen orders" ON public.orders FOR SELECT USING (
  auth.uid() IN (SELECT provider_id FROM public.kitchens WHERE id = kitchen_id)
);
CREATE POLICY "Providers can update their kitchen orders" ON public.orders FOR UPDATE USING (
  auth.uid() IN (SELECT provider_id FROM public.kitchens WHERE id = kitchen_id)
);

-- Favourites
CREATE POLICY "Customers can manage favourites" ON public.favourite_kitchens USING (auth.uid() = customer_id);

-- Reviews
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews for their orders" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Support Tickets
CREATE POLICY "Customers can manage own tickets" ON public.support_tickets USING (auth.uid() = customer_id);

-- ==============================================================================
-- 6. Trigger for New User Creation
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, full_name, role)
  VALUES (new.id, new.phone, COALESCE(new.raw_user_meta_data->>'full_name', 'User'), new.raw_user_meta_data->>'role');
  
  -- If role is customer, also create customer_profile
  IF (new.raw_user_meta_data->>'role') = 'customer' THEN
    INSERT INTO public.customer_profiles (id) VALUES (new.id);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
