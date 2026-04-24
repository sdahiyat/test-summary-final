/*
 * REQUIRED SUPABASE MIGRATION (run in Supabase SQL editor if columns don't exist):
 *
 * ALTER TABLE users
 *   ADD COLUMN IF NOT EXISTS full_name text,
 *   ADD COLUMN IF NOT EXISTS age integer,
 *   ADD COLUMN IF NOT EXISTS height_cm numeric,
 *   ADD COLUMN IF NOT EXISTS weight_kg numeric,
 *   ADD COLUMN IF NOT EXISTS sex text,
 *   ADD COLUMN IF NOT EXISTS activity_level text DEFAULT 'sedentary',
 *   ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
 *   ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
 *
 * -- Ensure user_goals has a unique constraint on user_id:
 * ALTER TABLE user_goals
 *   ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
 * -- If no unique constraint exists on user_id:
 * -- ALTER TABLE user_goals ADD CONSTRAINT user_goals_user_id_key UNIQUE (user_id);
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { validateProfile } from '@/lib/validations/profile';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // If only updating onboarding_completed, skip full profile validation
  const isOnboardingUpdate =
    Object.keys(body).length === 1 && 'onboarding_completed' in body;

  if (!isOnboardingUpdate) {
    const { valid, errors } = validateProfile(body);
    if (!valid) {
      return NextResponse.json({ errors }, { status: 422 });
    }
  }

  const payload: Record<string, unknown> = {
    id: session.user.id,
    updated_at: new Date().toISOString(),
  };

  if (!isOnboardingUpdate) {
    payload.full_name = (body.full_name as string).trim();
    payload.age = Number(body.age);
    payload.height_cm = Number(body.height_cm);
    payload.weight_kg = Number(body.weight_kg);
    payload.sex = body.sex;

    if (body.activity_level !== undefined) {
      payload.activity_level = body.activity_level;
    }
  }

  if (body.onboarding_completed !== undefined) {
    payload.onboarding_completed = body.onboarding_completed;
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
