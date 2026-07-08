// Inserts simulated purchase (order) records into Supabase so the Statistics/Dashboard
// charts have data to show without manually creating test data by hand.
//
// Usage:
//   node scripts/seedPurchases.mjs --days 30 --per-day 3   (backfill last 30 days)
//   node scripts/seedPurchases.mjs                          (defaults: 1 day, up to 3 orders)
//
// Requires .env.seed.local (gitignored) with SEED_USER_EMAIL / SEED_USER_PASSWORD for an
// existing account, plus VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from .env.development.
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = {
  ...loadEnvFile(path.join(rootDir, '.env.development')),
  ...loadEnvFile(path.join(rootDir, '.env.seed.local')),
  ...process.env,
};

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SEED_USER_EMAIL, SEED_USER_PASSWORD } = env;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (expected in .env.development).');
  process.exit(1);
}
if (!SEED_USER_EMAIL || !SEED_USER_PASSWORD) {
  console.error(
    'Missing SEED_USER_EMAIL / SEED_USER_PASSWORD.\n' +
    'Copy .env.seed.example to .env.seed.local and fill in a real account\'s login.'
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? parseInt(args[idx + 1], 10) : fallback;
};
const days = getArg('days', 1);
const maxPerDay = getArg('per-day', 3);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: SEED_USER_EMAIL,
    password: SEED_USER_PASSWORD,
  });
  if (authError) {
    console.error('Failed to sign in:', authError.message);
    process.exit(1);
  }
  const user = authData.user;
  console.log(`Signed in as ${user.email} (${user.id})`);

  const { data: products, error: productsError } = await supabase
    .from('view_products')
    .select()
    .eq('user_id', user.id);
  if (productsError) {
    console.error('Failed to fetch products:', productsError.message);
    process.exit(1);
  }
  if (!products || products.length === 0) {
    console.error('No products found for this account — add at least one product first.');
    process.exit(1);
  }

  const { data: suppliers, error: suppliersError } = await supabase
    .from('suppliers')
    .select()
    .eq('user_id', user.id);
  if (suppliersError) {
    console.error('Failed to fetch suppliers:', suppliersError.message);
    process.exit(1);
  }
  if (!suppliers || suppliers.length === 0) {
    console.error('No suppliers found for this account — add at least one supplier first.');
    process.exit(1);
  }
  const supplierIdByName = new Map(suppliers.map((s) => [s.name, s.id]));

  let totalInserted = 0;

  for (let dayOffset = days - 1; dayOffset >= 0; dayOffset--) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - dayOffset);
    orderDate.setHours(randomInt(8, 17), randomInt(0, 59), 0, 0);

    const ordersToday = randomInt(1, maxPerDay);
    for (let i = 0; i < ordersToday; i++) {
      const product = pickRandom(products);
      const supplierId = supplierIdByName.get(product.supplier_name) || pickRandom(suppliers).id;
      const quantity = randomInt(5, 50);
      const unitPrice = Number(product.price) || 0;
      const subtotal = quantity * unitPrice;

      const expectedArrival = new Date(orderDate);
      expectedArrival.setDate(expectedArrival.getDate() + randomInt(2, 7));

      // Cancelled orders are included on purpose so the Statistics page's "exclude
      // cancelled" filter has something real to exclude.
      const status = dayOffset === 0 ? 'Pending' : pickRandom(['Done', 'Done', 'Cancelled']);

      const orderData = {
        product_id: product.id,
        quantity_ordered: quantity,
        unit_price: unitPrice,
        subtotal,
        supplier_id: supplierId,
        expected_arrival: expectedArrival.toISOString(),
        total_cost: subtotal,
        status,
        notes: 'Simulated purchase (seed script)',
        user_id: user.id,
        created_at: orderDate.toISOString(),
      };

      const { error: insertError } = await supabase.from('orders').insert([orderData]);
      if (insertError) {
        console.error('Failed to insert order:', insertError.message);
      } else {
        totalInserted += 1;
      }
    }
  }

  console.log(`Done. Inserted ${totalInserted} simulated purchase order(s) across ${days} day(s).`);
}

main();
