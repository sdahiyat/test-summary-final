'use client';

import { useState, useCallback } from 'react';
import { convertHeight, convertWeight } from '@/lib/nutrition-calculator';
import type { UserProfile } from '@/hooks/useProfile';

interface ProfileFormProps {
  initialData: Partial<UserProfile>;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
}

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Light', description: '1–3 days/week' },
  { value: 'moderate', label: 'Moderate', description: '3–5 days/week' },
  { value: 'active', label: 'Active', description: '6–7 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise daily' },
];

interface FieldErrors {
  full_name?: string;
  age?: string;
  height_cm?: string;
  weight_kg?: string;
  sex?: string;
  activity_level?: string;
}

export function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialData.full_name ?? '');
  const [age, setAge] = useState(initialData.age ? String(initialData.age) : '');
  const [sex, setSex] = useState<'male' | 'female' | ''>(initialData.sex ?? '');
  const [activityLevel, setActivityLevel] = useState(initialData.activity_level ?? 'moderate');
  const [heightCm, setHeightCm] = useState(initialData.height_cm ? String(initialData.height_cm) : '');
  const [weightKg, setWeightKg] = useState(initialData.weight_kg ? String(initialData.weight_kg) : '');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [lbs, setLbs] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleFeetInchesChange = (newFeet: string, newInches: string) => {
    setFeet(newFeet);
    setInches(newInches);
    const f = Number(newFeet) || 0;
    const i = Number(newInches) || 0;
    if (f > 0 || i > 0) {
      setHeightCm(String(convertHeight(f, i)));
    }
  };

  const handleLbsChange = (newLbs: string) => {
    setLbs(newLbs);
    if (newLbs) {
      setWeightKg(String(convertWeight(Number(newLbs))));
    }
  };

  const validate = useCallback((): boolean => {
    const newErrors: FieldErrors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }
    const ageNum = Number(age);
    if (!age) {
      newErrors.age = 'Age is required';
    } else if (!Number.isInteger(ageNum) || ageNum < 13 || ageNum > 120) {
      newErrors.age = 'Age must be between 13 and 120';
    }
    const heightNum = Number(heightCm);
    if (!heightCm) {
      newErrors.height_cm = 'Height is required';
    } else if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
      newErrors.height_cm = 'Height must be between 50 and 300 cm';
    }
    const weightNum = Number(weightKg);
    if (!weightKg) {
      newErrors.weight_kg = 'Weight is required';
    } else if (isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
      newErrors.weight_kg = 'Weight must be between 20 and 500 kg';
    }
    if (!sex) {
      newErrors.sex = 'Please select your sex';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fullName, age, heightCm, weightKg, sex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSuccess(false);
    setSaveError(null);

    try {
      await onSave({
        full_name: fullName.trim(),
        age: Number(age),
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        sex: sex as 'male' | 'female',
        activity_level: activityLevel,
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

      {/* Full name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
            errors.full_name ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
      </div>

      {/* Sex */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSex(s)}
              className={`py-2.5 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                sex === s
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {s === 'male' ? '♂ Male' : '♀ Female'}
            </button>
          ))}
        </div>
        {errors.sex && <p className="mt-1 text-xs text-red-500">{errors.sex}</p>}
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min={13}
          max={120}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
            errors.age ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
      </div>

      {/* Unit toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Measurements</label>
        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 w-fit mb-4">
          {(['metric', 'imperial'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                unit === u ? 'bg-white shadow text-gray-900' : 'text-gray-500'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Height */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">Height</label>
          {unit === 'metric' ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="170"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.height_cm ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <span className="text-sm text-gray-500">cm</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={feet}
                onChange={(e) => handleFeetInchesChange(e.target.value, inches)}
                placeholder="5"
                className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-500">ft</span>
              <input
                type="number"
                value={inches}
                onChange={(e) => handleFeetInchesChange(feet, e.target.value)}
                placeholder="8"
                className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-500">in</span>
            </div>
          )}
          {errors.height_cm && <p className="mt-1 text-xs text-red-500">{errors.height_cm}</p>}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Weight</label>
          {unit === 'metric' ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
                step={0.1}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.weight_kg ? 'border-red-300' : 'border-gray-300'
                }`}
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
                step={0.1}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-500">lbs</span>
            </div>
          )}
          {errors.weight_kg && <p className="mt-1 text-xs text-red-500">{errors.weight_kg}</p>}
        </div>
      </div>

      {/* Activity level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
        <div className="space-y-2">
          {activityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setActivityLevel(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                activityLevel === opt.value
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`text-sm font-medium ${activityLevel === opt.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                {opt.label}
              </span>
              <span className="text-xs text-gray-400">{opt.description}</span>
            </button>
          ))}
        </div>
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
          'Save Changes'
        )}
      </button>
    </form>
  );
}
