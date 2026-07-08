// Simple least-squares linear regression forecast. Good enough to project a short-term
// trend from recent daily totals; it will not catch seasonality (weekday/holiday patterns).

function linearRegression(series) {
  const n = series.length;
  if (n === 0) return { slope: 0, intercept: 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  series.forEach((y, x) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

// series: array of daily totals, oldest first. Returns `days` predictions for the days
// immediately following the series, clamped to non-negative values.
export function forecastNextDays(series, days) {
  const { slope, intercept } = linearRegression(series);
  const n = series.length;
  const predictions = [];
  for (let i = 0; i < days; i++) {
    const x = n + i;
    predictions.push(Math.max(0, slope * x + intercept));
  }
  return { predictions, slope, intercept };
}

// Classifies a trend as Increasing/Decreasing/Flat relative to the series' own average,
// so the threshold scales with the product instead of using a fixed absolute cutoff.
export function classifyTrend(slope, average) {
  if (!average) return 'Flat';
  const relative = slope / average;
  if (relative > 0.05) return 'Increasing';
  if (relative < -0.05) return 'Decreasing';
  return 'Flat';
}
