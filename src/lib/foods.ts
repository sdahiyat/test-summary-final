export type Food = {
  id: string;
  name: string;
  brand: string | null;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  is_verified: boolean;
};

export type FoodSearchResponse = {
  data: Food[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SearchFoodsOptions = {
  q: string;
  page?: number;
  limit?: number;
};

export async function searchFoods(
  options: SearchFoodsOptions
): Promise<FoodSearchResponse> {
  const { q, page = 1, limit = 20 } = options;

  const params = new URLSearchParams({
    q,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`/api/foods/search?${params.toString()}`);

  if (!response.ok) {
    let message = `Search failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors — keep the default message
    }
    throw new Error(message);
  }

  return response.json() as Promise<FoodSearchResponse>;
}

export async function getFoodById(id: string): Promise<Food | null> {
  const response = await fetch(`/api/foods/${encodeURIComponent(id)}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    let message = `Failed to fetch food with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return response.json() as Promise<Food>;
}

/**
 * Calculate nutrition for a given food and quantity.
 *
 * @param food     - The food item (with per-serving nutrition values).
 * @param quantity - The amount in the same units as `food.serving_unit`.
 * @returns Scaled nutrition values rounded to one decimal place.
 */
export function calculateNutrition(
  food: Food,
  quantity: number
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
} {
  const ratio = quantity / food.serving_size;

  const round = (value: number) => Math.round(value * 10) / 10;

  return {
    calories: round(food.calories * ratio),
    protein: round(food.protein * ratio),
    carbs: round(food.carbs * ratio),
    fat: round(food.fat * ratio),
    fiber: food.fiber !== null ? round(food.fiber * ratio) : null,
    sugar: food.sugar !== null ? round(food.sugar * ratio) : null,
    sodium: food.sodium !== null ? round(food.sodium * ratio) : null,
  };
}
