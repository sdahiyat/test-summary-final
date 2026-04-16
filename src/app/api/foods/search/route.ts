import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { FoodSearchResponse, FoodCategory } from '@/types/food'

function scoreFood(name: string, query: string): number {
  const lowerName = name.toLowerCase()
  const lowerQuery = query.toLowerCase()
  if (lowerName === lowerQuery) return 100
  if (lowerName.startsWith(lowerQuery)) return 90
  if (lowerName.includes(`, ${lowerQuery}`) || lowerName.includes(` ${lowerQuery}`)) return 70
  return 50
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)

    const rawQuery = searchParams.get('query') ?? ''
    const query = rawQuery.trim().toLowerCase()
    const category = searchParams.get('category') as FoodCategory | null
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
    const page_size = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('page_size') ?? '20', 10) || 20)
    )

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      )
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

    let dbQuery = supabase
      .from('foods')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true })
      .limit(500)

    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }

    const { data, error } = await dbQuery

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    const results = data ?? []

    // Sort by relevance score descending
    const sorted = [...results].sort(
      (a, b) => scoreFood(b.name, query) - scoreFood(a.name, query)
    )

    const total = sorted.length
    const start = (page - 1) * page_size
    const paginated = sorted.slice(start, start + page_size).map((food) => ({
      ...food,
      relevance_score: scoreFood(food.name, query),
    }))

    const response: FoodSearchResponse = {
      data: paginated,
      total,
      page,
      page_size,
      has_more: start + page_size < total,
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error('Unexpected error in /api/foods/search:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
