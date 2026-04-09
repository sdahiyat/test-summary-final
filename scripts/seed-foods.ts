import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { SEED_FOODS } from '../src/data/foods-seed';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BATCH_SIZE = 50;

async function main() {
  console.log(`🌱 Starting food database seed...`);
  console.log(`📊 Total foods to seed: ${SEED_FOODS.length}`);

  let totalInserted = 0;
  let totalErrors = 0;

  for (let i = 0; i < SEED_FOODS.length; i += BATCH_SIZE) {
    const batch = SEED_FOODS.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(SEED_FOODS.length / BATCH_SIZE);

    console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    try {
      const { data, error } = await supabase
        .from('foods')
        .upsert(batch, { ignoreDuplicates: true, onConflict: 'name,serving_unit' });

      if (error) {
        console.error(`❌ Batch ${batchNumber} failed:`, error.message);
        console.error('   Details:', error.details);
        console.error('   Hint:', error.hint);
        totalErrors += batch.length;
      } else {
        console.log(`✅ Batch ${batchNumber} succeeded`);
        totalInserted += batch.length;
      }
    } catch (err) {
      console.error(`❌ Batch ${batchNumber} threw an exception:`, err);
      totalErrors += batch.length;
    }
  }

  console.log('\n─────────────────────────────────');
  console.log('📋 Seed Summary:');
  console.log(`   Attempted: ${SEED_FOODS.length}`);
  console.log(`   Succeeded: ${totalInserted}`);
  console.log(`   Failed:    ${totalErrors}`);
  console.log('─────────────────────────────────');

  if (totalErrors > 0) {
    console.error('⚠️  Some batches failed. Check the logs above for details.');
    process.exit(1);
  } else {
    console.log('🎉 Food database seeded successfully!');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});
