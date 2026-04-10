import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q');
  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: 'Query parameter q is required' },
      { status: 400 }
    );
  }

  const rawPage = parseInt(searchParams.get('page') ?? '1', 10);
  const rawLimit = parseInt(searchParams.get('limit') ?? '20', 10);

  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
  const limit = Math.min(50, Math.max(1, isNaN(rawLimit) ? 20 : rawLimit));

  const from = (page - 1) * limit;
  const to = page * limit - 1;

  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = createSupabaseClient();
  } catch {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const sanitizedQ = q.trim();

  const { data, error, count } = await supabase
    .from('foods')
    .select(
      'id, name, brand, serving_size, serving_unit, calories, protein, carbs, fat, fiber, sugar, sodium, is_verified',
      { count: 'exact' }
    )
    .or(`name.ilike.%${sanitizedQ}%,brand.ilike.%${sanitizedQ}%`)
    .order('is_verified', { ascending: false })
    .order('name', { ascending: true })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json(
    {
      data: data ?? [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
