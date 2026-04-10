import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { SEED_FOODS } from '../src/lib/supabase/foods-seed';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '❌ Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY'
  );
  console.error('   Make sure your .env.local file is present and contains these values.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BATCH_SIZE = 50;

async function seedFoods() {
  console.log(`🌱 Starting food database seed with ${SEED_FOODS.length} foods...`);

  const batches: typeof SEED_FOODS[] = [];
  for (let i = 0; i < SEED_FOODS.length; i += BATCH_SIZE) {
    batches.push(SEED_FOODS.slice(i, i + BATCH_SIZE));
  }

  const totalBatches = batches.length;

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const { error } = await supabase
      .from('foods')
      .upsert(batch, { onConflict: 'name' });

    if (error) {
      console.error(`❌ Error inserting batch ${batchIndex + 1}/${totalBatches}:`, error);
      process.exit(1);
    }

    console.log(
      `   Inserted batch ${batchIndex + 1}/${totalBatches} (${batch.length} foods)`
    );
  }

  console.log(`✓ Seeded ${SEED_FOODS.length} foods successfully`);
}

seedFoods().catch((err) => {
  console.error('❌ Unexpected error during seeding:', err);
  process.exit(1);
});
