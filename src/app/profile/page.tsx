'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { GoalsForm } from '@/components/profile/GoalsForm';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, goals, loading, updateProfile, updateGoals } = useProfile();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [goalsSuccess, setGoalsSuccess] = useState(false);

  const handleProfileSave = async (data: Parameters<typeof updateProfile>[0]) => {
    await updateProfile(data);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleGoalsSave = async (data: Parameters<typeof updateGoals>[0]) => {
    await updateGoals(data);
    setGoalsSuccess(true);
    setTimeout(() => setGoalsSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile &amp; Goals</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information and nutrition targets</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500 mt-0.5">Update your name, age, and body measurements</p>
            </div>

            {profileSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-green-700">✓ Profile saved!</p>
              </div>
            )}

            {loading ? (
              <SkeletonCard />
            ) : (
              <ProfileForm
                initialData={profile ?? {}}
                onSave={handleProfileSave}
              />
            )}
          </div>

          {/* Nutrition Goals */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Nutrition Goals</h2>
              <p className="text-sm text-gray-500 mt-0.5">Set your daily calorie and macro targets</p>
            </div>

            {goalsSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-green-700">✓ Goals saved!</p>
              </div>
            )}

            {loading ? (
              <SkeletonCard />
            ) : (
              <GoalsForm
                initialGoals={goals ?? {}}
                initialProfile={profile ?? {}}
                onSave={handleGoalsSave}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
