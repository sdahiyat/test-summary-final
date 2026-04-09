-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: public.users
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm NUMERIC(5,2),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: public.user_goals
-- ============================================================
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  calories_target INTEGER,
  protein_target_g NUMERIC(6,2),
  carbs_target_g NUMERIC(6,2),
  fat_target_g NUMERIC(6,2),
  fiber_target_g NUMERIC(6,2),
  water_target_ml INTEGER,
  goal_type TEXT CHECK (goal_type IN ('lose_weight', 'maintain', 'gain_weight', 'build_muscle')),
  target_weight_kg NUMERIC(5,2),
  weekly_goal_kg NUMERIC(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: public.foods
-- ============================================================
CREATE TABLE public.foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT,
  serving_size NUMERIC(8,2) NOT NULL DEFAULT 100,
  serving_unit TEXT NOT NULL DEFAULT 'g',
  calories_per_serving NUMERIC(8,2) NOT NULL,
  protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fiber_g NUMERIC(8,2) DEFAULT 0,
  sugar_g NUMERIC(8,2) DEFAULT 0,
  sodium_mg NUMERIC(8,2) DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: public.meals
-- ============================================================
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: public.meal_items
-- ============================================================
CREATE TABLE public.meal_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE RESTRICT,
  quantity NUMERIC(8,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'g',
  calories NUMERIC(8,2) NOT NULL,
  protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fiber_g NUMERIC(8,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: public.weight_log
-- ============================================================
CREATE TABLE public.weight_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_value NUMERIC(6,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'lbs')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- ============================================================
-- TABLE: public.food_images
-- ============================================================
CREATE TABLE public.food_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_id UUID REFERENCES public.meals(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  ai_analysis_result JSONB,
  ai_model_version TEXT,
  analysis_status TEXT NOT NULL DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_meals_user_id_date ON public.meals(user_id, meal_date);
CREATE INDEX idx_meal_items_meal_id ON public.meal_items(meal_id);
CREATE INDEX idx_weight_log_user_id_date ON public.weight_log(user_id, log_date);
CREATE INDEX idx_foods_user_id ON public.foods(user_id);
CREATE INDEX idx_food_images_user_id ON public.food_images(user_id);
CREATE INDEX idx_food_images_meal_id ON public.food_images(meal_id);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Attach updated_at trigger to all tables with updated_at column
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_foods_updated_at
  BEFORE UPDATE ON public.foods
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- USER SYNC TRIGGER (auth.users -> public.users)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_images ENABLE ROW LEVEL SECURITY;

-- ---- public.users policies ----
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ---- public.user_goals policies ----
CREATE POLICY "user_goals_select_own"
  ON public.user_goals
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_goals_insert_own"
  ON public.user_goals
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_goals_update_own"
  ON public.user_goals
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_goals_delete_own"
  ON public.user_goals
  FOR DELETE
  USING (user_id = auth.uid());

-- ---- public.foods policies ----
-- SELECT: own foods OR global/shared foods (user_id IS NULL)
CREATE POLICY "foods_select_own_or_global"
  ON public.foods
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "foods_insert_own"
  ON public.foods
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "foods_update_own"
  ON public.foods
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "foods_delete_own"
  ON public.foods
  FOR DELETE
  USING (user_id = auth.uid());

-- ---- public.meals policies ----
CREATE POLICY "meals_select_own"
  ON public.meals
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "meals_insert_own"
  ON public.meals
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "meals_update_own"
  ON public.meals
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "meals_delete_own"
  ON public.meals
  FOR DELETE
  USING (user_id = auth.uid());

-- ---- public.meal_items policies ----
CREATE POLICY "meal_items_select_own"
  ON public.meal_items
  FOR SELECT
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_insert_own"
  ON public.meal_items
  FOR INSERT
  WITH CHECK (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_update_own"
  ON public.meal_items
  FOR UPDATE
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_delete_own"
  ON public.meal_items
  FOR DELETE
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

-- ---- public.weight_log policies ----
CREATE POLICY "weight_log_select_own"
  ON public.weight_log
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "weight_log_insert_own"
  ON public.weight_log
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "weight_log_update_own"
  ON public.weight_log
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "weight_log_delete_own"
  ON public.weight_log
  FOR DELETE
  USING (user_id = auth.uid());

-- ---- public.food_images policies ----
CREATE POLICY "food_images_select_own"
  ON public.food_images
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "food_images_insert_own"
  ON public.food_images
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "food_images_update_own"
  ON public.food_images
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "food_images_delete_own"
  ON public.food_images
  FOR DELETE
  USING (user_id = auth.uid());
