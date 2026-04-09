export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type GoalType = 'weight_loss' | 'weight_gain' | 'maintenance' | 'muscle_gain';
export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type ActivityLevelType = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
export type WeightUnit = 'kg' | 'lbs';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface UserRow {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserGoalRow {
  id: string;
  user_id: string;
  goal_type: GoalType;
  daily_calorie_target: number;
  daily_protein_target?: number;
  daily_carbs_target?: number;
  daily_fat_target?: number;
  created_at: string;
  updated_at: string;
}

export interface FoodRow {
  id: string;
  name: string;
  brand?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  created_at: string;
}

export interface MealRow {
  id: string;
  user_id: string;
  meal_type: MealType;
  logged_at: string;
  notes?: string;
  created_at: string;
}

export interface MealItemRow {
  id: string;
  meal_id: string;
  food_id: string;
  quantity_grams: number;
  created_at: string;
}

export interface WeightLogRow {
  id: string;
  user_id: string;
  weight: number;
  unit: WeightUnit;
  logged_at: string;
  created_at: string;
}

export interface FoodImageRow {
  id: string;
  user_id?: string;
  storage_path: string;
  public_url: string;
  original_filename?: string;
  file_size_bytes?: number;
  mime_type?: string;
  analysis_status?: AnalysisStatus;
  analysis_result?: Record<string, unknown>;
  created_at: string;
}
