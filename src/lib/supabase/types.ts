// ============================================================
// NutriTrack Database Types
// Single source of truth for all database entity shapes.
// ============================================================

// ----------------------------------------------------------
// Enum Types
// ----------------------------------------------------------
export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active'

export type GoalType =
  | 'lose_weight'
  | 'maintain_weight'
  | 'gain_weight'
  | 'build_muscle'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type FoodSource = 'manual' | 'ai_detected' | 'usda' | 'custom'

export type InsightType = 'habit' | 'recommendation' | 'achievement' | 'warning'

// ----------------------------------------------------------
// Row Types (what you get back from SELECT queries)
// ----------------------------------------------------------
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  daily_calories: number | null
  daily_protein_g: number | null
  daily_carbs_g: number | null
  daily_fat_g: number | null
  daily_fiber_g: number | null
  target_weight_kg: number | null
  current_weight_kg: number | null
  activity_level: ActivityLevel | null
  goal_type: GoalType | null
  created_at: string
  updated_at: string
}

export interface Food {
  id: string
  user_id: string | null
  name: string
  brand: string | null
  serving_size_g: number
  calories_per_serving: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number | null
  sugar_g: number | null
  sodium_mg: number | null
  is_verified: boolean
  source: FoodSource
  created_at: string
  updated_at: string
}

export interface Meal {
  id: string
  user_id: string
  logged_at: string
  meal_type: MealType
  notes: string | null
  photo_url: string | null
  ai_analysis_raw: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface MealItem {
  id: string
  meal_id: string
  food_id: string
  quantity_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number | null
  created_at: string
}

export interface DailyLog {
  id: string
  user_id: string
  log_date: string
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fat_g: number
  total_fiber_g: number
  water_ml: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Insight {
  id: string
  user_id: string
  insight_type: InsightType
  title: string
  body: string
  metadata: Record<string, unknown> | null
  is_read: boolean
  generated_at: string
  expires_at: string | null
}

// ----------------------------------------------------------
// Insert Types (for creating new rows)
// ----------------------------------------------------------
export interface ProfileInsert {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
}

export interface GoalInsert {
  id?: string
  user_id: string
  daily_calories?: number | null
  daily_protein_g?: number | null
  daily_carbs_g?: number | null
  daily_fat_g?: number | null
  daily_fiber_g?: number | null
  target_weight_kg?: number | null
  current_weight_kg?: number | null
  activity_level?: ActivityLevel | null
  goal_type?: GoalType | null
}

export interface FoodInsert {
  id?: string
  user_id?: string | null
  name: string
  brand?: string | null
  serving_size_g?: number
  calories_per_serving: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  fiber_g?: number | null
  sugar_g?: number | null
  sodium_mg?: number | null
  is_verified?: boolean
  source?: FoodSource
}

export interface MealInsert {
  id?: string
  user_id: string
  logged_at?: string
  meal_type: MealType
  notes?: string | null
  photo_url?: string | null
  ai_analysis_raw?: Record<string, unknown> | null
}

export interface MealItemInsert {
  id?: string
  meal_id: string
  food_id: string
  quantity_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g?: number | null
}

export interface DailyLogInsert {
  id?: string
  user_id: string
  log_date: string
  total_calories?: number
  total_protein_g?: number
  total_carbs_g?: number
  total_fat_g?: number
  total_fiber_g?: number
  water_ml?: number
  notes?: string | null
}

export interface InsightInsert {
  id?: string
  user_id: string
  insight_type: InsightType
  title: string
  body: string
  metadata?: Record<string, unknown> | null
  is_read?: boolean
  expires_at?: string | null
}

// ----------------------------------------------------------
// Update Types (for updating existing rows — all fields optional)
// ----------------------------------------------------------
export type ProfileUpdate = Partial<Omit<ProfileInsert, 'id'>>
export type GoalUpdate = Partial<Omit<GoalInsert, 'id' | 'user_id'>>
export type FoodUpdate = Partial<Omit<FoodInsert, 'id' | 'user_id'>>
export type MealUpdate = Partial<Omit<MealInsert, 'id' | 'user_id'>>
export type MealItemUpdate = Partial<Omit<MealItemInsert, 'id' | 'meal_id' | 'food_id'>>
export type DailyLogUpdate = Partial<Omit<DailyLogInsert, 'id' | 'user_id' | 'log_date'>>
export type InsightUpdate = Partial<Omit<InsightInsert, 'id' | 'user_id'>>

// ----------------------------------------------------------
// Database Interface (Supabase-style)
// ----------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      goals: {
        Row: Goal
        Insert: GoalInsert
        Update: GoalUpdate
      }
      foods: {
        Row: Food
        Insert: FoodInsert
        Update: FoodUpdate
      }
      meals: {
        Row: Meal
        Insert: MealInsert
        Update: MealUpdate
      }
      meal_items: {
        Row: MealItem
        Insert: MealItemInsert
        Update: MealItemUpdate
      }
      daily_logs: {
        Row: DailyLog
        Insert: DailyLogInsert
        Update: DailyLogUpdate
      }
      insights: {
        Row: Insight
        Insert: InsightInsert
        Update: InsightUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      activity_level: ActivityLevel
      goal_type: GoalType
      meal_type: MealType
      food_source: FoodSource
      insight_type: InsightType
    }
  }
}

// ----------------------------------------------------------
// Composite / Joined Types
// ----------------------------------------------------------

/** A meal with its items and each item's associated food details */
export type MealWithItems = Meal & {
  meal_items: (MealItem & { food: Food })[]
}

/** A daily log with all its meals (each meal including items and foods) */
export type DailyLogWithMeals = DailyLog & {
  meals: MealWithItems[]
}
