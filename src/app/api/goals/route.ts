import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { validateGoals } from '@/lib/validations/profile';
// import { calculateNutritionTargets } from '@/lib/nutrition-calculator';
// ^ Available for server-side suggestion if needed in a future endpoint

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Goals not found' }, { status: 404 });
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

  const { valid, errors } = validateGoals(body);
  if (!valid) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const payload = {
    user_id: session.user.id,
    goal_type: body.goal_type as string,
    target_weight_kg:
      body.target_weight_kg !== undefined && body.target_weight_kg !== ''
        ? Number(body.target_weight_kg)
        : null,
    daily_calories: Number(body.daily_calories),
    daily_protein_g: Number(body.daily_protein_g),
    daily_carbs_g: Number(body.daily_carbs_g),
    daily_fat_g: Number(body.daily_fat_g),
    updated_at: new Date().toISOString(),
  };

  // Try upsert with onConflict on user_id first; fall back to delete+insert if needed
  const { data, error } = await supabase
    .from('user_goals')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    // Fallback: delete existing + insert new
    await supabase.from('user_goals').delete().eq('user_id', session.user.id);
    const { data: inserted, error: insertError } = await supabase
      .from('user_goals')
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(inserted, { status: 200 });
  }

  return NextResponse.json(data, { status: 200 });
}

// Alias POST to PUT for convenience
export const POST = PUT;
