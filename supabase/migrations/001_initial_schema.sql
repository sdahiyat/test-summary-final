-- ============================================================
-- NutriTrack Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-create a profile when a new auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
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
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: update updated_at on profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: auto-create profile on new auth user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TABLE: goals
-- ============================================================

CREATE TABLE IF NOT EXISTS public.goals (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_type         TEXT        NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'maintenance', 'muscle_gain')),
  calorie_target    INTEGER     NOT NULL,
  protein_target_g  NUMERIC(6,1),
  carb_target_g     NUMERIC(6,1),
  fat_target_g      NUMERIC(6,1),
  target_weight_kg  NUMERIC(5,2),
  is_active         BOOLEAN     NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS goals_user_id_is_active_idx
  ON public.goals (user_id, is_active);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goals_select_own"
  ON public.goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "goals_insert_own"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_update_own"
  ON public.goals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_delete_own"
  ON public.goals FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: update updated_at on goals
CREATE TRIGGER goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE: foods
-- ============================================================

CREATE TABLE IF NOT EXISTS public.foods (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        REFERENCES public.profiles(id) ON DELETE CASCADE,
  name                  TEXT        NOT NULL,
  brand                 TEXT,
  serving_size_g        NUMERIC(8,2) NOT NULL,
  calories_per_serving  NUMERIC(8,2) NOT NULL,
  protein_g             NUMERIC(6,2),
  carbs_g               NUMERIC(6,2),
  fat_g                 NUMERIC(6,2),
  fiber_g               NUMERIC(6,2),
  sugar_g               NUMERIC(6,2),
  sodium_mg             NUMERIC(8,2),
  is_verified           BOOLEAN     NOT NULL DEFAULT false,
  source                TEXT        CHECK (source IN ('manual', 'ai', 'usda', 'openfoodfacts')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS foods_name_pattern_idx
  ON public.foods (name text_pattern_ops);

CREATE INDEX IF NOT EXISTS foods_user_id_idx
  ON public.foods (user_id);

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- Users can see their own foods AND system/global foods (user_id IS NULL)
CREATE POLICY "foods_select_own_and_global"
  ON public.foods FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "foods_insert_own"
  ON public.foods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "foods_update_own"
  ON public.foods FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "foods_delete_own"
  ON public.foods FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: meals
-- ============================================================

CREATE TABLE IF NOT EXISTS public.meals (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logged_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  meal_type    TEXT        NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name         TEXT,
  notes        TEXT,
  photo_url    TEXT,
  ai_analysis  JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS meals_user_id_logged_at_idx
  ON public.meals (user_id, logged_at DESC);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meals_select_own"
  ON public.meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "meals_insert_own"
  ON public.meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meals_update_own"
  ON public.meals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meals_delete_own"
  ON public.meals FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: update updated_at on meals
CREATE TRIGGER meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE: meal_items
-- ============================================================

CREATE TABLE IF NOT EXISTS public.meal_items (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id    UUID         NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_id    UUID         REFERENCES public.foods(id) ON DELETE SET NULL,
  user_id    UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_name  TEXT         NOT NULL,
  quantity   NUMERIC(8,2) NOT NULL DEFAULT 1,
  unit       TEXT         NOT NULL DEFAULT 'serving',
  calories   NUMERIC(8,2) NOT NULL,
  protein_g  NUMERIC(6,2),
  carbs_g    NUMERIC(6,2),
  fat_g      NUMERIC(6,2),
  fiber_g    NUMERIC(6,2),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS meal_items_meal_id_idx
  ON public.meal_items (meal_id);

CREATE INDEX IF NOT EXISTS meal_items_user_id_idx
  ON public.meal_items (user_id);

ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meal_items_select_own"
  ON public.meal_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "meal_items_insert_own"
  ON public.meal_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meal_items_update_own"
  ON public.meal_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meal_items_delete_own"
  ON public.meal_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: daily_logs
-- ============================================================

CREATE TABLE IF NOT EXISTS public.daily_logs (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date        DATE         NOT NULL,
  total_calories  NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_protein_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  total_carbs_g   NUMERIC(6,2) NOT NULL DEFAULT 0,
  total_fat_g     NUMERIC(6,2) NOT NULL DEFAULT 0,
  total_fiber_g   NUMERIC(6,2) NOT NULL DEFAULT 0,
  water_ml        INTEGER      NOT NULL DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS daily_logs_user_id_log_date_idx
  ON public.daily_logs (user_id, log_date DESC);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_logs_select_own"
  ON public.daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "daily_logs_insert_own"
  ON public.daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_logs_update_own"
  ON public.daily_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_logs_delete_own"
  ON public.daily_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: update updated_at on daily_logs
CREATE TRIGGER daily_logs_updated_at
  BEFORE UPDATE ON public.daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE: insights
-- ============================================================

CREATE TABLE IF NOT EXISTS public.insights (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  insight_type  TEXT        NOT NULL CHECK (insight_type IN ('habit', 'achievement', 'recommendation', 'warning')),
  title         TEXT        NOT NULL,
  body          TEXT        NOT NULL,
  metadata      JSONB,
  is_read       BOOLEAN     NOT NULL DEFAULT false,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS insights_user_id_generated_at_is_read_idx
  ON public.insights (user_id, generated_at DESC, is_read);

ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Users can read their own insights
CREATE POLICY "insights_select_own"
  ON public.insights FOR SELECT
  USING (auth.uid() = user_id);

-- Users can mark insights as read (UPDATE), but cannot change other fields
-- We use a permissive UPDATE policy scoped to own data; field-level restriction
-- is enforced at the application layer.
CREATE POLICY "insights_update_own"
  ON public.insights FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- INSERT is restricted to service_role only (no policy for authenticated users)
-- The admin client bypasses RLS, so no explicit INSERT policy is needed for users.
