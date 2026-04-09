export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  serving_size: number;
  serving_unit: string;
  category: string | null;
  created_at: string;
}

export interface FoodSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export interface FoodSearchResponse {
  data: Food[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query: {
    q?: string;
    category?: string;
  };
}

export type FoodCategory =
  | 'fruits'
  | 'vegetables'
  | 'proteins'
  | 'dairy'
  | 'grains'
  | 'legumes'
  | 'nuts'
  | 'beverages'
  | 'snacks'
  | 'fast_food'
  | 'condiments'
  | 'prepared'
  | 'seafood';
