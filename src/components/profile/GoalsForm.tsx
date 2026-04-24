'use client';

import { useState, useCallback } from 'react';
import type { UserGoals, UserProfile } from '@/hooks/useProfile';

interface GoalsFormProps {
  initialGoals: Partial<UserGoals>;
  initialProfile: Partial<UserProfile>;
  onSave: (data: Partial<UserGoals>) => Promise<void>;
}

const goalOptions = [
  {
    value: 'weight_loss',
    label: 'Lose Weight',
    icon: '🔥',
    description: 'Reduce body fat with a calorie deficit',
  },
  {
    value: 'maintenance',
    label: 'Maintain Weight',
    icon: '⚖️',
    description: 'Stay at your current weight',
  },
  {
    value: 'muscle_gain',
    label: 'Build Muscle',
    icon: '💪',
    description: 'Gain lean mass with a calorie surplus',
  },
];

interface FieldErrors {
  goal_type?: string;
  target_weight_kg?: string;
  daily_calories?: string;
  daily_protein_g?: string;
  daily_carbs_g?: string;
  daily_fat_g?: string;
}

export function GoalsForm({ initialGoals, initialProfile, onSave }: GoalsFormProps) {
  const [goalType, setGoalType] = useState<string>(initialGoals.goal_type ?? '');
  const [targetWeightKg, setTargetWeightKg] = useState(
    initialGoals.target_weight_kg != null ? String(initialGoals.target_weight_kg) : ''
  );
  const [calories, setCalories] = useState(initialGoals.daily_calories ? String(initialGoals.daily_calories) : '');
  const [protein, setProtein] = useState(initialGoals.daily_protein_g ? String(initialGoals.daily_protein_g) : '');
  const [carbs, setCarbs] = useState(initialGoals.daily_carbs_g ? String(initialGoals.daily_carbs_g) : '');
  const [fat, setFat] = useState(initialGoals.daily_fat_g ? String(initialGoals.daily_fat_g) : '');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  // Macro consistency warning
  const macroCalories =
    Number(protein) * 4 + Number(carbs) * 4 + Number(fat) * 9;
  const caloriesDiff = Math.abs(macroCalories - Number(calories));
  const showMacroWarning =
    calories && protein && carbs && fat && caloriesDiff > 50;

  const handleRecalculate = useCallback(async () => {
    if (
      !initialProfile.age ||
      !initialProfile.height_cm ||
      !initialProfile.weight_kg ||
      !initialProfile.sex ||
      !goalType
    ) {
      return;
    }

    setRecalculating(true);
    try {
      const res = await fetch('/api/profile/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: initialProfile.age,
          heightCm: initialProfile.height_cm,
          weightKg: initialProfile.weight_kg,
          sex: initialProfile.sex,
          activityLevel: initialProfile.activity_level ?? 'moderate',
          goalType: goalType,
        }),
      });

      if (res.ok) {
        const suggestions = await res.json();
        setCalories(String(suggestions.calories));
        setProtein(String(suggestions.proteinG));
        setCarbs(String(suggestions.carbsG));
        setFat(String(suggestions.fatG));
      }
    } catch {
      // Ignore
    } finally {
      setRecalculating(false);
    }
  }, [initialProfile, goalType]);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!goalType) {
      newErrors.goal_type = 'Please select a goal type';
    }

    if (targetWeightKg) {
      const tw = Number(targetWeightKg);
      if (isNaN(tw) || tw < 20 || tw > 500) {
        newErrors.target_weight_kg = 'Target weight must be between 20 and 500 kg';
      }
    }

    const cal = Number(calories);
    if (!calories) {
      newErrors.daily_calories = 'Daily calories is required';
    } else if (!Number.isInteger(cal) || cal < 800 || cal > 10000) {
      newErrors.daily_calories = 'Calories must be between 800 and 10,000';
    }

    const pro = Number(protein);
    if (!protein) {
      newErrors.daily_protein_g = 'Protein is required';
    } else if (!Number.isInteger(pro) || pro <= 0) {
      newErrors.daily_protein_g = 'Protein must be a positive integer';
    }

    const car = Number(carbs);
    if (!carbs) {
      newErrors.daily_carbs_g = 'Carbs is required';
    } else if (!Number.isInteger(car) || car <= 0) {
      newErrors.daily_carbs_g = 'Carbs must be a positive integer';
    }

    const f = Number(fat);
    if (!fat) {
      newErrors.daily_fat_g = 'Fat is required';
    } else if (!Number.isInteger(f) || f <= 0) {
      newErrors.daily_fat_g = 'Fat must be a positive integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSuccess(false);
    setSaveError(null);

    try {
      await onSave({
        goal_type: goalType as UserGoals['goal_type'],
        target_weight_kg: targetWeightKg ? Number(targetWeightKg) : null,
        daily_calories: Number(calories),
        daily_protein_g: Number(protein),
        daily_carbs_g: Number(carbs),
        daily_fat_g: Number(fat),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <p className="text-sm font-medium text-green-700">✓ Changes saved!</p>
        </div>
      )}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600">{saveError}</p>
        </div>
      )}

      {/* Goal type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
        <div className="space-y-3">
          {goalOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGoalType(opt.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                goalType === opt.value
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${goalType === opt.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
        {errors.goal_type && <p className="mt-1 text-xs text-red-500">{errors.goal_type}</p>}
      </div>

      {/* Target weight (conditional) */}
      {goalType && goalType !== 'maintenance' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Weight (kg) <span className="text-gray-400 font-normal">— optional</span>
          </label>
          <input
            type="number"
            value={targetWeightKg}
            onChange={(e) => setTargetWeightKg(e.target.value)}
            placeholder="65"
            step={0.1}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.target_weight_kg ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.target_weight_kg && (
            <p className="mt-1 text-xs text-red-500">{errors.target_weight_kg}</p>
          )}
        </div>
      )}

      {/* Recalculate button */}
      <button
        type="button"
        onClick={handleRecalculate}
        disabled={recalculating || !goalType}
        className="w-full py-2 rounded-lg border-2 border-emerald-600 text-emerald-700 text-sm font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {recalculating ? 'Calculating…' : '↻ Recalculate Suggestions'}
      </button>

      {/* Macro consistency warning */}
      {showMacroWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-sm text-amber-700">
            ⚠ Your macros add up to ~{Math.round(macroCalories)} kcal, but your calorie target is {calories} kcal (difference: {Math.round(caloriesDiff)} kcal). You can still save.
          </p>
        </div>
      )}

      {/* Macro inputs */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Daily Targets</h3>

        {[
          { label: 'Calories', value: calories, setter: setCalories, unit: 'kcal', error: errors.daily_calories },
          { label: 'Protein', value: protein, setter: setProtein, unit: 'g', error: errors.daily_protein_g },
          { label: 'Carbs', value: carbs, setter: setCarbs, unit: 'g', error: errors.daily_carbs_g },
          { label: 'Fat', value: fat, setter: setFat, unit: 'g', error: errors.daily_fat_g },
        ].map(({ label, value, setter, unit, error }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} <span className="text-gray-400 font-normal">({unit})</span>
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setter(e.target.value)}
              min={0}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving…
          </>
        ) : (
          'Save Goals'
        )}
      </button>
    </form>
  );
}
