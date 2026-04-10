import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10))
    );
    const offset = (page - 1) * limit;

    const supabase = createServiceRoleClient();

    let data: Record<string, unknown>[] = [];
    let total = 0;

    if (!q) {
      // No search query — return foods ordered by name with pagination
      const { data: foods, count, error } = await supabase
        .from('foods')
        .select(
          'id, name, brand, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, serving_size, serving_unit, is_verified, created_by, created_at, updated_at',
          { count: 'estimated' }
        )
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Foods list error:', error);
        return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
      }

      data = (foods as Record<string, unknown>[]) || [];
      total = count || 0;
    } else {
      // Search mode: merge prefix matches first, then contains matches
      // Strategy: get prefix matches and contains matches, deduplicate, prefix first
      const searchLimit = limit * 3; // Fetch more to allow deduplication

      // 1. Prefix matches (higher relevance)
      const { data: prefixMatches, error: prefixError } = await supabase
        .from('foods')
        .select(
          'id, name, brand, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, serving_size, serving_unit, is_verified, created_by, created_at, updated_at'
        )
        .ilike('name', `${q}%`)
        .order('name', { ascending: true })
        .limit(searchLimit);

      if (prefixError) {
        console.error('Foods prefix search error:', prefixError);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
      }

      // 2. Contains matches (lower relevance) — excluding already-found prefix matches
      const prefixIds = new Set((prefixMatches || []).map((f) => f.id));

      const { data: containsMatches, error: containsError } = await supabase
        .from('foods')
        .select(
          'id, name, brand, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, serving_size, serving_unit, is_verified, created_by, created_at, updated_at'
        )
        .ilike('name', `%${q}%`)
        .not('name', 'ilike', `${q}%`) // Exclude prefix matches
        .order('name', { ascending: true })
        .limit(searchLimit);

      if (containsError) {
        console.error('Foods contains search error:', containsError);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
      }

      // 3. Also search brand names
      const { data: brandMatches, error: brandError } = await supabase
        .from('foods')
        .select(
          'id, name, brand, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, serving_size, serving_unit, is_verified, created_by, created_at, updated_at'
        )
        .ilike('brand', `%${q}%`)
        .order('name', { ascending: true })
        .limit(searchLimit);

      if (brandError) {
        console.error('Foods brand search error:', brandError);
        // Non-fatal: continue without brand results
      }

      // Merge results: prefix first, then contains, then brand (deduplicated)
      const merged: Record<string, unknown>[] = [];
      const seenIds = new Set<string>();

      for (const food of [...(prefixMatches || []), ...(containsMatches || [])]) {
        if (!seenIds.has(food.id as string)) {
          seenIds.add(food.id as string);
          merged.push(food as Record<string, unknown>);
        }
      }

      // Add brand matches that aren't already included
      for (const food of brandMatches || []) {
        if (!seenIds.has(food.id as string)) {
          seenIds.add(food.id as string);
          merged.push(food as Record<string, unknown>);
        }
      }

      total = merged.length;

      // Apply pagination on the merged results
      data = merged.slice(offset, offset + limit);
    }

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      hasMore: offset + data.length < total,
    });
  } catch (error) {
    console.error('Unexpected error in foods search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
