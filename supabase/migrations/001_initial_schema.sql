-- ============================================================
-- NutriTrack Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: update_updated_at_column
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                TEXT NOT NULL UNIQUE,
  full_name            TEXT,
  avatar_url           TEXT,
  date_of_birth        DATE,
  height_cm            DECIMAL(5,2),
  weight_kg            DECIMAL(5,2),
  activity_level       TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  subscription_tier    TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  ai_usage_count       INTEGER NOT NULL DEFAULT 0,
  ai_usage_reset_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: goals
-- ============================================================
CREATE TABLE IF NOT EXISTS public.goals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_type         TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'maintain', 'muscle_gain')),
  target_weight_kg  DECIMAL(5,2),
  target_calories   INTEGER,
  target_protein_g  DECIMAL(7,2),
  target_carbs_g    DECIMAL(7,2),
  target_fat_g      DECIMAL(7,2),
  target_fiber_g    DECIMAL(7,2),
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: foods
-- ============================================================
CREATE TABLE IF NOT EXISTS public.foods (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name                   TEXT NOT NULL,
  brand                  TEXT,
  barcode                TEXT,
  serving_size_g         DECIMAL(7,2) NOT NULL DEFAULT 100,
  serving_description    TEXT,
  calories_per_serving   DECIMAL(7,2) NOT NULL,
  protein_g              DECIMAL(7,2) NOT NULL DEFAULT 0,
  carbs_g                DECIMAL(7,2) NOT NULL DEFAULT 0,
  fat_g                  DECIMAL(7,2) NOT NULL DEFAULT 0,
  fiber_g                DECIMAL(7,2) DEFAULT 0,
  sugar_g                DECIMAL(7,2) DEFAULT 0,
  sodium_mg              DECIMAL(7,2) DEFAULT 0,
  is_verified            BOOLEAN NOT NULL DEFAULT false,
  source                 TEXT DEFAULT 'user' CHECK (source IN ('user', 'ai', 'system')),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_foods_user_name ON public.foods (user_id, name);
CREATE INDEX IF NOT EXISTS idx_foods_barcode ON public.foods (barcode);

CREATE TRIGGER set_foods_updated_at
  BEFORE UPDATE ON public.foods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: meals
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logged_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meal_type        TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  notes            TEXT,
  photo_url        TEXT,
  ai_recognized    BOOLEAN NOT NULL DEFAULT false,
  total_calories   DECIMAL(8,2) NOT NULL DEFAULT 0,
  total_protein_g  DECIMAL(7,2) NOT NULL DEFAULT 0,
  total_carbs_g    DECIMAL(7,2) NOT NULL DEFAULT 0,
  total_fat_g      DECIMAL(7,2) NOT NULL DEFAULT 0,
  total_fiber_g    DECIMAL(7,2) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meals_user_logged_at ON public.meals (user_id, logged_at DESC);

CREATE TRIGGER set_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: meal_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meal_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id         UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_id         UUID NOT NULL REFERENCES public.foods(id) ON DELETE RESTRICT,
  quantity        DECIMAL(7,2) NOT NULL DEFAULT 1,
  serving_size_g  DECIMAL(7,2) NOT NULL,
  calories        DECIMAL(7,2) NOT NULL,
  protein_g       DECIMAL(7,2) NOT NULL DEFAULT 0,
  carbs_g         DECIMAL(7,2) NOT NULL DEFAULT 0,
  fat_g           DECIMAL(7,2) NOT NULL DEFAULT 0,
  fiber_g         DECIMAL(7,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_items_meal_id ON public.meal_items (meal_id);

-- ============================================================
-- TABLE: daily_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date         DATE NOT NULL,
  total_calories   DECIMAL(8,2) NOT NULL DEFAULT 0,
  total_protein_g  DECIMAL(7,2) NOT NULL DEFAULT 0,
  total_carbs_g    DECIMAL(7,2) NOT NULL DEFAULT 0,
  total_fat_g      DECIMAL(7,2) NOT NULL DEFAULT 0,
  total_fiber_g    DECIMAL(7,2) NOT NULL DEFAULT 0,
  water_ml         INTEGER NOT NULL DEFAULT 0,
  weight_kg        DECIMAL(5,2),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_log_date UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON public.daily_logs (user_id, log_date DESC);

CREATE TRIGGER set_daily_logs_updated_at
  BEFORE UPDATE ON public.daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: insights
-- ============================================================
CREATE TABLE IF NOT EXISTS public.insights (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  insight_type  TEXT NOT NULL CHECK (insight_type IN ('habit', 'achievement', 'suggestion', 'warning')),
  title         TEXT NOT NULL,
  message       TEXT NOT NULL,
  data          JSONB,
  is_read       BOOLEAN NOT NULL DEFAULT false,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_insights_user_generated_at ON public.insights (user_id, generated_at DESC);

-- ============================================================
-- TRIGGER: Auto-create profile on new auth user
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights   ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ---- goals ----
CREATE POLICY "goals_select_own" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "goals_insert_own" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_update_own" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_delete_own" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- ---- foods ----
-- SELECT: system foods (user_id IS NULL) OR own foods
CREATE POLICY "foods_select_own_or_system" ON public.foods
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "foods_insert_own" ON public.foods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "foods_update_own" ON public.foods
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "foods_delete_own" ON public.foods
  FOR DELETE USING (auth.uid() = user_id);

-- ---- meals ----
CREATE POLICY "meals_select_own" ON public.meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "meals_insert_own" ON public.meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meals_update_own" ON public.meals
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meals_delete_own" ON public.meals
  FOR DELETE USING (auth.uid() = user_id);

-- ---- meal_items ----
-- Access via meal ownership (no direct user_id on meal_items)
CREATE POLICY "meal_items_select_via_meal" ON public.meal_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_insert_via_meal" ON public.meal_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_update_via_meal" ON public.meal_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_delete_via_meal" ON public.meal_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

-- ---- daily_logs ----
CREATE POLICY "daily_logs_select_own" ON public.daily_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_logs_insert_own" ON public.daily_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_logs_update_own" ON public.daily_logs
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_logs_delete_own" ON public.daily_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ---- insights ----
-- Users can read and mark their own insights as read; system inserts via service role
CREATE POLICY "insights_select_own" ON public.insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insights_update_own" ON public.insights
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
