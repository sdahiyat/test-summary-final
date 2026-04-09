import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Food } from '@/types/food';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Math.min(50, Math.max(1, rawLimit));
    const category = searchParams.get('category')?.trim() || '';

    const offset = (page - 1) * limit;
    const supabase = getSupabaseClient();

    // Build base queries
    let countQuery = supabase.from('foods').select('*', { count: 'exact', head: true });
    let dataQuery = supabase
      .from('foods')
      .select('*')
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (category) {
      countQuery = countQuery.eq('category', category) as typeof countQuery;
      dataQuery = dataQuery.eq('category', category) as typeof dataQuery;
    }

    // Run count and data queries in parallel
    const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

    if (countResult.error) {
      console.error('Count query error:', countResult.error);
      return NextResponse.json(
        { error: 'Failed to count foods', details: countResult.error.message },
        { status: 500 }
      );
    }

    if (dataResult.error) {
      console.error('Data query error:', dataResult.error);
      return NextResponse.json(
        { error: 'Failed to fetch foods', details: dataResult.error.message },
        { status: 500 }
      );
    }

    const total = countResult.count ?? 0;
    const totalPages = Math.ceil(total / limit);
    const foods = dataResult.data as Food[];

    return NextResponse.json({
      data: foods,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Unexpected error in foods list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
