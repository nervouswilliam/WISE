import React from 'react';
import KpiCard from '../../components/KpiCard';
import { formatCurrency } from '../../utils/currency';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventBusyIcon from '@mui/icons-material/EventBusy';

// Metric registry: each entry knows how to read/format its own value off the shared
// useDashboardData() result, so KpiWidget stays a single generic component instead of
// one file per metric.
export const KPI_METRICS = {
  totalProducts: {
    title: 'Total Products',
    color: '#3f51b5',
    icon: <Inventory2Icon />,
    to: '/warehouse',
    value: (d) => d.totalProducts,
  },
  totalSuppliers: {
    title: 'Total Suppliers',
    color: '#4caf50',
    icon: <LocalShippingIcon />,
    to: '/supplier',
    value: (d) => d.totalSuppliers,
  },
  salesToday: {
    title: 'Sales Today',
    color: '#ff9800',
    icon: <PointOfSaleIcon />,
    to: '/report',
    value: (d) => formatCurrency(d.salesToday),
    trend: (d) => d.weekOverWeekChange,
  },
  lowStock: {
    title: 'Low Stock Items',
    color: '#f44336',
    icon: <WarningAmberIcon />,
    to: '/statistic',
    value: (d) => d.lowStockItems.length,
  },
  avgOrderValue: {
    title: 'Avg Order Value',
    color: '#009688',
    icon: <ReceiptLongIcon />,
    to: '/report',
    value: (d) => formatCurrency(d.averageOrderValue),
  },
  inventoryValue: {
    title: 'Total Inventory Value',
    color: '#5e35b1',
    icon: <AccountBalanceWalletIcon />,
    to: '/warehouse',
    value: (d) => formatCurrency(d.totalInventoryValue),
    subtitle: 'Stock on hand, at cost',
  },
  pendingOrders: {
    title: 'Pending Orders',
    color: '#546e7a',
    icon: <PendingActionsIcon />,
    to: '/order',
    value: (d) => d.pendingOrdersCount,
    subtitle: 'Purchases awaiting delivery',
  },
  grossMargin: {
    title: 'Gross Margin (7d)',
    color: '#00897b',
    icon: <TrendingUpIcon />,
    to: '/statistic',
    value: (d) => (d.grossMargin !== null ? `${d.grossMargin.toFixed(1)}%` : 'N/A'),
  },
  daysOfStock: {
    title: 'Days of Stock',
    color: '#ff7043',
    icon: <EventBusyIcon />,
    to: '/statistic',
    value: (d) => (d.daysOfStock !== null ? `${d.daysOfStock.toFixed(1)} days` : 'N/A'),
  },
};

function KpiWidget({ metricId, data, editMode }) {
  const config = KPI_METRICS[metricId];
  if (!config || !data) return null;

  return (
    <KpiCard
      title={config.title}
      value={config.value(data)}
      color={config.color}
      icon={config.icon}
      to={editMode ? undefined : config.to}
      subtitle={config.subtitle}
      trend={config.trend ? config.trend(data) : undefined}
    />
  );
}

export default KpiWidget;
