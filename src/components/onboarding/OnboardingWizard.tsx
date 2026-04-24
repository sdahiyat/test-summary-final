'use client';

import { useState, useEffect, useCallback } from 'react';
import { StepIndicator } from './StepIndicator';
import { convertHeight, convertWeight } from '@/lib/nutrition-calculator';

interface FormData {
  full_name: string;
  sex: 'male' | 'female' | '';
  age: string;
  activity_level: string;
  height_cm: string;
  weight_kg: string;
  goal_type: 'weight_loss' | 'maintenance' | 'muscle_gain' | '';
  target_weight_kg: string;
  daily_calories: string;
  daily_protein_g: string;
  daily_carbs_g: string;
  daily_fat_g: string;
}

const initialFormData: FormData = {
  full_name: '',
  sex: '',
  age: '',
  activity_level: 'moderate',
  height_cm: '',
  weight_kg: '',
  goal_type: '',
  target_weight_kg: '',
  daily_calories: '',
  daily_protein_g: '',
  daily_carbs_g: '',
  daily_fat_g: '',
};

interface OnboardingWizardProps {
  onComplete: () => void;
}

const STEP_LABELS = ['Personal Info', 'Body Metrics', 'Your Goals', 'Review'];

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Light', description: '1–3 days/week' },
  { value: 'moderate', label: 'Moderate', description: '3–5 days/week' },
  { value: 'active', label: 'Active', description: '6–7 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise daily' },
];

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

function validateStep(step: number, data: FormData): string[] {
  const errors: string[] = [];

  if (step === 0) {
    if (!data.full_name || data.full_name.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }
    if (!data.sex) {
      errors.push('Please select your sex');
    }
    const age = Number(data.age);
    if (!data.age) {
      errors.push('Age is required');
    } else if (!Number.isInteger(age) || age < 13 || age > 120) {
      errors.push('Age must be between 13 and 120');
    }
    if (!data.activity_level) {
      errors.push('Please select your activity level');
    }
  }

  if (step === 1) {
    const height = Number(data.height_cm);
    if (!data.height_cm) {
      errors.push('Height is required');
    } else if (isNaN(height) || height < 50 || height > 300) {
      errors.push('Height must be between 50 and 300 cm');
    }
    const weight = Number(data.weight_kg);
    if (!data.weight_kg) {
      errors.push('Weight is required');
    } else if (isNaN(weight) || weight < 20 || weight > 500) {
      errors.push('Weight must be between 20 and 500 kg');
    }
  }

  if (step === 2) {
    if (!data.goal_type) {
      errors.push('Please select a goal');
    }
    if (!data.daily_calories) {
      errors.push('Daily calories is required');
    }
  }

  return errors;
}

