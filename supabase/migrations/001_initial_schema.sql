-- Crêpe Time Tunisia — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  address_line1 TEXT,
  city TEXT,
  country TEXT,
  image TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- RESTAURANTS
-- ============================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  delivery_price INTEGER NOT NULL,  -- millimes (e.g. 300 = 3.00 TND)
  estimated_delivery_time INTEGER NOT NULL,
  cuisines TEXT[] NOT NULL,
  menu_items JSONB NOT NULL DEFAULT '[]',  -- [{id, name, price, imageUrl}, ...]
  image_url TEXT NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_restaurants_user ON restaurants(user_id);
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_last_updated ON restaurants(last_updated);

-- ============================================
-- ORDERS
-- ============================================
CREATE TYPE order_status AS ENUM (
  'placed', 'confirmed', 'inProgress', 'outForDelivery', 'delivered'
);
CREATE TYPE payment_method AS ENUM ('cash', 'pickup');

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- nullable for guest orders
  delivery_details JSONB NOT NULL,  -- {email, name, addressLine1, city, country, phone}
  cart_items JSONB NOT NULL DEFAULT '[]',  -- [{menuItemId, name, quantity}, ...]
  total_amount INTEGER NOT NULL,  -- millimes
  payment_method payment_method DEFAULT 'cash',
  status order_status DEFAULT 'placed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Backend uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
-- These policies apply when using anon key (e.g. future client-side access).

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Permissive policies (backend uses service_role and bypasses RLS)
CREATE POLICY "users_all" ON users FOR ALL USING (true);
CREATE POLICY "restaurants_all" ON restaurants FOR ALL USING (true);
CREATE POLICY "orders_all" ON orders FOR ALL USING (true);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
