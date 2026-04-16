// @ts-nocheck
/* eslint-disable @typescript-eslint/no-var-requires */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// Resolve seed data relative to this script
const seedPath = path.join(__dirname, '..', 'src', 'data', 'foods-seed')

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!supabaseServiceKey) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
  }

  // Use service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Check if foods table already has data
  const { count, error: countError } = await supabase
    .from('foods')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    throw new Error(`Failed to check existing data: ${countError.message}`)
  }

  if (count && count > 0) {
    console.log(`Foods table already has ${count} rows. Skipping seed.`)
    process.exit(0)
  }

  // Dynamically require the compiled/transpiled seed data
  // When run via ts-node this is handled transparently
  let SEED_FOODS
  try {
    const seedModule = require(seedPath)
    SEED_FOODS = seedModule.SEED_FOODS
  } catch (err) {
    throw new Error(`Failed to load seed data from ${seedPath}: ${err}`)
  }

  if (!Array.isArray(SEED_FOODS) || SEED_FOODS.length === 0) {
    throw new Error('SEED_FOODS is empty or not an array')
  }

  console.log(`Seeding ${SEED_FOODS.length} foods into the database...`)

  // Batch insert in chunks of 50
  const CHUNK_SIZE = 50
  let totalInserted = 0

  for (let i = 0; i < SEED_FOODS.length; i += CHUNK_SIZE) {
    const chunk = SEED_FOODS.slice(i, i + CHUNK_SIZE)
    const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1
    const totalChunks = Math.ceil(SEED_FOODS.length / CHUNK_SIZE)

    console.log(`Inserting chunk ${chunkNumber}/${totalChunks} (${chunk.length} items)...`)

    const { error: insertError } = await supabase.from('foods').insert(chunk)

    if (insertError) {
      throw new Error(
        `Failed to insert chunk ${chunkNumber}: ${insertError.message}`
      )
    }

    totalInserted += chunk.length
    console.log(`  ✓ Chunk ${chunkNumber} inserted (${totalInserted} total so far)`)
  }

  // Verify final count
  const { count: finalCount, error: finalCountError } = await supabase
    .from('foods')
    .select('*', { count: 'exact', head: true })

  if (finalCountError) {
    console.warn(`Could not verify final count: ${finalCountError.message}`)
  } else {
    console.log(`\n✅ Seeding complete! ${finalCount} foods now in database.`)
  }
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err.message || err)
  process.exit(1)
})
