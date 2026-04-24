export const VALIDATION_RULES = {
  age: { min: 13, max: 120 },
  height_cm: { min: 50, max: 300 },
  weight_kg: { min: 20, max: 500 },
  daily_calories: { min: 800, max: 10000 },
};

export function validateProfile(data: unknown): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _general: 'Invalid data' } };
  }

  const d = data as Record<string, unknown>;

  // full_name
  if (!d.full_name || typeof d.full_name !== 'string' || d.full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters';
  }

  // age
  const age = Number(d.age);
  if (!d.age && d.age !== 0) {
    errors.age = 'Age is required';
  } else if (!Number.isInteger(age) || age < VALIDATION_RULES.age.min || age > VALIDATION_RULES.age.max) {
    errors.age = `Age must be an integer between ${VALIDATION_RULES.age.min} and ${VALIDATION_RULES.age.max}`;
  }

  // height_cm
  const height = Number(d.height_cm);
  if (!d.height_cm && d.height_cm !== 0) {
    errors.height_cm = 'Height is required';
  } else if (isNaN(height) || height < VALIDATION_RULES.height_cm.min || height > VALIDATION_RULES.height_cm.max) {
    errors.height_cm = `Height must be between ${VALIDATION_RULES.height_cm.min} and ${VALIDATION_RULES.height_cm.max} cm`;
  }

  // weight_kg
  const weight = Number(d.weight_kg);
  if (!d.weight_kg && d.weight_kg !== 0) {
    errors.weight_kg = 'Weight is required';
  } else if (isNaN(weight) || weight < VALIDATION_RULES.weight_kg.min || weight > VALIDATION_RULES.weight_kg.max) {
    errors.weight_kg = `Weight must be between ${VALIDATION_RULES.weight_kg.min} and ${VALIDATION_RULES.weight_kg.max} kg`;
  }

  // sex
  if (!d.sex || (d.sex !== 'male' && d.sex !== 'female')) {
    errors.sex = 'Sex must be male or female';
  }

  // activity_level (optional but if present must be valid)
  const validActivityLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
  if (d.activity_level !== undefined && !validActivityLevels.includes(d.activity_level as string)) {
    errors.activity_level = 'Invalid activity level';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateGoals(data: unknown): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _general: 'Invalid data' } };
  }

  const d = data as Record<string, unknown>;

  // goal_type
  const validGoalTypes = ['weight_loss', 'maintenance', 'muscle_gain'];
  if (!d.goal_type || !validGoalTypes.includes(d.goal_type as string)) {
    errors.goal_type = 'Goal type must be weight_loss, maintenance, or muscle_gain';
  }

  // target_weight_kg (optional, only validate if present and not null)
  if (d.target_weight_kg !== null && d.target_weight_kg !== undefined && d.target_weight_kg !== '') {
    const targetWeight = Number(d.target_weight_kg);
    if (isNaN(targetWeight) || targetWeight < VALIDATION_RULES.weight_kg.min || targetWeight > VALIDATION_RULES.weight_kg.max) {
      errors.target_weight_kg = `Target weight must be between ${VALIDATION_RULES.weight_kg.min} and ${VALIDATION_RULES.weight_kg.max} kg`;
    }
  }

  // daily_calories
  const calories = Number(d.daily_calories);
  if (!d.daily_calories && d.daily_calories !== 0) {
    errors.daily_calories = 'Daily calories is required';
  } else if (!Number.isInteger(calories) || calories < VALIDATION_RULES.daily_calories.min || calories > VALIDATION_RULES.daily_calories.max) {
    errors.daily_calories = `Daily calories must be between ${VALIDATION_RULES.daily_calories.min} and ${VALIDATION_RULES.daily_calories.max}`;
  }

  // daily_protein_g
  const protein = Number(d.daily_protein_g);
  if (!d.daily_protein_g && d.daily_protein_g !== 0) {
    errors.daily_protein_g = 'Daily protein is required';
  } else if (!Number.isInteger(protein) || protein <= 0) {
    errors.daily_protein_g = 'Daily protein must be a positive integer';
  }

  // daily_carbs_g
  const carbs = Number(d.daily_carbs_g);
  if (!d.daily_carbs_g && d.daily_carbs_g !== 0) {
    errors.daily_carbs_g = 'Daily carbs is required';
  } else if (!Number.isInteger(carbs) || carbs <= 0) {
    errors.daily_carbs_g = 'Daily carbs must be a positive integer';
  }

  // daily_fat_g
  const fat = Number(d.daily_fat_g);
  if (!d.daily_fat_g && d.daily_fat_g !== 0) {
    errors.daily_fat_g = 'Daily fat is required';
  } else if (!Number.isInteger(fat) || fat <= 0) {
    errors.daily_fat_g = 'Daily fat must be a positive integer';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
