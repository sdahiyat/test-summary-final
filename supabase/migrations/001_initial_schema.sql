-- ============================================================
-- NutriTrack Initial Schema Migration
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. GOALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  daily_calories      INT,
  daily_protein_g     NUMERIC(6,1),
  daily_carbs_g       NUMERIC(6,1),
  daily_fat_g         NUMERIC(6,1),
  daily_fiber_g       NUMERIC(6,1),
  target_weight_kg    NUMERIC(5,2),
  current_weight_kg   NUMERIC(5,2),
  activity_level      TEXT CHECK (activity_level IN ('sedentary','lightly_active','moderately_active','very_active','extra_active')),
  goal_type           TEXT CHECK (goal_type IN ('lose_weight','maintain_weight','gain_weight','build_muscle')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- 3. FOODS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS foods (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name                  TEXT NOT NULL,
  brand                 TEXT,
  serving_size_g        NUMERIC(7,2) NOT NULL DEFAULT 100,
  calories_per_serving  NUMERIC(7,2) NOT NULL,
  protein_g             NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_g               NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_g                 NUMERIC(6,2) NOT NULL DEFAULT 0,
  fiber_g               NUMERIC(6,2) DEFAULT 0,
  sugar_g               NUMERIC(6,2) DEFAULT 0,
  sodium_mg             NUMERIC(7,2) DEFAULT 0,
  is_verified           BOOLEAN NOT NULL DEFAULT false,
  source                TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','ai_detected','usda','custom')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full-text search vector column
ALTER TABLE foods
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(brand, ''))
  ) STORED;

-- Indexes for foods
CREATE INDEX IF NOT EXISTS foods_search_idx ON foods USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS foods_user_id_idx ON foods(user_id);
CREATE INDEX IF NOT EXISTS foods_name_idx ON foods(name);

-- ============================================================
-- 4. MEALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS meals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logged_at        DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type        TEXT NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  notes            TEXT,
  photo_url        TEXT,
  ai_analysis_raw  JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS meals_user_logged_idx ON meals(user_id, logged_at);

-- ============================================================
-- 5. MEAL_ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS meal_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id     UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id     UUID NOT NULL REFERENCES foods(id) ON DELETE RESTRICT,
  quantity_g  NUMERIC(7,2) NOT NULL,
  calories    NUMERIC(7,2) NOT NULL,
  protein_g   NUMERIC(6,2) NOT NULL,
  carbs_g     NUMERIC(6,2) NOT NULL,
  fat_g       NUMERIC(6,2) NOT NULL,
  fiber_g     NUMERIC(6,2) DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS meal_items_meal_id_idx ON meal_items(meal_id);

-- ============================================================
-- 6. DAILY_LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  log_date        DATE NOT NULL,
  total_calories  NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_protein_g NUMERIC(7,2) NOT NULL DEFAULT 0,
  total_carbs_g   NUMERIC(7,2) NOT NULL DEFAULT 0,
  total_fat_g     NUMERIC(7,2) NOT NULL DEFAULT 0,
  total_fiber_g   NUMERIC(7,2) NOT NULL DEFAULT 0,
  water_ml        INT NOT NULL DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);

CREATE INDEX IF NOT EXISTS daily_logs_user_date_idx ON daily_logs(user_id, log_date);

-- ============================================================
-- 7. INSIGHTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS insights (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type  TEXT NOT NULL CHECK (insight_type IN ('habit','recommendation','achievement','warning')),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  metadata      JSONB,
  is_read       BOOLEAN NOT NULL DEFAULT false,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS insights_user_generated_idx ON insights(user_id, generated_at DESC);

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER foods_updated_at
  BEFORE UPDATE ON foods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on new user sign-up
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
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
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goals_all_own"
  ON goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- foods
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read system foods (user_id IS NULL) or their own custom foods
CREATE POLICY "foods_select_authenticated"
  ON foods FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "foods_insert_own"
  ON foods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "foods_update_own"
  ON foods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "foods_delete_own"
  ON foods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- meals
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meals_all_own"
  ON meals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- meal_items
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meal_items_select_own"
  ON meal_items FOR SELECT
  USING (
    meal_id IN (
      SELECT id FROM meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_insert_own"
  ON meal_items FOR INSERT
  WITH CHECK (
    meal_id IN (
      SELECT id FROM meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_update_own"
  ON meal_items FOR UPDATE
  USING (
    meal_id IN (
      SELECT id FROM meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_delete_own"
  ON meal_items FOR DELETE
  USING (
    meal_id IN (
      SELECT id FROM meals WHERE user_id = auth.uid()
    )
  );

-- daily_logs
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_logs_all_own"
  ON daily_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- insights
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insights_all_own"
  ON insights FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
