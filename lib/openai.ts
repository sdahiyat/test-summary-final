import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    'Missing required environment variable: OPENAI_API_KEY. ' +
    'Please add it to your .env.local file.'
  );
}

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const VISION_MODEL = 'gpt-4o';

export interface FoodItem {
  name: string;
  estimatedCalories: number;
  estimatedProtein?: number;
  estimatedCarbs?: number;
  estimatedFat?: number;
  servingSize?: string;
  confidence: number;
}

export interface FoodAnalysisResult {
  foods: FoodItem[];
  totalCalories: number;
  confidence: number;
  rawResponse: string;
}

export function buildVisionPrompt(): string {
  return `You are a nutrition expert and food recognition AI. Your task is to analyze food images and provide detailed nutritional estimates.

When given a food image, respond with a valid JSON object (and nothing else) matching this exact schema:

{
  "foods": [
    {
      "name": "string — common name of the food item",
      "estimatedCalories": "number — estimated calories for the visible portion",
      "estimatedProtein": "number — estimated grams of protein (optional)",
      "estimatedCarbs": "number — estimated grams of carbohydrates (optional)",
      "estimatedFat": "number — estimated grams of fat (optional)",
      "servingSize": "string — estimated serving size description (optional)",
      "confidence": "number between 0 and 1 — your confidence in this identification"
    }
  ],
  "totalCalories": "number — sum of all estimated calories",
  "confidence": "number between 0 and 1 — overall confidence in the analysis"
}

Guidelines:
- Identify ALL distinct food items visible in the image
- Estimate portion sizes based on visual cues (plate size, utensils, context)
- Be conservative with calorie estimates when uncertain
- confidence of 0.9+ means you are very sure, 0.5-0.7 means moderate uncertainty
- If you cannot identify the food, still make your best guess with a low confidence score
- Always return valid JSON with no markdown formatting, no code blocks, just raw JSON`;
}
