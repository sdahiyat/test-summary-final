import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10))
    );
    const orderBy = searchParams.get('orderBy') === 'calories' ? 'calories' : 'name';
    const offset = (page - 1) * limit;

    const supabase = createServiceRoleClient();

    const { data, count, error } = await supabase
      .from('foods')
      .select(
        'id, name, brand, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, serving_size, serving_unit, is_verified, created_by, created_at, updated_at',
        { count: 'estimated' }
      )
      .order(orderBy, { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error listing foods:', error);
      return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
    }

    const total = count || 0;

    return NextResponse.json({
      data: data || [],
      total,
      page,
      limit,
      hasMore: offset + (data?.length || 0) < total,
    });
  } catch (error) {
    console.error('Unexpected error listing foods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
