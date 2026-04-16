import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Food } from '@/types/food'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Missing food id' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Food not found' }, { status: 404 })
      }
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 })
    }

    return NextResponse.json(data as Food)
  } catch (err) {
    console.error('Unexpected error in /api/foods/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
