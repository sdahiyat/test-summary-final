-- ============================================================
-- edtNutriTrack: Seed Data
-- Run AFTER 001_initial_schema.sql migration
-- All values are per 100g; is_verified = TRUE (service role only)
-- ============================================================

INSERT INTO public.foods (
  name,
  serving_size_g,
  calories_per_100g,
  protein_per_100g,
  carbs_per_100g,
  fat_per_100g,
  fiber_per_100g,
  sugar_per_100g,
  sodium_per_100g,
  is_verified,
  created_by
) VALUES
  -- Proteins
  ('Chicken Breast (cooked)',       100, 165.0, 31.0,  0.0,  3.6, 0.0,  0.0, 74.0,  TRUE, NULL),
  ('Salmon (cooked)',               100, 208.0, 20.4,  0.0, 13.4, 0.0,  0.0, 59.0,  TRUE, NULL),
  ('Whole Egg (cooked)',            100, 155.0, 13.0,  1.1, 11.0, 0.0,  1.1, 124.0, TRUE, NULL),
  ('Lean Ground Beef (cooked)',     100, 215.0, 26.1,  0.0, 11.8, 0.0,  0.0, 72.0,  TRUE, NULL),
  ('Greek Yogurt (plain, non-fat)', 100,  59.0, 10.0,  3.6,  0.4, 0.0,  3.2, 36.0,  TRUE, NULL),

  -- Grains / Carbs
  ('Oats (dry)',                    100, 389.0, 16.9, 66.3,  6.9, 10.6, 1.1,  2.0,  TRUE, NULL),
  ('Brown Rice (cooked)',           100, 111.0,  2.6, 23.0,  0.9,  1.8, 0.0,  5.0,  TRUE, NULL),
  ('White Rice (cooked)',           100, 130.0,  2.7, 28.6,  0.3,  0.4, 0.0,  1.0,  TRUE, NULL),
  ('Sweet Potato (cooked)',         100,  90.0,  2.0, 20.7,  0.1,  3.3, 6.5, 36.0,  TRUE, NULL),

  -- Fruits
  ('Banana',                        100,  89.0,  1.1, 22.8,  0.3,  2.6,12.2,  1.0,  TRUE, NULL),
  ('Apple',                         100,  52.0,  0.3, 13.8,  0.2,  2.4,10.4,  1.0,  TRUE, NULL),

  -- Vegetables
  ('Broccoli (cooked)',             100,  35.0,  2.4,  7.2,  0.4,  3.3, 1.7, 41.0,  TRUE, NULL),
  ('Spinach (raw)',                 100,  23.0,  2.9,  3.6,  0.4,  2.2, 0.4, 79.0,  TRUE, NULL),

  -- Nuts / Oils
  ('Almonds',                       100, 579.0, 21.2, 21.6, 49.9, 12.5, 4.4,  1.0,  TRUE, NULL),
  ('Olive Oil',                     100, 884.0,  0.0,  0.0,100.0,  0.0, 0.0,  0.0,  TRUE, NULL);
