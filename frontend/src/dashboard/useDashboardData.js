import { useEffect, useMemo, useState } from 'react';
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import transactionService from '../services/transactionService';
import orderService from '../services/orderService';

// Single shared fetch for every widget on the customizable dashboard, so adding/removing
// widgets never triggers extra network calls - everything is pulled once up front and
// widgets just read whatever slice they need from the result.
export function useDashboardData(user) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [rawSalesTransactions, setRawSalesTransactions] = useState([]);
  const [rawTransactionItems, setRawTransactionItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productList, supplierResp, weeklyTransactions, sales, items, orderList] = await Promise.all([
          productService.getProductList(user.id),
          supplierService.getSupplierList(user),
          transactionService.getTransactionsByPeriod(user, 'weekly'),
          transactionService.getSalesTransactions(user),
          transactionService.getAllTransactionItems(user),
          orderService.getOrderListByUser(user),
        ]);

        setProducts(productList || []);
        setSuppliers(supplierResp?.data || []);
        setRawSalesTransactions((sales || []).filter((t) => t.transaction_type === 'sale'));
        setRawTransactionItems(items || []);
        setOrders(orderList || []);
        setRecentTransactions((weeklyTransactions || []).slice(0, 10));
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data. Please check network and service connectivity.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const lowStockItems = useMemo(
    () => products.filter((p) => p.stock <= p.low_stock),
    [products]
  );

  const salesToday = useMemo(() => {
    const today = new Date();
    return rawSalesTransactions
      .filter((t) => new Date(t.created_at).toDateString() === today.toDateString())
      .reduce((sum, t) => sum + (t.total_amount || 0), 0);
  }, [rawSalesTransactions]);

  const averageOrderValue = useMemo(() => {
    if (rawSalesTransactions.length === 0) return 0;
    const total = rawSalesTransactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
    return total / rawSalesTransactions.length;
  }, [rawSalesTransactions]);

  const totalInventoryValue = useMemo(
    () => products.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0),
    [products]
  );

  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'Pending').length,
    [orders]
  );

  // This week's (last 7 days) sales total vs. the 7 days before that.
  const weekOverWeekChange = useMemo(() => {
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);

    let thisWeekTotal = 0;
    let lastWeekTotal = 0;
    rawSalesTransactions.forEach((t) => {
      const tDate = new Date(t.created_at);
      if (tDate >= thisWeekStart && tDate <= now) {
        thisWeekTotal += t.total_amount || 0;
      } else if (tDate >= lastWeekStart && tDate < thisWeekStart) {
        lastWeekTotal += t.total_amount || 0;
      }
    });

    if (lastWeekTotal === 0) return null;
    const percent = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
    return {
      direction: percent >= 0 ? 'up' : 'down',
      label: `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}% vs last week`,
    };
  }, [rawSalesTransactions]);

  // Rolling 7-day window shared by gross margin, days-of-stock, purchase trend, and
  // category revenue - mirrors the Statistics page's fixed 7-day scope.
  const sevenDayStats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const windowStart = new Date(todayStart);
    windowStart.setDate(windowStart.getDate() - 6);
    const windowEnd = new Date(todayStart);
    windowEnd.setDate(windowEnd.getDate() + 1);

    const costByProductId = new Map(products.map((p) => [p.id, p.price]));
    const categoryByProductId = new Map(products.map((p) => [p.id, p.category_name]));
    const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    const saleTransactionDates = new Map(
      rawSalesTransactions.map((t) => [t.transaction_id, new Date(t.created_at)])
    );

    let totalRevenue = 0;
    let totalCogs = 0;
    let totalQuantitySold = 0;
    const revenueByCategory = {};

    rawTransactionItems.forEach((item) => {
      const tDate = saleTransactionDates.get(item.transaction_id);
      if (!tDate || tDate < windowStart || tDate >= windowEnd) return;

      const quantity = item.quantity || 0;
      const subtotal = item.subtotal || 0;

      totalRevenue += subtotal;
      totalCogs += quantity * (costByProductId.get(item.product_id) || 0);
      totalQuantitySold += quantity;

      const category = categoryByProductId.get(item.product_id) || 'Uncategorized';
      revenueByCategory[category] = (revenueByCategory[category] || 0) + subtotal;
    });

    const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCogs) / totalRevenue) * 100 : null;
    const avgDailyUnitsSold = totalQuantitySold / 7;
    const daysOfStock = avgDailyUnitsSold > 0 ? totalStockUnits / avgDailyUnitsSold : null;

    const purchaseByDate = {};
    for (let i = 0; i < 7; i++) {
      const bucketDate = new Date(windowStart);
      bucketDate.setDate(bucketDate.getDate() + i);
      purchaseByDate[bucketDate.toLocaleDateString()] = 0;
    }
    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const oDate = new Date(o.created_at);
      if (oDate >= windowStart && oDate < windowEnd) {
        const dateStr = oDate.toLocaleDateString();
        const spend = o.total_cost ?? o.subtotal ?? 0;
        purchaseByDate[dateStr] = (purchaseByDate[dateStr] || 0) + spend;
      }
    });
    const purchaseTrend = Object.keys(purchaseByDate).map((date) => ({ date, total: purchaseByDate[date] }));

    const categoryRevenue = Object.entries(revenueByCategory).map(([category, revenue]) => ({ category, revenue }));

    return { grossMargin, daysOfStock, purchaseTrend, categoryRevenue };
  }, [products, orders, rawTransactionItems, rawSalesTransactions]);

  return {
    loading,
    error,
    products,
    suppliers,
    rawSalesTransactions,
    rawTransactionItems,
    orders,
    recentTransactions,
    lowStockItems,
    totalProducts: products.length,
    totalSuppliers: suppliers.length,
    salesToday,
    averageOrderValue,
    totalInventoryValue,
    pendingOrdersCount,
    weekOverWeekChange,
    ...sevenDayStats,
  };
}
