'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email) {
      setError('No email address found. Please sign up again.');
      return;
    }

    setResending(true);
    setError(null);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      setError(error.message);
    } else {
      setResent(true);
    }
    setResending(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify your email</h2>
        <p className="text-gray-500 text-sm mb-2">
          We sent a confirmation link to your inbox.
          {email && (
            <>
              {' '}
              Check <strong>{email}</strong>.
            </>
          )}
        </p>
        <p className="text-gray-400 text-xs mb-6">
          Click the link in the email to activate your account. Check your spam folder if you
          don&apos;t see it.
        </p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
            {error}
          </p>
        )}

        {resent ? (
          <p className="text-green-600 text-sm mb-6">
            ✓ Confirmation email resent successfully.
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending || !email}
            className="text-sm text-green-600 hover:underline disabled:opacity-50 mb-6 block mx-auto"
          >
            {resending ? 'Resending…' : 'Resend confirmation email'}
          </button>
        )}

        <Link
          href="/auth/login"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
