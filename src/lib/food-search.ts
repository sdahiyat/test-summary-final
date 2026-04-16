import type { Food, FoodSearchParams, FoodSearchResponse } from '@/types/food'

export async function searchFoods(
  params: Partial<FoodSearchParams>
): Promise<FoodSearchResponse> {
  const query = params.query?.trim() ?? ''

  if (!query || query.length < 2) {
    throw new Error('Query too short')
  }

  const urlParams = new URLSearchParams()
  urlParams.set('query', query)

  if (params.category !== undefined) {
    urlParams.set('category', params.category)
  }
  if (params.page !== undefined) {
    urlParams.set('page', String(params.page))
  }
  if (params.page_size !== undefined) {
    urlParams.set('page_size', String(params.page_size))
  }

  const response = await fetch(`/api/foods/search?${urlParams.toString()}`)

  if (!response.ok) {
    let errorMessage = `Search failed with status ${response.status}`
    try {
      const body = await response.json()
      if (body?.error) {
        errorMessage = body.error
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage)
  }

  return response.json() as Promise<FoodSearchResponse>
}

export async function getFoodById(id: string): Promise<Food> {
  const response = await fetch(`/api/foods/${encodeURIComponent(id)}`)

  if (!response.ok) {
    let errorMessage = `Failed to fetch food with status ${response.status}`
    try {
      const body = await response.json()
      if (body?.error) {
        errorMessage = body.error
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage)
  }

  return response.json() as Promise<Food>
}

export function buildServingSizeOptions(
  food: Food
): Array<{ label: string; grams: number }> {
  const options: Array<{ label: string; grams: number }> = []

  // Always include the food's default serving
  options.push({
    label: food.serving_size_label,
    grams: food.serving_size_g,
  })

  // Always include the 100g reference
  if (food.serving_size_g !== 100) {
    options.push({ label: '100g', grams: 100 })
  }

  // Add common supplemental options based on approximate serving size
  const s = food.serving_size_g

  // ~1 oz (28g) — common for nuts, cheese, snacks
  if (Math.abs(s - 28) > 5 && Math.abs(100 - 28) > 5) {
    if (s > 20 && s < 40) {
      // serving is already close to 1 oz, skip
    } else {
      options.push({ label: '1 oz (28g)', grams: 28 })
    }
  }

  // ~1 cup (240ml) — common for liquids
  if (
    food.category === 'beverages' ||
    food.category === 'dairy'
  ) {
    if (Math.abs(s - 240) > 10) {
      options.push({ label: '1 cup (240ml)', grams: 240 })
    }
  }

  // ~1 cup solid (128-165g range)
  if (
    food.category === 'fruits' ||
    food.category === 'vegetables' ||
    food.category === 'grains'
  ) {
    if (Math.abs(s - 128) > 15) {
      options.push({ label: '1 cup (128g)', grams: 128 })
    }
  }

  // Deduplicate by grams value, preserving first occurrence
  const seen = new Set<number>()
  const deduplicated: Array<{ label: string; grams: number }> = []
  for (const option of options) {
    if (!seen.has(option.grams)) {
      seen.add(option.grams)
      deduplicated.push(option)
    }
  }

  return deduplicated
}

export function calculateNutrition(
  food: Food,
  grams: number
): {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number | null
  sugar: number | null
  sodium: number | null
} {
  const factor = grams / 100

  const round1 = (n: number) => Math.round(n * 10) / 10

  return {
    calories: round1(food.calories_per_100g * factor),
    protein: round1(food.protein_per_100g * factor),
    carbs: round1(food.carbs_per_100g * factor),
    fat: round1(food.fat_per_100g * factor),
    fiber: food.fiber_per_100g !== null ? round1(food.fiber_per_100g * factor) : null,
    sugar: food.sugar_per_100g !== null ? round1(food.sugar_per_100g * factor) : null,
    sodium: food.sodium_per_100g !== null ? round1(food.sodium_per_100g * factor) : null,
  }
}
