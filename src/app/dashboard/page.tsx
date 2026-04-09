import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';

export default async function DashboardPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome back{session.user.user_metadata?.full_name ? `, ${session.user.user_metadata.full_name}` : ''}!
        </h1>
        <p className="text-gray-500 text-sm">
          Your nutrition dashboard is being built. Stay tuned!
        </p>
      </div>
    </main>
  );
}
