-- ============================================================
-- edtNutriTrack: Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================
-- Apply via: Supabase dashboard SQL editor or `supabase db push`
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: set_updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================
-- TABLE: public.users
-- Extends auth.users via FK on id
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT        NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  date_of_birth   DATE,
  gender          TEXT        CHECK (gender IN ('male', 'female', 'other')),
  height_cm       NUMERIC(5,2),
  activity_level  TEXT        CHECK (activity_level IN (
                                'sedentary',
                                'lightly_active',
                                'moderately_active',
                                'very_active',
                                'extremely_active'
                              )),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABLE: public.user_goals
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_goals (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  calories_target     INT,
  protein_g_target    NUMERIC(7,2),
  carbs_g_target      NUMERIC(7,2),
  fat_g_target        NUMERIC(7,2),
  fiber_g_target      NUMERIC(7,2),
  water_ml_target     INT,
  goal_type           TEXT        CHECK (goal_type IN ('weight_loss', 'maintenance', 'muscle_gain')),
  is_active           BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one active goal per user
CREATE UNIQUE INDEX IF NOT EXISTS user_goals_active_unique
  ON public.user_goals(user_id)
  WHERE is_active = TRUE;

CREATE TRIGGER user_goals_set_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABLE: public.foods
-- ============================================================
CREATE TABLE IF NOT EXISTS public.foods (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  brand               TEXT,
  barcode             TEXT        UNIQUE,
  serving_size_g      NUMERIC(7,2) NOT NULL DEFAULT 100,
  calories_per_100g   NUMERIC(7,2) NOT NULL,
  protein_per_100g    NUMERIC(7,2) NOT NULL DEFAULT 0,
  carbs_per_100g      NUMERIC(7,2) NOT NULL DEFAULT 0,
  fat_per_100g        NUMERIC(7,2) NOT NULL DEFAULT 0,
  fiber_per_100g      NUMERIC(7,2)           DEFAULT 0,
  sugar_per_100g      NUMERIC(7,2)           DEFAULT 0,
  sodium_per_100g     NUMERIC(7,2)           DEFAULT 0,
  is_verified         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_by          UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Full-text search index on food name
CREATE INDEX IF NOT EXISTS foods_name_idx
  ON public.foods
  USING gin(to_tsvector('english', name));

CREATE TRIGGER foods_set_updated_at
  BEFORE UPDATE ON public.foods
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABLE: public.meals
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meals (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT,
  meal_type   TEXT        CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS meals_user_logged_idx
  ON public.meals(user_id, logged_at DESC);

CREATE TRIGGER meals_set_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABLE: public.meal_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meal_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id     UUID        NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_id     UUID        NOT NULL REFERENCES public.foods(id) ON DELETE RESTRICT,
  quantity_g  NUMERIC(7,2) NOT NULL,
  calories    NUMERIC(7,2) NOT NULL,
  protein_g   NUMERIC(7,2) NOT NULL DEFAULT 0,
  carbs_g     NUMERIC(7,2) NOT NULL DEFAULT 0,
  fat_g       NUMERIC(7,2) NOT NULL DEFAULT 0,
  fiber_g     NUMERIC(7,2)           DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS meal_items_meal_idx
  ON public.meal_items(meal_id);

-- ============================================================
-- TABLE: public.weight_log
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weight_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  weight_kg   NUMERIC(5,2) NOT NULL,
  logged_at   DATE        NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, logged_at)
);

CREATE INDEX IF NOT EXISTS weight_log_user_date_idx
  ON public.weight_log(user_id, logged_at DESC);

-- ============================================================
-- TABLE: public.food_images
-- ============================================================
CREATE TABLE IF NOT EXISTS public.food_images (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_item_id      UUID        REFERENCES public.meal_items(id) ON DELETE SET NULL,
  storage_path      TEXT        NOT NULL,
  original_filename TEXT,
  ai_analysis       JSONB,
  ai_confidence     NUMERIC(4,3),
  status            TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER food_images_set_updated_at
  BEFORE UPDATE ON public.food_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- AUTO-SYNC TRIGGER: auth.users → public.users
-- Uses SECURITY DEFINER to bypass RLS when inserting
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop trigger if it already exists to allow re-running migration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all public tables
ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_log  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_images ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: public.users
-- ============================================================
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- RLS POLICIES: public.user_goals
-- ============================================================
CREATE POLICY "user_goals_all_own"
  ON public.user_goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES: public.foods
-- ============================================================

-- All authenticated users can read foods
CREATE POLICY "foods_select_authenticated"
  ON public.foods FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can insert their own unverified foods
-- is_verified must be FALSE on insert from normal users
CREATE POLICY "foods_insert_own"
  ON public.foods FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.uid() = created_by
    AND is_verified = FALSE
  );

-- Users can update only their own unverified foods
-- They cannot set is_verified = TRUE
CREATE POLICY "foods_update_own_unverified"
  ON public.foods FOR UPDATE
  USING (
    auth.uid() = created_by
    AND is_verified = FALSE
  )
  WITH CHECK (
    auth.uid() = created_by
    AND is_verified = FALSE
  );

-- Users can delete only their own unverified foods
CREATE POLICY "foods_delete_own_unverified"
  ON public.foods FOR DELETE
  USING (
    auth.uid() = created_by
    AND is_verified = FALSE
  );

-- ============================================================
-- RLS POLICIES: public.meals
-- ============================================================
CREATE POLICY "meals_all_own"
  ON public.meals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES: public.meal_items
-- Access granted via ownership of the parent meal
-- ============================================================
CREATE POLICY "meal_items_select_own"
  ON public.meal_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_insert_own"
  ON public.meal_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_update_own"
  ON public.meal_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_delete_own"
  ON public.meal_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: public.weight_log
-- ============================================================
CREATE POLICY "weight_log_all_own"
  ON public.weight_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES: public.food_images
-- ============================================================
CREATE POLICY "food_images_all_own"
  ON public.food_images FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
