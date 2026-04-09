import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Food } from '@/types/food';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

function rankResults(foods: Food[], query: string): Food[] {
  if (!query) return foods;

  const q = query.toLowerCase().trim();

  return [...foods].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // Exact match (highest priority)
    const aExact = aName === q ? 0 : 1;
    const bExact = bName === q ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;

    // Starts-with match
    const aStarts = aName.startsWith(q) ? 0 : 1;
    const bStarts = bName.startsWith(q) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;

    // Word starts-with match (e.g., "chi" matches "Chicken Breast")
    const aWordStarts = aName.split(/\s+/).some((word) => word.startsWith(q)) ? 0 : 1;
    const bWordStarts = bName.split(/\s+/).some((word) => word.startsWith(q)) ? 0 : 1;
    if (aWordStarts !== bWordStarts) return aWordStarts - bWordStarts;

    // Contains match (fallback)
    return aName.localeCompare(bName);
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Math.min(50, Math.max(1, rawLimit));
    const category = searchParams.get('category')?.trim() || '';

    const offset = (page - 1) * limit;
    const supabase = getSupabaseClient();

    // Build the filter string for count and data queries
    const buildBaseQuery = (baseQuery: ReturnType<typeof supabase.from>) => {
      let query = baseQuery;

      if (q) {
        query = query.or(`name.ilike.%${q}%,category.ilike.%${q}%`) as typeof query;
      }

      if (category) {
        query = query.eq('category', category) as typeof query;
      }

      return query;
    };

    // For relevance ranking we fetch more results and sort in JS
    const fetchLimit = q ? Math.min(limit * 3, 150) : limit;

    // Count query
    const countQuery = buildBaseQuery(
      supabase.from('foods').select('*', { count: 'exact', head: true })
    );
    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Count query error:', countError);
      return NextResponse.json(
        { error: 'Failed to count foods', details: countError.message },
        { status: 500 }
      );
    }

    // Data query
    const dataQuery = buildBaseQuery(
      supabase.from('foods').select('*')
    )
      .order('name', { ascending: true })
      .range(offset, offset + fetchLimit - 1);

    const { data: rawData, error: dataError } = await dataQuery;

    if (dataError) {
      console.error('Data query error:', dataError);
      return NextResponse.json(
        { error: 'Failed to fetch foods', details: dataError.message },
        { status: 500 }
      );
    }

    const foods = rawData as Food[];

    // Apply relevance ranking and slice to requested limit
    const rankedFoods = q ? rankResults(foods, q).slice(0, limit) : foods.slice(0, limit);

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: rankedFoods,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      query: {
        q: q || undefined,
        category: category || undefined,
      },
    });
  } catch (error) {
    console.error('Unexpected error in food search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
