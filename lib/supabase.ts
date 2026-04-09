import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// Environment Variable Validation
// Fails fast at startup if required variables are missing.
// ============================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.trim() === '') {
  throw new Error(
    '[edtNutriTrack] Missing environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
      'Add it to your .env.local file. See .env.example for reference.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
  throw new Error(
    '[edtNutriTrack] Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      'Add it to your .env.local file. See .env.example for reference.'
  );
}

// ============================================================
// Row Types — exact mirror of database columns
// ============================================================

export type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null; // ISO date string e.g. "1990-01-15"
  gender: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  activity_level:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'extremely_active'
    | null;
  created_at: string;
  updated_at: string;
};

export type UserGoalRow = {
  id: string;
  user_id: string;
  calories_target: number | null;
  protein_g_target: number | null;
  carbs_g_target: number | null;
  fat_g_target: number | null;
  fiber_g_target: number | null;
  water_ml_target: number | null;
  goal_type: 'weight_loss' | 'maintenance' | 'muscle_gain' | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type FoodRow = {
  id: string;
  name: string;
  brand: string | null;
  barcode: string | null;
  serving_size_g: number;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number | null;
  sugar_per_100g: number | null;
  sodium_per_100g: number | null;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type MealRow = {
  id: string;
  user_id: string;
  name: string | null;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  logged_at: string; // ISO timestamp string
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type MealItemRow = {
  id: string;
  meal_id: string;
  food_id: string;
  quantity_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  created_at: string;
};

export type WeightLogRow = {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string; // ISO date string e.g. "2024-01-15"
  notes: string | null;
  created_at: string;
};

export type FoodImageRow = {
  id: string;
  user_id: string;
  meal_item_id: string | null;
  storage_path: string;
  original_filename: string | null;
  ai_analysis: Record<string, unknown> | null;
  ai_confidence: number | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
};

// ============================================================
// Insert Types — required fields mandatory; server-defaults optional
// ============================================================

export type UserInsert = {
  id: string; // must match auth.users id
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  height_cm?: number | null;
  activity_level?:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'extremely_active'
    | null;
  created_at?: string;
  updated_at?: string;
};

export type UserGoalInsert = {
  id?: string;
  user_id: string; // required — always scoped to a user
  calories_target?: number | null;
  protein_g_target?: number | null;
  carbs_g_target?: number | null;
  fat_g_target?: number | null;
  fiber_g_target?: number | null;
  water_ml_target?: number | null;
  goal_type?: 'weight_loss' | 'maintenance' | 'muscle_gain' | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FoodInsert = {
  id?: string;
  name: string;
  brand?: string | null;
  barcode?: string | null;
  serving_size_g?: number;
  calories_per_100g: number;
  protein_per_100g?: number;
  carbs_per_100g?: number;
  fat_per_100g?: number;
  fiber_per_100g?: number | null;
  sugar_per_100g?: number | null;
  sodium_per_100g?: number | null;
  is_verified?: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MealInsert = {
  id?: string;
  user_id: string; // required
  name?: string | null;
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  logged_at?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MealItemInsert = {
  id?: string;
  meal_id: string; // required
  food_id: string; // required
  quantity_g: number;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number | null;
  created_at?: string;
};

export type WeightLogInsert = {
  id?: string;
  user_id: string; // required
  weight_kg: number;
  logged_at?: string;
  notes?: string | null;
  created_at?: string;
};

export type FoodImageInsert = {
  id?: string;
  user_id: string; // required
  meal_item_id?: string | null;
  storage_path: string;
  original_filename?: string | null;
  ai_analysis?: Record<string, unknown> | null;
  ai_confidence?: number | null;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
};

// ============================================================
// Update Types — all fields optional
// ============================================================
export type UserUpdate = Partial<UserInsert>;
export type UserGoalUpdate = Partial<UserGoalInsert>;
export type FoodUpdate = Partial<FoodInsert>;
export type MealUpdate = Partial<MealInsert>;
export type MealItemUpdate = Partial<MealItemInsert>;
export type WeightLogUpdate = Partial<WeightLogInsert>;
export type FoodImageUpdate = Partial<FoodImageInsert>;

// ============================================================
// Database Interface — matches Supabase generated type structure
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
// Convenience Type Aliases
// ============================================================

/**
 * Get the Row type for any table by name.
 * Usage: Tables<'users'> → UserRow
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

/**
 * Enum-like union types derived from Row definitions.
 */
export type Enums = {
  Gender: UserRow['gender'];
  ActivityLevel: UserRow['activity_level'];
  MealType: MealRow['meal_type'];
  GoalType: UserGoalRow['goal_type'];
  ImageStatus: FoodImageRow['status'];
};

// ============================================================
// Browser Supabase Client (Singleton)
// Uses globalThis to prevent multiple instances during
// Next.js hot module replacement in development.
// ============================================================

type SupabaseClientType = SupabaseClient<Database>;

// Extend globalThis to hold the singleton
const globalForSupabase = globalThis as typeof globalThis & {
  __supabaseBrowserClient?: SupabaseClientType;
};

/**
 * Browser-safe Supabase client.
 * Uses the anon key — subject to Row Level Security.
 * Safe to import in client components and server components alike.
 */
export const supabase: SupabaseClientType =
  globalForSupabase.__supabaseBrowserClient ??
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  // Cache the instance on globalThis in development to survive HMR
  globalForSupabase.__supabaseBrowserClient = supabase;
}

// ============================================================
// Server / Admin Supabase Client Factory
//
// ⚠️  WARNING: This function uses the SERVICE ROLE KEY which
// bypasses ALL Row Level Security policies. NEVER import or
// call this function from client-side code or expose it to
// the browser. Use only in:
//   - Next.js API Route Handlers (app/api/**)
//   - Server Actions
//   - Edge Functions / serverless functions
// ============================================================

/**
 * Creates a new Supabase admin client using the service role key.
 * Bypasses RLS — use with caution on the server side only.
 *
 * @throws {Error} If SUPABASE_SERVICE_ROLE_KEY is not set.
 */
export function createServerSupabaseClient(): SupabaseClientType {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey.trim() === '') {
    throw new Error(
      '[edtNutriTrack] Missing environment variable: SUPABASE_SERVICE_ROLE_KEY\n' +
        'This variable is required for server-side admin operations.\n' +
        'Add it to your .env.local file. See .env.example for reference.\n' +
        'NEVER expose this key to the client/browser.'
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
