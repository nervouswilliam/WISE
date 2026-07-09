// Wisely business chatbot. Runs on Deno via Supabase Edge Functions.
//
// Flow: verify the caller's Supabase session -> resolve which business they operate on
// (mirrors the owner/staff resolution in src/App.jsx) -> pull a lean, real snapshot of
// that business's data (products/stock, sales, orders, suppliers, expenses) through the
// SAME RLS-scoped client the caller would use -> hand that snapshot to Groq (hosted
// open-source models, OpenAI-compatible API) as grounding context -> return its answer.
//
// Money values in the context are pre-formatted as Indonesian Rupiah strings (matching
// src/utils/currency.js) so the model relays them as-is instead of re-formatting numbers
// itself, which is where models tend to drop the "Rp"/thousands-separator convention.
//
// Deploy: supabase functions deploy chatbot
// Secret: supabase secrets set GROQ_API_KEY=your-key-here (get one at console.groq.com)

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Missing Authorization header' }, 401);
    }

    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return json({ error: 'message is required' }, 400);
    }

    // Scoped to the caller's own session - every query below runs under their RLS
    // policies, so the chatbot can never surface data that user couldn't already query
    // directly (a cashier's chatbot session stays as locked-down as the rest of the app).
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: 'Invalid session' }, 401);
    }
    const authId = userData.user.id;

    // Resolve the effective business id - if this person is active staff on someone
    // else's team, operate on that owner's data instead of their own (same rule
    // App.jsx applies on login).
    const { data: membership } = await supabase
      .from('team_members')
      .select('owner_id')
      .eq('member_user_id', authId)
      .eq('status', 'active')
      .maybeSingle();
    const ownerId = membership?.owner_id || authId;

    const context = await buildBusinessContext(supabase, ownerId);
    const reply = await askGroq(message, context);

    return json({ reply });
  } catch (err) {
    console.error('chatbot error:', err);
    return json({ error: 'Something went wrong handling that request.' }, 500);
  }
});

// Matches src/utils/currency.js exactly, so numbers read the same way here as they do
// everywhere else in the app ("Rp 26.000.000", dot thousands-separator).
function formatIDR(amount: number) {
  return `Rp ${Math.round(amount || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
}

// Pulls a lean snapshot of the business's current state - just enough for the model to
// answer stock/trend/spending questions grounded in real numbers, without shipping entire
// tables. Every money figure is pre-formatted (see formatIDR) so the model only ever has
// to relay a string, never compute currency formatting itself.
async function buildBusinessContext(supabase: ReturnType<typeof createClient>, ownerId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    { data: products },
    { data: sales },
    { data: saleItems },
    { data: orders },
    { data: suppliers },
    { data: expenses },
  ] = await Promise.all([
    supabase.from('view_products').select('name, stock, low_stock, price, category_name').eq('user_id', ownerId),
    supabase
      .from('view_transaction')
      .select('transaction_id, total_amount, created_at')
      .eq('user_id', ownerId)
      .eq('transaction_type', 'sale')
      .gte('created_at', sevenDaysAgo.toISOString()),
    supabase
      .from('view_transaction_item')
      .select('product_name, quantity, subtotal, transaction_id')
      .eq('user_id', ownerId),
    supabase.from('view_orders').select('status, total_cost, subtotal, created_at').eq('user_id', ownerId),
    supabase.from('suppliers').select('name').eq('user_id', ownerId),
    supabase
      .from('expenses')
      .select('category, description, amount, expense_date')
      .eq('user_id', ownerId)
      .gte('expense_date', monthStart.toISOString().slice(0, 10)),
  ]);

  const saleTransactionIds = new Set((sales || []).map((s) => s.transaction_id));
  const recentItems = (saleItems || []).filter((i) => saleTransactionIds.has(i.transaction_id));

  const revenueByProduct: Record<string, number> = {};
  for (const item of recentItems) {
    revenueByProduct[item.product_name] = (revenueByProduct[item.product_name] || 0) + (item.subtotal || 0);
  }
  const topProducts = Object.entries(revenueByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, revenue]) => ({ name, revenue: formatIDR(revenue) }));

  const lowStockItems = (products || [])
    .filter((p) => p.stock <= p.low_stock)
    .map((p) => ({ name: p.name, stock: p.stock, threshold: p.low_stock }));

  const salesByDayRaw: Record<string, number> = {};
  for (const s of sales || []) {
    const day = new Date(s.created_at).toISOString().slice(0, 10);
    salesByDayRaw[day] = (salesByDayRaw[day] || 0) + (s.total_amount || 0);
  }
  const salesByDay = Object.fromEntries(
    Object.entries(salesByDayRaw).map(([day, total]) => [day, formatIDR(total)])
  );

  const pendingOrders = (orders || []).filter((o) => o.status === 'Pending');

  const expensesByCategory: Record<string, number> = {};
  for (const e of expenses || []) {
    expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + (e.amount || 0);
  }
  const expensesThisMonthTotal = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);

  return {
    totalProducts: products?.length || 0,
    totalInventoryValue: formatIDR((products || []).reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0)),
    lowStockItems,
    salesLast7DaysTotal: formatIDR((sales || []).reduce((sum, s) => sum + (s.total_amount || 0), 0)),
    salesByDay,
    topProductsLast7Days: topProducts,
    pendingOrdersCount: pendingOrders.length,
    pendingOrdersValue: formatIDR(pendingOrders.reduce((sum, o) => sum + (o.total_cost ?? o.subtotal ?? 0), 0)),
    totalSuppliers: suppliers?.length || 0,
    supplierNames: (suppliers || []).map((s) => s.name),
    expensesThisMonthTotal: formatIDR(expensesThisMonthTotal),
    expensesByCategoryThisMonth: Object.fromEntries(
      Object.entries(expensesByCategory).map(([category, amount]) => [category, formatIDR(amount)])
    ),
  };
}

async function askGroq(message: string, context: unknown) {
  const systemPrompt = `You are a business assistant embedded in "Wisely", a warehouse/POS management app. Answer the user's question using ONLY the JSON business data below - don't invent numbers that aren't there. If the data doesn't cover what's asked, say so plainly instead of guessing. Keep answers concise and concrete (cite actual numbers/names from the data).

Money values in the data are already formatted as Indonesian Rupiah strings (e.g. "Rp 26.000.000") - copy them exactly as given, don't strip the "Rp", don't re-add commas, don't convert to a different format.

Business data:
${JSON.stringify(context, null, 2)}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "I couldn't generate a response for that.";
}