// Step 0: Personal Info
function PersonalInfoStep({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: string[];
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="text-sm text-gray-500 mt-1">We'll use this to personalise your experience</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((e) => (
            <p key={e} className="text-sm text-red-600">• {e}</p>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          value={data.full_name}
          onChange={(e) => onChange('full_name', e.target.value)}
          placeholder="Jane Smith"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange('sex', s)}
              className={`py-2.5 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                data.sex === s
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {s === 'male' ? '♂ Male' : '♀ Female'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input
          type="number"
          value={data.age}
          onChange={(e) => onChange('age', e.target.value)}
          placeholder="25"
          min={13}
          max={120}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
        <div className="space-y-2">
          {activityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange('activity_level', opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                data.activity_level === opt.value
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`text-sm font-medium ${data.activity_level === opt.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                {opt.label}
              </span>
              <span className="text-xs text-gray-400">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 1: Body Metrics
function BodyMetricsStep({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: string[];
}) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [lbs, setLbs] = useState('');

  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
  };

  const handleFeetInchesChange = (newFeet: string, newInches: string) => {
    setFeet(newFeet);
    setInches(newInches);
    const f = Number(newFeet) || 0;
    const i = Number(newInches) || 0;
    if (f > 0 || i > 0) {
      const cm = convertHeight(f, i);
      onChange('height_cm', String(cm));
    }
  };

  const handleLbsChange = (newLbs: string) => {
    setLbs(newLbs);
    if (newLbs) {
      const kg = convertWeight(Number(newLbs));
      onChange('weight_kg', String(kg));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Your body measurements</h2>
        <p className="text-sm text-gray-500 mt-1">Used to calculate your calorie targets</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((e) => (
            <p key={e} className="text-sm text-red-600">• {e}</p>
          ))}
        </div>
      )}

      {/* Unit toggle */}
      <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 w-fit">
        {(['metric', 'imperial'] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => handleUnitChange(u)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
              unit === u ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
        {unit === 'metric' ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={data.height_cm}
              onChange={(e) => onChange('height_cm', e.target.value)}
              placeholder="170"
              min={50}
              max={300}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">cm</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={feet}
              onChange={(e) => handleFeetInchesChange(e.target.value, inches)}
              placeholder="5"
              min={1}
              max={8}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500">ft</span>
            <input
              type="number"
              value={inches}
              onChange={(e) => handleFeetInchesChange(feet, e.target.value)}
              placeholder="8"
              min={0}
              max={11}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500">in</span>
            {data.height_cm && (
              <span className="text-xs text-gray-400">({Number(data.height_cm).toFixed(1)} cm)</span>
            )}
          </div>
        )}
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight</label>
        {unit === 'metric' ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={data.weight_kg}
              onChange={(e) => onChange('weight_kg', e.target.value)}
              placeholder="70"
              min={20}
              max={500}
              step={0.1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500">kg</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={lbs}
              onChange={(e) => handleLbsChange(e.target.value)}
              placeholder="154"
              min={44}
              max={1100}
              step={0.1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500">lbs</span>
            {data.weight_kg && (
              <span className="text-xs text-gray-400">({Number(data.weight_kg).toFixed(1)} kg)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Step 2: Goals
function GoalsStep({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: string[];
}) {
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);

  const fetchSuggestions = useCallback(
    async (goalType: string) => {
      if (!data.age || !data.height_cm || !data.weight_kg || !data.sex || !data.activity_level) return;

      setLoadingSuggestions(true);
      try {
        const res = await fetch('/api/profile/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age: Number(data.age),
            heightCm: Number(data.height_cm),
            weightKg: Number(data.weight_kg),
            sex: data.sex,
            activityLevel: data.activity_level,
            goalType,
          }),
        });

        if (res.ok) {
          const suggestions = await res.json();
          onChange('daily_calories', String(suggestions.calories));
          onChange('daily_protein_g', String(suggestions.proteinG));
          onChange('daily_carbs_g', String(suggestions.carbsG));
          onChange('daily_fat_g', String(suggestions.fatG));
          setSuggestionsLoaded(true);
        }
      } catch {
        // Ignore suggestion errors
      } finally {
        setLoadingSuggestions(false);
      }
    },
    [data.age, data.height_cm, data.weight_kg, data.sex, data.activity_level, onChange]
  );

  useEffect(() => {
    if (data.goal_type && !suggestionsLoaded) {
      fetchSuggestions(data.goal_type);
    }
  }, [data.goal_type, fetchSuggestions, suggestionsLoaded]);

  const handleGoalTypeChange = (goalType: string) => {
    onChange('goal_type', goalType);
    setSuggestionsLoaded(false);
    fetchSuggestions(goalType);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">What's your goal?</h2>
        <p className="text-sm text-gray-500 mt-1">We'll suggest the right calorie targets for you</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((e) => (
            <p key={e} className="text-sm text-red-600">• {e}</p>
          ))}
        </div>
      )}

      {/* Goal type selection */}
      <div className="space-y-3">
        {goalOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleGoalTypeChange(opt.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.goal_type === opt.value
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${data.goal_type === opt.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                {opt.label}
              </p>
              <p className="text-xs text-gray-500">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Target weight (conditional) */}
      {data.goal_type && data.goal_type !== 'maintenance' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Weight (kg) <span className="text-gray-400 font-normal">— optional</span>
          </label>
          <input
            type="number"
            value={data.target_weight_kg}
            onChange={(e) => onChange('target_weight_kg', e.target.value)}
            placeholder="65"
            min={20}
            max={500}
            step={0.1}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Suggestions preview */}
      {data.goal_type && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Suggested Daily Targets</p>
            {loadingSuggestions && (
              <span className="text-xs text-emerald-600 animate-pulse">Calculating…</span>
            )}
          </div>

          {loadingSuggestions ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <MacroInput
                label="Calories"
                value={data.daily_calories}
                unit="kcal"
                onChange={(v) => onChange('daily_calories', v)}
              />
              <MacroInput
                label="Protein"
                value={data.daily_protein_g}
                unit="g"
                onChange={(v) => onChange('daily_protein_g', v)}
              />
              <MacroInput
                label="Carbs"
                value={data.daily_carbs_g}
                unit="g"
                onChange={(v) => onChange('daily_carbs_g', v)}
              />
              <MacroInput
                label="Fat"
                value={data.daily_fat_g}
                unit="g"
                onChange={(v) => onChange('daily_fat_g', v)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MacroInput({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: string;
  unit: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-16 shrink-0">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={0}
        className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
      <span className="text-xs text-gray-400 w-8">{unit}</span>
    </div>
  );
}

// Step 3: Review
function ReviewStep({ data }: { data: FormData }) {
  const goalLabel = goalOptions.find((g) => g.value === data.goal_type)?.label ?? data.goal_type;
  const activityLabel = activityOptions.find((a) => a.value === data.activity_level)?.label ?? data.activity_level;

  const rows = [
    { label: 'Name', value: data.full_name },
    { label: 'Sex', value: data.sex ? data.sex.charAt(0).toUpperCase() + data.sex.slice(1) : '—' },
    { label: 'Age', value: data.age ? `${data.age} years` : '—' },
    { label: 'Activity Level', value: activityLabel },
    { label: 'Height', value: data.height_cm ? `${Number(data.height_cm).toFixed(1)} cm` : '—' },
    { label: 'Weight', value: data.weight_kg ? `${Number(data.weight_kg).toFixed(1)} kg` : '—' },
    { label: 'Goal', value: goalLabel },
    { label: 'Target Weight', value: data.target_weight_kg ? `${data.target_weight_kg} kg` : 'Not set' },
    { label: 'Daily Calories', value: data.daily_calories ? `${data.daily_calories} kcal` : '—' },
    { label: 'Protein', value: data.daily_protein_g ? `${data.daily_protein_g}g` : '—' },
    { label: 'Carbs', value: data.daily_carbs_g ? `${data.daily_carbs_g}g` : '—' },
    { label: 'Fat', value: data.daily_fat_g ? `${data.daily_fat_g}g` : '—' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Review your profile</h2>
        <p className="text-sm text-gray-500 mt-1">Everything look good? You can always update later.</p>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between px-4 py-2.5">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Wizard Component
export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalSteps = 4;

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = () => {
    const errors = validateStep(currentStep, formData);
    if (errors.length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors([]);
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setStepErrors([]);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Save profile
      const profileRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          age: Number(formData.age),
          height_cm: Number(formData.height_cm),
          weight_kg: Number(formData.weight_kg),
          sex: formData.sex,
          activity_level: formData.activity_level,
          onboarding_completed: false, // will be set to true after goals
        }),
      });

      if (!profileRes.ok) {
        const err = await profileRes.json();
        throw new Error(err.error || 'Failed to save profile');
      }

      // Save goals
      const goalsRes = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_type: formData.goal_type,
          target_weight_kg: formData.target_weight_kg || null,
          daily_calories: Number(formData.daily_calories),
          daily_protein_g: Number(formData.daily_protein_g),
          daily_carbs_g: Number(formData.daily_carbs_g),
          daily_fat_g: Number(formData.daily_fat_g),
        }),
      });

      if (!goalsRes.ok) {
        const err = await goalsRes.json();
        throw new Error(err.error || 'Failed to save goals');
      }

      // Mark onboarding complete
      const completeRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding_completed: true }),
      });

      if (!completeRes.ok) {
        throw new Error('Failed to complete onboarding');
      }

      // Set cookie for middleware
      document.cookie = 'onboarding_completed=true; path=/; max-age=31536000; SameSite=Lax';

      onComplete();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep data={formData} onChange={handleChange} errors={stepErrors} />;
      case 1:
        return <BodyMetricsStep data={formData} onChange={handleChange} errors={stepErrors} />;
      case 2:
        return <GoalsStep data={formData} onChange={handleChange} errors={stepErrors} />;
      case 3:
        return <ReviewStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="mb-6">
        <StepIndicator
          totalSteps={totalSteps}
          currentStep={currentStep}
          labels={STEP_LABELS}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Back
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 sm:flex-none sm:px-8 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 sm:flex-none sm:px-8 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : (
              'Complete Setup'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
