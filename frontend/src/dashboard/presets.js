// Curated starting layouts. `widgets` must list exactly the ids present in `layout`.
// x/w only need to avoid horizontal overlap within a row - vertical compaction pulls
// everything upward automatically, so y doesn't need to be pixel-perfect.
export const PRESETS = {
  overview: {
    label: 'Overview',
    widgets: [
      'kpi-sales-today', 'kpi-avg-order-value', 'kpi-inventory-value', 'kpi-pending-orders',
      'kpi-total-products', 'kpi-total-suppliers', 'kpi-low-stock',
      'chart-sales-over-time', 'chart-top-products',
      'widget-recent-transactions',
    ],
    layout: [
      { i: 'kpi-sales-today', x: 0, y: 0, w: 3, h: 2 },
      { i: 'kpi-avg-order-value', x: 3, y: 0, w: 3, h: 2 },
      { i: 'kpi-inventory-value', x: 6, y: 0, w: 3, h: 2 },
      { i: 'kpi-pending-orders', x: 9, y: 0, w: 3, h: 2 },
      { i: 'kpi-total-products', x: 0, y: 2, w: 3, h: 2 },
      { i: 'kpi-total-suppliers', x: 3, y: 2, w: 3, h: 2 },
      { i: 'kpi-low-stock', x: 6, y: 2, w: 3, h: 2 },
      { i: 'chart-sales-over-time', x: 0, y: 4, w: 6, h: 4 },
      { i: 'chart-top-products', x: 6, y: 4, w: 6, h: 4 },
      { i: 'widget-recent-transactions', x: 0, y: 8, w: 12, h: 4 },
    ],
  },
  salesFocus: {
    label: 'Sales Focus',
    widgets: [
      'kpi-sales-today', 'kpi-avg-order-value', 'kpi-gross-margin', 'kpi-pending-orders',
      'chart-sales-over-time', 'chart-top-products',
      'widget-forecast-preview', 'chart-category-revenue',
    ],
    layout: [
      { i: 'kpi-sales-today', x: 0, y: 0, w: 3, h: 2 },
      { i: 'kpi-avg-order-value', x: 3, y: 0, w: 3, h: 2 },
      { i: 'kpi-gross-margin', x: 6, y: 0, w: 3, h: 2 },
      { i: 'kpi-pending-orders', x: 9, y: 0, w: 3, h: 2 },
      { i: 'chart-sales-over-time', x: 0, y: 2, w: 6, h: 4 },
      { i: 'chart-top-products', x: 6, y: 2, w: 6, h: 4 },
      { i: 'widget-forecast-preview', x: 0, y: 6, w: 6, h: 2 },
      { i: 'chart-category-revenue', x: 6, y: 6, w: 6, h: 4 },
    ],
  },
  inventoryFocus: {
    label: 'Inventory Focus',
    widgets: [
      'kpi-total-products', 'kpi-low-stock', 'kpi-inventory-value', 'kpi-days-of-stock',
      'kpi-pending-orders', 'kpi-total-suppliers',
      'chart-purchase-trend',
    ],
    layout: [
      { i: 'kpi-total-products', x: 0, y: 0, w: 3, h: 2 },
      { i: 'kpi-low-stock', x: 3, y: 0, w: 3, h: 2 },
      { i: 'kpi-inventory-value', x: 6, y: 0, w: 3, h: 2 },
      { i: 'kpi-days-of-stock', x: 9, y: 0, w: 3, h: 2 },
      { i: 'kpi-pending-orders', x: 0, y: 2, w: 3, h: 2 },
      { i: 'kpi-total-suppliers', x: 3, y: 2, w: 3, h: 2 },
      { i: 'chart-purchase-trend', x: 0, y: 4, w: 12, h: 4 },
    ],
  },
};

export const DEFAULT_PRESET_KEY = 'overview';
