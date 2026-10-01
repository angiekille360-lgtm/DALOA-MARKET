-- ==============================================================================
-- DALOA MARKET - SCHEMA SUPABASE & POLICIES RLS
-- Marketplace #1 de Daloa, Côte d'Ivoire
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'vendor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  last_sign_in_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. TABLE CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 4. TABLE PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  image_url TEXT[] DEFAULT '{}',
  stock INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABLE ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash_on_delivery', 'mobile_money')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABLE ORDER_ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price NUMERIC NOT NULL CHECK (price >= 0)
);

-- 7. STORAGE BUCKET POUR IMAGES DE PRODUITS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR email = 'admin@daloamarket.ci')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admin can delete or update any profile"
ON public.profiles FOR ALL USING (public.is_admin());

-- Categories Policies
CREATE POLICY "Categories are readable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Only admin can modify categories" 
ON public.categories FOR ALL USING (public.is_admin());

-- Products Policies
-- Tout le monde peut lire products où status='approved' (ou admin peut tout voir, ou vendeur peut voir ses propres produits)
CREATE POLICY "Approved products readable by all"
ON public.products FOR SELECT
USING (
  status = 'approved' 
  OR auth.uid() = user_id 
  OR public.is_admin()
);

-- Utilisateurs authentifiés peuvent créer products (status='pending' par défaut)
CREATE POLICY "Authenticated users can create products"
ON public.products FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND (status = 'pending' OR public.is_admin())
);

-- Utilisateurs peuvent modifier ou supprimer leurs produits en attente, ou admin peut tout modifier
CREATE POLICY "Users can update own products or admin"
ON public.products FOR UPDATE
USING (
  (auth.uid() = user_id AND status = 'pending')
  OR public.is_admin()
);

CREATE POLICY "Users can delete own products or admin"
ON public.products FOR DELETE
USING (auth.uid() = user_id OR public.is_admin());

-- Orders Policies
-- Utilisateurs peuvent voir leurs orders, admin peut tout voir
CREATE POLICY "Users can view own orders or admin"
ON public.orders FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

-- Utilisateurs authentifiés ou invités peuvent créer des commandes
CREATE POLICY "Users can insert orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Admin peut mettre à jour les commandes (marquer livré, annuler)
CREATE POLICY "Admin can update orders"
ON public.orders FOR UPDATE
USING (public.is_admin());

-- Order Items Policies
CREATE POLICY "Users can view order items of their orders or admin"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "Anyone can create order items for orders"
ON public.order_items FOR INSERT
WITH CHECK (true);

-- Storage Policies for product-images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- SEED CATEGORIES
INSERT INTO public.categories (id, name, icon, display_order) VALUES
  ('electronique', 'Électronique', 'Smartphone', 1),
  ('mode', 'Mode', 'Shirt', 2),
  ('alimentation', 'Alimentation', 'UtensilsCrossed', 3),
  ('maison', 'Maison', 'Home', 4),
  ('vehicules', 'Véhicules', 'Car', 5),
  ('services', 'Services', 'Wrench', 6)
ON CONFLICT (id) DO NOTHING;
