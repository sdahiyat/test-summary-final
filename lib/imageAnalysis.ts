import { openaiClient, VISION_MODEL, buildVisionPrompt, FoodAnalysisResult, FoodItem } from './openai';

export class ImageAnalysisError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'ImageAnalysisError';
  }
}

export async function analyzeFoodImage(imageUrl: string): Promise<FoodAnalysisResult> {
  let rawResponse = '';

  try {
    const completion = await openaiClient.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: 'system',
          content: buildVisionPrompt(),
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: 'Analyze this food image and return the structured JSON.',
            },
          ],
        },
      ],
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    rawResponse = completion.choices[0]?.message?.content ?? '';

    if (!rawResponse) {
      throw new ImageAnalysisError('OpenAI returned an empty response');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (parseError) {
      throw new ImageAnalysisError(
        `Failed to parse OpenAI response as JSON: ${rawResponse}`,
        parseError
      );
    }

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('foods' in parsed) ||
      !Array.isArray((parsed as Record<string, unknown>).foods) ||
      !('totalCalories' in parsed) ||
      typeof (parsed as Record<string, unknown>).totalCalories !== 'number'
    ) {
      throw new ImageAnalysisError(
        'OpenAI response is missing required fields (foods array, totalCalories)'
      );
    }

    const data = parsed as {
      foods: FoodItem[];
      totalCalories: number;
      confidence?: number;
    };

    const foods: FoodItem[] = data.foods.map((food) => ({
      name: food.name ?? 'Unknown food',
      estimatedCalories: Number(food.estimatedCalories) || 0,
      estimatedProtein: food.estimatedProtein !== undefined ? Number(food.estimatedProtein) : undefined,
      estimatedCarbs: food.estimatedCarbs !== undefined ? Number(food.estimatedCarbs) : undefined,
      estimatedFat: food.estimatedFat !== undefined ? Number(food.estimatedFat) : undefined,
      servingSize: food.servingSize,
      confidence: Math.min(1, Math.max(0, Number(food.confidence) || 0.5)),
    }));

    const overallConfidence =
      data.confidence !== undefined
        ? Math.min(1, Math.max(0, Number(data.confidence)))
        : foods.length > 0
        ? foods.reduce((sum, food) => sum + food.confidence, 0) / foods.length
        : 0;

    return {
      foods,
      totalCalories: Number(data.totalCalories) || 0,
      confidence: overallConfidence,
      rawResponse,
    };
  } catch (error) {
    if (error instanceof ImageAnalysisError) {
      throw error;
    }

    throw new ImageAnalysisError(
      `OpenAI vision API request failed: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
}
