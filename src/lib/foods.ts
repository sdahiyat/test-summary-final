// Single source of truth for the FoodItem type and food-related utilities

export interface FoodItem {
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
  created_at: string;
  updated_at: string;
}

export interface FoodSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export interface FoodSearchResult {
  data: FoodItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface NutritionValues {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

export const COMMON_SERVING_UNITS = [
  'g',
  'oz',
  'cup',
  'tbsp',
  'tsp',
  'piece',
  'slice',
  'medium',
  'large',
  'small',
  'ml',
  'fl oz',
  'serving',
] as const;

export type ServingUnit = (typeof COMMON_SERVING_UNITS)[number];

/**
 * Search foods using the API endpoint with partial matching and pagination.
 */
export async function searchFoods(params: FoodSearchParams): Promise<FoodSearchResult> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.category) searchParams.set('category', params.category);

  const url = `/api/foods/search${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Search failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch a single food item by its UUID.
 * Returns null if the food is not found (404).
 */
export async function getFoodById(id: string): Promise<FoodItem | null> {
  const response = await fetch(`/api/foods/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch food with status ${response.status}`);
  }

  return response.json();
}

/**
 * Calculate nutrition values for a given quantity of a food item.
 * Scales all macros proportionally based on (quantity / serving_size).
 */
export function calculateNutrition(food: FoodItem, quantity: number): NutritionValues {
  const ratio = quantity / food.serving_size;

  const round1 = (n: number) => Math.round(n * 10) / 10;

  return {
    calories: round1(food.calories * ratio),
    protein_g: round1(food.protein_g * ratio),
    carbs_g: round1(food.carbs_g * ratio),
    fat_g: round1(food.fat_g * ratio),
    fiber_g: round1((food.fiber_g ?? 0) * ratio),
  };
}

/**
 * Format a food's serving for display (e.g., "28 g", "1 cup").
 */
export function formatServing(food: FoodItem): string {
  return `${food.serving_size} ${food.serving_unit}`;
}

/**
 * Get a display-friendly name for a food item.
 */
export function getFoodDisplayName(food: FoodItem): string {
  if (food.brand) {
    return `${food.name} (${food.brand})`;
  }
  return food.name;
}
