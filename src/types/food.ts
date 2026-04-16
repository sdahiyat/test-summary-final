export type FoodCategory =
  | 'fruits'
  | 'vegetables'
  | 'grains'
  | 'protein'
  | 'dairy'
  | 'fats_oils'
  | 'beverages'
  | 'snacks'
  | 'condiments'
  | 'prepared_meals'
  | 'legumes'
  | 'nuts_seeds'

export interface Food {
  id: string
  name: string
  brand: string | null
  category: FoodCategory
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  fiber_per_100g: number | null
  sugar_per_100g: number | null
  sodium_per_100g: number | null
  serving_size_g: number
  serving_size_label: string
  is_verified: boolean
  created_at: string
}

export interface FoodSearchResult extends Food {
  relevance_score?: number
}

export interface FoodSearchParams {
  query: string
  category?: FoodCategory
  page: number
  page_size: number
}

export interface FoodSearchResponse {
  data: FoodSearchResult[]
  total: number
  page: number
  page_size: number
  has_more: boolean
}

export type SeedFood = Omit<Food, 'id' | 'created_at' | 'is_verified'> & {
  is_verified?: boolean
}
