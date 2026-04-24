export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type GoalType = 'weight_loss' | 'maintenance' | 'muscle_gain';
export type Sex = 'male' | 'female';

export interface UserBiometrics {
  age: number;
  heightCm: number;
  weightKg: number;
  sex: Sex;
  activityLevel: ActivityLevel;
}

export interface NutritionTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export function calculateBMR(b: UserBiometrics): number {
  const base = 10 * b.weightKg + 6.25 * b.heightCm - 5 * b.age;
  return b.sex === 'male' ? base + 5 : base - 161;
}

export function getActivityMultiplier(level: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return multipliers[level];
}

export function calculateTDEE(b: UserBiometrics): number {
  return Math.round(calculateBMR(b) * getActivityMultiplier(b.activityLevel));
}

export function calculateNutritionTargets(b: UserBiometrics, goal: GoalType): NutritionTargets {
  const tdee = calculateTDEE(b);

  let calories: number;
  let proteinPerKg: number;

  switch (goal) {
    case 'weight_loss':
      calories = Math.max(1200, tdee - 500);
      proteinPerKg = 2.2;
      break;
    case 'muscle_gain':
      calories = tdee + 250;
      proteinPerKg = 2.5;
      break;
    case 'maintenance':
    default:
      calories = tdee;
      proteinPerKg = 1.8;
      break;
  }

  const proteinG = Math.round(proteinPerKg * b.weightKg);
  const fatG = Math.round((calories * 0.25) / 9);
  const proteinCalories = proteinG * 4;
  const fatCalories = fatG * 9;
  const carbsG = Math.round((calories - proteinCalories - fatCalories) / 4);

  return {
    calories: Math.round(calories),
    proteinG,
    carbsG: Math.max(0, carbsG),
    fatG,
  };
}

export function convertHeight(feet: number, inches: number): number {
  return Math.round((feet * 30.48 + inches * 2.54) * 10) / 10;
}

export function convertWeight(lbs: number): number {
  return Math.round((lbs * 0.453592) * 10) / 10;
}
