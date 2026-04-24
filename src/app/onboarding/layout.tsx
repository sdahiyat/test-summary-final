import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Up Your Profile | NutriTrack',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Minimal top bar */}
      <header className="px-4 py-4 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-gray-900">NutriTrack</span>
        </div>
      </header>
      {children}
    </div>
  );
}
