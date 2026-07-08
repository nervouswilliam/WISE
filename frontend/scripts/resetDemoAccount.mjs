// Nightly reset for the dedicated demo account used by the landing page's "Try Live Demo"
// button. Ensures a small fixed catalog exists, wipes + reseeds 30 days of purchase
// history, and resets stock back to baseline (undoing whatever demo visitors' simulated
// sales depleted).
//
// Sales history (transactions/transaction_items) CANNOT be reset — RLS blocks both UPDATE
// and DELETE on those tables for regular users (same restriction discovered while testing
// whether real sales could be backdated). That's accepted as-is: demo sales accumulate
// forever, but since every chart in the app windows to the last 7/30 days, old demo
// transactions just age out of view rather than causing a visible problem.
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
  ...loadEnvFile(path.join(rootDir, '.env.demo.local')),
};

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, DEMO_USER_EMAIL, DEMO_USER_PASSWORD } = env;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (expected in .env.development).');
  process.exit(1);
}
if (!DEMO_USER_EMAIL || !DEMO_USER_PASSWORD) {
  console.error(
    'Missing DEMO_USER_EMAIL / DEMO_USER_PASSWORD.\n' +
    'Copy .env.demo.example to .env.demo.local and fill in the demo account\'s login.'
  );
  process.exit(1);
}

