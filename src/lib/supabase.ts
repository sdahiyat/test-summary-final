import { createClient } from '@supabase/supabase-js';

import type {
  UserRow,
  UserInsert,
  UserUpdate,
  UserGoalRow,
  UserGoalInsert,
  UserGoalUpdate,
  FoodRow,
  FoodInsert,
  FoodUpdate,
  MealRow,
  MealInsert,
  MealUpdate,
  MealItemRow,
  MealItemInsert,
  MealItemUpdate,
  WeightLogRow,
  WeightLogInsert,
  WeightLogUpdate,
  FoodImageRow,
  FoodImageInsert,
  FoodImageUpdate,
} from './supabase.types';

// Re-export all types from the companion types file for convenience
export type {
  MealType,
  GoalType,
  GenderType,
  ActivityLevelType,
  WeightUnit,
  AnalysisStatus,
  UserRow,
  UserInsert,
  UserUpdate,
  UserGoalRow,
  UserGoalInsert,
  UserGoalUpdate,
  FoodRow,
  FoodInsert,
  FoodUpdate,
  MealRow,
  MealInsert,
  MealUpdate,
  MealItemRow,
  MealItemInsert,
  MealItemUpdate,
  WeightLogRow,
  WeightLogInsert,
  WeightLogUpdate,
  FoodImageRow,
  FoodImageInsert,
  FoodImageUpdate,
} from './supabase.types';

// ============================================================
// Database type definition matching the Supabase-generated
// type convention — kept in sync with the SQL migration.
// ============================================================
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

// ============================================================
// Convenience type helper — mirrors Supabase CLI generated output
// Usage: Tables<'users'> gives you UserRow, etc.
// ============================================================
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

// ============================================================
// Environment variable validation
// Validated eagerly at module load time so misconfiguration is
// caught immediately on server startup rather than at query time.
// ============================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    '[supabase] Missing environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
      'Please add it to your .env.local file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    '[supabase] Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      'Please add it to your .env.local file.'
  );
}

// ============================================================
// Singleton browser/client-side Supabase client
// Safe to import in Client Components and browser code.
// ============================================================
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ============================================================
// Server-side Supabase client factory
//
// ⚠️  WARNING: Only import / call this function in server-side
// code (API routes, Server Components, Server Actions).
// Passing useServiceRole = true uses the SUPABASE_SERVICE_ROLE_KEY
// which bypasses RLS — never expose it to the browser bundle.
// ============================================================
export function createServerClient(useServiceRole = false) {
  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (useServiceRole && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      '[supabase] Missing environment variable: SUPABASE_SERVICE_ROLE_KEY\n' +
        'This key is required when useServiceRole is true.'
    );
  }

  return createClient<Database>(supabaseUrl as string, key, {
    auth: {
      persistSession: false,
    },
  });
}
