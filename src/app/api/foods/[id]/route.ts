import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Food ID is required' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('foods')
      .select(
        'id, name, brand, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, serving_size, serving_unit, is_verified, created_by, created_at, updated_at'
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PostgREST "no rows returned" error
        return NextResponse.json({ error: 'Food not found' }, { status: 404 });
      }
      console.error('Error fetching food by ID:', error);
      return NextResponse.json({ error: 'Failed to fetch food' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error fetching food by ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
