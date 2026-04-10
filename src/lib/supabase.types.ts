export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type GoalType = 'weight_loss' | 'maintenance' | 'muscle_gain';
export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type ActivityLevelType =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';
export type WeightUnit = 'kg' | 'lbs';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      user_goals: {
        Row: UserGoalRow;
        Insert: UserGoalInsert;
        Update: UserGoalUpdate;
      };
      foods: {
        Row: FoodRow;
        Insert: FoodInsert;
        Update: FoodUpdate;
      };
      meals: {
        Row: MealRow;
        Insert: MealInsert;
        Update: MealUpdate;
      };
      meal_items: {
        Row: MealItemRow;
        Insert: MealItemInsert;
        Update: MealItemUpdate;
      };
      weight_log: {
        Row: WeightLogRow;
        Insert: WeightLogInsert;
        Update: WeightLogUpdate;
      };
      food_images: {
        Row: FoodImageRow;
        Insert: FoodImageInsert;
        Update: FoodImageUpdate;
      };
    };
  };
}

// Users
export interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: GenderType | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  activity_level: ActivityLevelType | null;
  created_at: string;
  updated_at: string;
}
export type UserInsert = Omit<UserRow, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};
export type UserUpdate = Partial<UserInsert>;

// User Goals
export interface UserGoalRow {
  id: string;
  user_id: string;
  goal_type: GoalType;
  target_weight_kg: number | null;
  daily_calories_target: number | null;
  daily_protein_g: number | null;
  daily_carbs_g: number | null;
  daily_fat_g: number | null;
  start_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export type UserGoalInsert = Omit<UserGoalRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type UserGoalUpdate = Partial<UserGoalInsert>;

// Foods
export interface FoodRow {
  id: string;
  name: string;
  brand: string | null;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  serving_size: number;
  serving_unit: string;
  is_verified: boolean;
  created_by: string | null;
  search_vector: string | null;
  created_at: string;
  updated_at: string;
}
export type FoodInsert = Omit<FoodRow, 'id' | 'created_at' | 'updated_at' | 'search_vector'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type FoodUpdate = Partial<FoodInsert>;

// Meals
export interface MealRow {
  id: string;
  user_id: string;
  meal_type: MealType;
  logged_at: string;
  notes: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
export type MealInsert = Omit<MealRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type MealUpdate = Partial<MealInsert>;

// Meal Items
export interface MealItemRow {
  id: string;
  meal_id: string;
  food_id: string | null;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  created_at: string;
}
export type MealItemInsert = Omit<MealItemRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
export type MealItemUpdate = Partial<MealItemInsert>;

// Weight Log
export interface WeightLogRow {
  id: string;
  user_id: string;
  weight_kg: number;
  unit: WeightUnit;
  logged_at: string;
  notes: string | null;
  created_at: string;
}
export type WeightLogInsert = Omit<WeightLogRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
export type WeightLogUpdate = Partial<WeightLogInsert>;

// Food Images
export interface FoodImageRow {
  id: string;
  user_id: string;
  meal_id: string | null;
  image_url: string;
  storage_path: string | null;
  analysis_status: AnalysisStatus;
  analysis_result: Record<string, unknown> | null;
  created_at: string;
}
export type FoodImageInsert = Omit<FoodImageRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
export type FoodImageUpdate = Partial<FoodImageInsert>;
