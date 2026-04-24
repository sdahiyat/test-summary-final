import { NextRequest, NextResponse } from 'next/server';
import {
  calculateNutritionTargets,
  UserBiometrics,
  GoalType,
  ActivityLevel,
  Sex,
} from '@/lib/nutrition-calculator';
import { VALIDATION_RULES } from '@/lib/validations/profile';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { age, heightCm, weightKg, sex, activityLevel, goalType } = body as Record<string, unknown>;

  const errors: Record<string, string> = {};

  const ageNum = Number(age);
  if (!age && age !== 0) {
    errors.age = 'Age is required';
  } else if (ageNum < VALIDATION_RULES.age.min || ageNum > VALIDATION_RULES.age.max) {
    errors.age = `Age must be between ${VALIDATION_RULES.age.min} and ${VALIDATION_RULES.age.max}`;
  }

  const heightNum = Number(heightCm);
  if (!heightCm && heightCm !== 0) {
    errors.heightCm = 'Height is required';
  } else if (heightNum < VALIDATION_RULES.height_cm.min || heightNum > VALIDATION_RULES.height_cm.max) {
    errors.heightCm = `Height must be between ${VALIDATION_RULES.height_cm.min} and ${VALIDATION_RULES.height_cm.max} cm`;
  }

  const weightNum = Number(weightKg);
  if (!weightKg && weightKg !== 0) {
    errors.weightKg = 'Weight is required';
  } else if (weightNum < VALIDATION_RULES.weight_kg.min || weightNum > VALIDATION_RULES.weight_kg.max) {
    errors.weightKg = `Weight must be between ${VALIDATION_RULES.weight_kg.min} and ${VALIDATION_RULES.weight_kg.max} kg`;
  }

  const validSexValues = ['male', 'female'];
  if (!sex || !validSexValues.includes(sex as string)) {
    errors.sex = 'Sex must be male or female';
  }

  const validActivityLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
  if (!activityLevel || !validActivityLevels.includes(activityLevel as string)) {
    errors.activityLevel = 'Invalid activity level';
  }

  const validGoalTypes = ['weight_loss', 'maintenance', 'muscle_gain'];
  if (!goalType || !validGoalTypes.includes(goalType as string)) {
    errors.goalType = 'Invalid goal type';
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const biometrics: UserBiometrics = {
    age: ageNum,
    heightCm: heightNum,
    weightKg: weightNum,
    sex: sex as Sex,
    activityLevel: activityLevel as ActivityLevel,
  };

  const targets = calculateNutritionTargets(biometrics, goalType as GoalType);

  return NextResponse.json(targets, { status: 200 });
}