// Fixed demo catalog. Note: PROBE-001 is a leftover from permission testing that can never
// be deleted (a sale references it, and Postgres blocks deleting/renaming a referenced
// product id) — it's repurposed here as a real catalog item instead of left dangling.
const SUPPLIERS = ['Global Tech Supply', 'Gadget Hub Wholesale', 'Fresh Mart Distributors'];
const CATEGORIES = ['Electronics', 'Accessories', 'Groceries'];
const PRODUCTS = [
  { id: 'PROBE-001', name: 'Sony Headphone CH520', category: 'Electronics', supplier: 'Global Tech Supply', price: 350000, selling_price: 550000, stock: 40, low_stock: 10 },
  { id: 'DEMO-002', name: 'Wireless Mouse', category: 'Accessories', supplier: 'Global Tech Supply', price: 45000, selling_price: 85000, stock: 60, low_stock: 15 },
  { id: 'DEMO-003', name: 'USB-C Cable 1m', category: 'Accessories', supplier: 'Gadget Hub Wholesale', price: 15000, selling_price: 35000, stock: 100, low_stock: 20 },
  { id: 'DEMO-004', name: 'Bluetooth Speaker', category: 'Electronics', supplier: 'Gadget Hub Wholesale', price: 200000, selling_price: 375000, stock: 25, low_stock: 8 },
  { id: 'DEMO-005', name: 'Instant Noodles (Box of 40)', category: 'Groceries', supplier: 'Fresh Mart Distributors', price: 120000, selling_price: 180000, stock: 50, low_stock: 10 },
  { id: 'DEMO-006', name: 'Mineral Water (24-pack)', category: 'Groceries', supplier: 'Fresh Mart Distributors', price: 60000, selling_price: 95000, stock: 80, low_stock: 20 },
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function ensureByName(supabase, table, names, userId) {
  const { data: existing, error } = await supabase.from(table).select('id, name').eq('user_id', userId);
  if (error) throw new Error(`Failed to read ${table}: ${error.message}`);

  const byName = new Map(existing.map((row) => [row.name, row.id]));
  for (const name of names) {
    if (byName.has(name)) continue;
    const { data: inserted, error: insertError } = await supabase
      .from(table)
      .insert([{ name, user_id: userId }])
      .select()
      .single();
    if (insertError) throw new Error(`Failed to insert ${table} "${name}": ${insertError.message}`);
    byName.set(name, inserted.id);
  }
  return byName;
}

async function main() {
  const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: DEMO_USER_EMAIL,
    password: DEMO_USER_PASSWORD,
  });
  if (authError) {
    console.error('Failed to sign in:', authError.message);
    process.exit(1);
  }
  const user = authData.user;
  console.log(`Signed in as ${user.email} (${user.id})`);

  // 1. Ensure suppliers + categories exist.
  const supplierIdByName = await ensureByName(supabase, 'suppliers', SUPPLIERS, user.id);
  const categoryIdByName = await ensureByName(supabase, 'categories', CATEGORIES, user.id);
  console.log('Suppliers/categories ready.');

  // 2. Ensure each catalog product exists at its baseline stock, with category/supplier
  // links. Existing rows are reset to baseline; missing ones are created.
  const { data: existingProducts } = await supabase.from('products').select('id').eq('user_id', user.id);
  const existingIds = new Set((existingProducts || []).map((p) => p.id));

  for (const p of PRODUCTS) {
    const baseRow = {
      name: p.name,
      price: p.price,
      selling_price: p.selling_price,
      stock: p.stock,
      low_stock: p.low_stock,
      user_id: user.id,
    };

    if (existingIds.has(p.id)) {
      const { error } = await supabase.from('products').update(baseRow).eq('id', p.id).eq('user_id', user.id);
      if (error) console.error(`Failed to reset product ${p.id}:`, error.message);
    } else {
      const { error } = await supabase.from('products').insert([{ id: p.id, ...baseRow }]);
      if (error) console.error(`Failed to insert product ${p.id}:`, error.message);
    }

    const categoryId = categoryIdByName.get(p.category);
    const { data: existingCatLink } = await supabase
      .from('categories_product')
      .select('product_id')
      .eq('product_id', p.id)
      .eq('user_id', user.id)
      .maybeSingle();
    if (!existingCatLink) {
      await supabase.from('categories_product').insert([{ product_id: p.id, category_id: categoryId, user_id: user.id }]);
    }

    const supplierId = supplierIdByName.get(p.supplier);
    const { data: existingSupLink } = await supabase
      .from('supplier_product')
      .select('product_id')
      .eq('product_id', p.id)
      .eq('user_id', user.id)
      .maybeSingle();
    if (!existingSupLink) {
      await supabase.from('supplier_product').insert([{ product_id: p.id, supplier_id: supplierId, user_id: user.id }]);
    }
  }
  console.log(`Catalog reset: ${PRODUCTS.length} product(s) at baseline stock.`);

  // 3. Wipe existing purchase history, then reseed 30 days of realistic activity.
  const { error: deleteOrdersError, count } = await supabase
    .from('orders')
    .delete({ count: 'exact' })
    .eq('user_id', user.id);
  if (deleteOrdersError) {
    console.error('Failed to clear existing orders:', deleteOrdersError.message);
  } else {
    console.log(`Cleared ${count ?? 0} existing order(s).`);
  }

  const days = 30;
  let inserted = 0;
  for (let dayOffset = days - 1; dayOffset >= 0; dayOffset--) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - dayOffset);
    orderDate.setHours(randomInt(8, 17), randomInt(0, 59), 0, 0);

    const ordersToday = randomInt(0, 2);
    for (let i = 0; i < ordersToday; i++) {
      const product = pickRandom(PRODUCTS);
      const supplierId = supplierIdByName.get(product.supplier);
      const quantity = randomInt(5, 30);
      const subtotal = quantity * product.price;
      const expectedArrival = new Date(orderDate);
      expectedArrival.setDate(expectedArrival.getDate() + randomInt(2, 7));

      const { error } = await supabase.from('orders').insert([{
        product_id: product.id,
        quantity_ordered: quantity,
        unit_price: product.price,
        subtotal,
        supplier_id: supplierId,
        expected_arrival: expectedArrival.toISOString(),
        total_cost: subtotal,
        status: dayOffset === 0 ? 'Pending' : pickRandom(['Done', 'Done', 'Cancelled']),
        notes: 'Demo account (auto-reset nightly)',
        user_id: user.id,
        created_at: orderDate.toISOString(),
      }]);
      if (error) {
        console.error('Failed to insert demo order:', error.message);
      } else {
        inserted += 1;
      }
    }
  }
  console.log(`Reseeded ${inserted} purchase order(s) across ${days} days.`);
  console.log('Demo account reset complete.');
}

main();
