// ============================================================
// Literal union types matching CHECK constraints in the schema
// ============================================================

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type GoalType = 'lose_weight' | 'maintain' | 'gain_weight' | 'build_muscle';

export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type ActivityLevelType =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export type WeightUnit = 'kg' | 'lbs';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

// ============================================================
// public.users
// ============================================================
export interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: GenderType | null;
  height_cm: number | null;
  activity_level: ActivityLevelType | null;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  id?: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: GenderType | null;
  height_cm?: number | null;
  activity_level?: ActivityLevelType | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserUpdate {
  id?: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: GenderType | null;
  height_cm?: number | null;
  activity_level?: ActivityLevelType | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// public.user_goals
// ============================================================
export interface UserGoalRow {
  id: string;
  user_id: string;
  calories_target: number | null;
  protein_target_g: number | null;
  carbs_target_g: number | null;
  fat_target_g: number | null;
  fiber_target_g: number | null;
  water_target_ml: number | null;
  goal_type: GoalType | null;
  target_weight_kg: number | null;
  weekly_goal_kg: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserGoalInsert {
  id?: string;
  user_id: string;
  calories_target?: number | null;
  protein_target_g?: number | null;
  carbs_target_g?: number | null;
  fat_target_g?: number | null;
  fiber_target_g?: number | null;
  water_target_ml?: number | null;
  goal_type?: GoalType | null;
  target_weight_kg?: number | null;
  weekly_goal_kg?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserGoalUpdate {
  id?: string;
  user_id?: string;
  calories_target?: number | null;
  protein_target_g?: number | null;
  carbs_target_g?: number | null;
  fat_target_g?: number | null;
  fiber_target_g?: number | null;
  water_target_ml?: number | null;
  goal_type?: GoalType | null;
  target_weight_kg?: number | null;
  weekly_goal_kg?: number | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// public.foods
// ============================================================
export interface FoodRow {
  id: string;
  user_id: string | null;
  name: string;
  brand: string | null;
  barcode: string | null;
  serving_size: number;
  serving_unit: string;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoodInsert {
  id?: string;
  user_id?: string | null;
  name: string;
  brand?: string | null;
  barcode?: string | null;
  serving_size?: number;
  serving_unit?: string;
  calories_per_serving: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number | null;
  sugar_g?: number | null;
  sodium_mg?: number | null;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FoodUpdate {
  id?: string;
  user_id?: string | null;
  name?: string;
  brand?: string | null;
  barcode?: string | null;
  serving_size?: number;
  serving_unit?: string;
  calories_per_serving?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number | null;
  sugar_g?: number | null;
  sodium_mg?: number | null;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// public.meals
// ============================================================
export interface MealRow {
  id: string;
  user_id: string;
  meal_type: MealType;
  meal_date: string;
  logged_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MealInsert {
  id?: string;
  user_id: string;
  meal_type: MealType;
  meal_date?: string;
  logged_at?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MealUpdate {
  id?: string;
  user_id?: string;
  meal_type?: MealType;
  meal_date?: string;
  logged_at?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// public.meal_items
// ============================================================
export interface MealItemRow {
  id: string;
  meal_id: string;
  food_id: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  created_at: string;
}

export interface MealItemInsert {
  id?: string;
  meal_id: string;
  food_id: string;
  quantity: number;
  unit?: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number | null;
  created_at?: string;
}

export interface MealItemUpdate {
  id?: string;
  meal_id?: string;
  food_id?: string;
  quantity?: number;
  unit?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number | null;
  created_at?: string;
}

// ============================================================
// public.weight_log
// ============================================================
export interface WeightLogRow {
  id: string;
  user_id: string;
  log_date: string;
  weight_value: number;
  unit: WeightUnit;
  notes: string | null;
  created_at: string;
}

export interface WeightLogInsert {
  id?: string;
  user_id: string;
  log_date?: string;
  weight_value: number;
  unit?: WeightUnit;
  notes?: string | null;
  created_at?: string;
}

export interface WeightLogUpdate {
  id?: string;
  user_id?: string;
  log_date?: string;
  weight_value?: number;
  unit?: WeightUnit;
  notes?: string | null;
  created_at?: string;
}

// ============================================================
// public.food_images
// ============================================================
export interface FoodImageRow {
  id: string;
  user_id: string;
  meal_id: string | null;
  image_url: string;
  storage_path: string | null;
  ai_analysis_result: Record<string, unknown> | null;
  ai_model_version: string | null;
  analysis_status: AnalysisStatus;
  created_at: string;
}

export interface FoodImageInsert {
  id?: string;
  user_id: string;
  meal_id?: string | null;
  image_url: string;
  storage_path?: string | null;
  ai_analysis_result?: Record<string, unknown> | null;
  ai_model_version?: string | null;
  analysis_status?: AnalysisStatus;
  created_at?: string;
}

export interface FoodImageUpdate {
  id?: string;
  user_id?: string;
  meal_id?: string | null;
  image_url?: string;
  storage_path?: string | null;
  ai_analysis_result?: Record<string, unknown> | null;
  ai_model_version?: string | null;
  analysis_status?: AnalysisStatus;
  created_at?: string;
}
