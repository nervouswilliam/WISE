// Simulates POS sales by calling the same `complete_sale` RPC the real Sales page uses
// (see src/components/Sales/PaymentOptions.jsx), so stock deduction and transaction
// creation stay fully consistent with a real checkout.
//
// Unlike seedPurchases.mjs, this CANNOT backdate sales — complete_sale only accepts
// (_user_id, _items, _payment_method) and timestamps them at call time. Run it daily
// (see the scheduled task) to accumulate history one day at a time; there is no
// one-shot "backfill a year" option here.
//
// Usage:
//   node scripts/seedSales.mjs --sales 3   (make 3 simulated sales right now)
//   node scripts/seedSales.mjs             (defaults: 1-5 random sales)
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
const salesCountArg = getArg('sales', null);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Cheque', 'Gift Card'];

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

  // Track remaining stock locally so a single run doesn't oversell a product across
  // multiple simulated sales.
  const stockById = new Map(
    (products || []).filter((p) => p.stock > 0).map((p) => [p.id, p.stock])
  );
  if (stockById.size === 0) {
    console.error('No products with available stock — add stock before simulating sales.');
    process.exit(1);
  }

  const salesCount = salesCountArg ?? randomInt(1, 5);
  let completed = 0;

  for (let i = 0; i < salesCount; i++) {
    const availableProducts = products.filter((p) => (stockById.get(p.id) || 0) > 0);
    if (availableProducts.length === 0) {
      console.log('Ran out of available stock across all products, stopping early.');
      break;
    }

    const itemCount = randomInt(1, Math.min(4, availableProducts.length));
    const chosenProducts = [...availableProducts].sort(() => Math.random() - 0.5).slice(0, itemCount);

    const items = chosenProducts.map((product) => {
      const available = stockById.get(product.id);
      const quantity = randomInt(1, Math.min(5, available));
      stockById.set(product.id, available - quantity);
      return {
        product_id: product.id,
        quantity,
        price_per_unit: product.selling_price,
      };
    });

    const paymentMethod = pickRandom(PAYMENT_METHODS);
    const { data, error } = await supabase.rpc('complete_sale', {
      _user_id: user.id,
      _items: items,
      _payment_method: paymentMethod,
    });

    if (error) {
      console.error('Failed to complete simulated sale:', error.message);
    } else {
      completed += 1;
      console.log(`Simulated sale ${completed} completed (transaction ${data}), ${items.length} item(s).`);
    }
  }

  console.log(`Done. Completed ${completed} of ${salesCount} simulated sale(s).`);
}

main();
