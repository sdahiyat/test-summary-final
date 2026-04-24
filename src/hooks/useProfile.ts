'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  sex: 'male' | 'female';
  activity_level: string;
  onboarding_completed: boolean;
}

export interface UserGoals {
  goal_type: 'weight_loss' | 'maintenance' | 'muscle_gain';
  target_weight_kg: number | null;
  daily_calories: number;
  daily_protein_g: number;
  daily_carbs_g: number;
  daily_fat_g: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileRes, goalsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/goals'),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      } else if (profileRes.status === 404) {
        setProfile(null);
      } else if (profileRes.status === 401) {
        setError('Not authenticated');
      } else {
        setError('Failed to load profile');
      }

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData);
      } else if (goalsRes.status === 404) {
        setGoals(null);
      } else if (goalsRes.status !== 401) {
        // Don't set error for goals failure if profile succeeded
      }
    } catch (err) {
      setError('Network error loading profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updated = await res.json();
      setProfile(updated);
      return updated;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateGoals = useCallback(async (data: Partial<UserGoals>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update goals');
      }

      const updated = await res.json();
      setGoals(updated);
      return updated;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    goals,
    loading,
    saving,
    error,
    updateProfile,
    updateGoals,
    refetch: fetchProfile,
  };
}
