import KpiWidget from './widgets/KpiWidget';
import SalesOverTimeWidget from './widgets/SalesOverTimeWidget';
import TopProductsWidget from './widgets/TopProductsWidget';
import PurchaseTrendWidget from './widgets/PurchaseTrendWidget';
import CategoryRevenueWidget from './widgets/CategoryRevenueWidget';
import ForecastPreviewWidget from './widgets/ForecastPreviewWidget';
import RecentTransactionsWidget from './widgets/RecentTransactionsWidget';
import ReorderSuggestionsWidget from './widgets/ReorderSuggestionsWidget';

// Every widget a user can add to their customizable dashboard. `props` are static extras
// passed to the widget alongside `data` (the shared useDashboardData() result) and
// `editMode`. `defaultSize` seeds a sensible w/h/minW/minH when a widget is first added.
export const WIDGET_REGISTRY = {
  'kpi-sales-today': {
    title: 'Sales Today',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'salesToday' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-avg-order-value': {
    title: 'Avg Order Value',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'avgOrderValue' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-inventory-value': {
    title: 'Total Inventory Value',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'inventoryValue' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-pending-orders': {
    title: 'Pending Orders',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'pendingOrders' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-total-products': {
    title: 'Total Products',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'totalProducts' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-total-suppliers': {
    title: 'Total Suppliers',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'totalSuppliers' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-low-stock': {
    title: 'Low Stock Items',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'lowStock' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-gross-margin': {
    title: 'Gross Margin (7d)',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'grossMargin' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-days-of-stock': {
    title: 'Days of Stock',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'daysOfStock' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-total-expenses': {
    title: 'Expenses (This Month)',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'totalExpenses' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'kpi-net-profit': {
    title: 'Net Profit (This Month)',
    category: 'KPI',
    component: KpiWidget,
    props: { metricId: 'netProfit' },
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
  },
  'chart-sales-over-time': {
    title: 'Sales Over Time',
    category: 'Chart',
    component: SalesOverTimeWidget,
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
  },
  'chart-top-products': {
    title: 'Top-Selling Products',
    category: 'Chart',
    component: TopProductsWidget,
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
  },
  'chart-purchase-trend': {
    title: 'Purchase Spend Trend',
    category: 'Chart',
    component: PurchaseTrendWidget,
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
  },
  'chart-category-revenue': {
    title: 'Revenue by Category',
    category: 'Chart',
    component: CategoryRevenueWidget,
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
  },
  'widget-forecast-preview': {
    title: 'Sales Forecast',
    category: 'Chart',
    component: ForecastPreviewWidget,
    defaultSize: { w: 6, h: 2, minW: 3, minH: 2 },
  },
  'widget-recent-transactions': {
    title: 'Recent Transactions',
    category: 'Chart',
    component: RecentTransactionsWidget,
    defaultSize: { w: 12, h: 4, minW: 6, minH: 3 },
  },
  'widget-reorder-suggestions': {
    title: 'Reorder Suggestions',
    category: 'Chart',
    component: ReorderSuggestionsWidget,
    defaultSize: { w: 12, h: 4, minW: 6, minH: 3 },
  },
};

export const WIDGET_IDS = Object.keys(WIDGET_REGISTRY);
