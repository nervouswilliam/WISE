// Shared rolling-window bucketing used by any widget with its own timeframe dropdown
// (Sales Over Time, Top-Selling Products). Each timeframe is a window ending today,
// broken into buckets of the given unit, e.g. "weekly" => the 7 days up to and including
// today, one bucket per day.
export const TIMEFRAME_CONFIG = {
  daily: { unit: 'hour', count: 24 },
  weekly: { unit: 'day', count: 7 },
  monthly: { unit: 'day', count: 30 },
  quarterly: { unit: 'week', count: 13 },
  yearly: { unit: 'month', count: 12 },
};

export const getBucketStart = (date, unit) => {
  const d = new Date(date);
  switch (unit) {
    case 'hour':
      d.setMinutes(0, 0, 0);
      return d;
    case 'week':
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d;
    case 'month':
      d.setHours(0, 0, 0, 0);
      d.setDate(1);
      return d;
    case 'day':
    default:
      d.setHours(0, 0, 0, 0);
      return d;
  }
};

export const addUnit = (date, unit, amount) => {
  const d = new Date(date);
  switch (unit) {
    case 'hour':
      d.setHours(d.getHours() + amount);
      break;
    case 'week':
      d.setDate(d.getDate() + amount * 7);
      break;
    case 'month':
      d.setMonth(d.getMonth() + amount);
      break;
    case 'day':
    default:
      d.setDate(d.getDate() + amount);
      break;
  }
  return d;
};

export const formatBucketLabel = (date, unit) => {
  switch (unit) {
    case 'hour':
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    case 'week':
      return `Week of ${date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}`;
    case 'month':
      return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    case 'day':
    default:
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  }
};

// Computes the rolling [start, end) window for a timeframe, anchored to today.
// "all" spans from the earliest of the given transactions through the current month.
export const computeSalesWindow = (timeframe, transactions) => {
  const unit = timeframe === 'all' ? 'month' : (TIMEFRAME_CONFIG[timeframe] || TIMEFRAME_CONFIG.daily).unit;
  const currentBucketStart = getBucketStart(new Date(), unit);
  const end = addUnit(currentBucketStart, unit, 1);

  let count;
  if (timeframe === 'all') {
    if (transactions.length === 0) {
      count = 1;
    } else {
      const earliest = transactions.reduce(
        (min, t) => (new Date(t.created_at) < min ? new Date(t.created_at) : min),
        new Date(transactions[0].created_at)
      );
      const earliestBucketStart = getBucketStart(earliest, unit);
      count =
        (currentBucketStart.getFullYear() - earliestBucketStart.getFullYear()) * 12 +
        (currentBucketStart.getMonth() - earliestBucketStart.getMonth()) +
        1;
    }
  } else {
    count = (TIMEFRAME_CONFIG[timeframe] || TIMEFRAME_CONFIG.daily).count;
  }

  const start = addUnit(currentBucketStart, unit, -(count - 1));
  return { unit, count, start, end };
};

// Builds { date, total } buckets of sales revenue for the given timeframe.
export const buildSalesSeries = (rawSalesTransactions, timeframe) => {
  const { unit, count, start } = computeSalesWindow(timeframe, rawSalesTransactions);
  const buckets = [];
  for (let i = 0; i < count; i++) {
    const bucketStart = addUnit(start, unit, i);
    buckets.push({
      label: formatBucketLabel(bucketStart, unit),
      start: bucketStart,
      end: addUnit(bucketStart, unit, 1),
      total: 0,
    });
  }

  rawSalesTransactions.forEach((t) => {
    const tDate = new Date(t.created_at);
    const bucket = buckets.find((b) => tDate >= b.start && tDate < b.end);
    if (bucket) {
      bucket.total += t.total_amount;
    }
  });

  return buckets.map((b) => ({ date: b.label, total: b.total }));
};

// Builds the top-5 selling products (by units) for the given timeframe.
export const buildTopProducts = (rawTransactionItems, rawSalesTransactions, timeframe) => {
  const { start, end } = computeSalesWindow(timeframe, rawSalesTransactions);
  const saleTransactionDates = new Map(
    rawSalesTransactions.map((t) => [t.transaction_id, new Date(t.created_at)])
  );

  const soldByProduct = rawTransactionItems.reduce((acc, item) => {
    const tDate = saleTransactionDates.get(item.transaction_id);
    if (!tDate || tDate < start || tDate >= end) return acc;
    acc[item.product_name] = (acc[item.product_name] || 0) + (item.quantity || 0);
    return acc;
  }, {});

  return Object.entries(soldByProduct)
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
};
