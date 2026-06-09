'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface AnalyticsData {
  metrics: {
    totalRevenue: number;
    totalOrdersCount: number;
    averageOrderValue: number;
    lowStockCount: number;
  };
  monthlySalesChart: { name: string; revenue: number; orders: number }[];
  bestSellers: { name: string; qty: number; revenue: number }[];
  lowStockAlerts: { id: string; name: string; sku: string; inventory: number }[];
  trafficOverview: {
    visitors: number;
    pageViews: number;
    conversionRate: number;
    bounceRate: number;
  };
}

export default function DashboardOverview() {
  const router = useRouter();
  const { t } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Auth guard
    if (typeof window !== 'undefined' && localStorage.getItem('velluto_admin_auth') !== 'true') {
      router.replace('/admin/login');
      return;
    }
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch analytics and recent orders in parallel from the real DB
      const [analyticsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/analytics', { cache: 'no-store' }),
        fetch('/api/admin/orders', { cache: 'no-store' }),
      ]);

      if (!analyticsRes.ok) throw new Error('Failed to load analytics.');
      if (!ordersRes.ok) throw new Error('Failed to load orders.');

      const [analyticsData, ordersData] = await Promise.all([
        analyticsRes.json(),
        ordersRes.json(),
      ]);

      setData(analyticsData);
      setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
    } catch (e: any) {
      console.error('[dashboard] Failed to load:', e);
      setError(e.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRestock = async (prodId: string, currentInv: number) => {
    const qtyStr = window.prompt('Enter restock quantity:', '10');
    if (!qtyStr) return;
    const qty = parseInt(qtyStr);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid positive number.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${prodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventory: currentInv + qty }),
      });
      if (res.ok) {
        alert('Stock restocked successfully.');
        loadData();
      } else {
        alert('Failed to restock items.');
      }
    } catch (e) {
      alert('Network error during restock operation.');
    }
  };

  function darkModeActive() {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  }

  if (isLoading || !data) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
            {t('admin_dashboard_loading')}
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <p className="text-sm text-red-500 font-semibold">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-xl"
          >
            {t('admin_dashboard_retry')}
          </button>
        </div>
      </AdminLayout>
    );
  }

  const chartColor = darkModeActive() ? '#ffffff' : '#171717';

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              {t('admin_dashboard_overview')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              {t('admin_dashboard_subtitle')}
            </p>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 transition-colors shadow-sm"
          >
            <Icon name="ArrowPathIcon" size={14} />
            {t('admin_dashboard_refresh')}
          </button>
        </div>

        {/* Statistical Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('admin_stat_revenue')}
            value={`${data.metrics.totalRevenue.toLocaleString()} GEL`}
            change="+18.4%"
            changeType="positive"
            iconName="CurrencyDollarIcon"
            trendData={[3000, 4200, 3800, 5600, 7800, data.metrics.totalRevenue]}
          />
          <StatCard
            title={t('admin_stat_orders')}
            value={data.metrics.totalOrdersCount}
            change="+5.2%"
            changeType="positive"
            iconName="ClipboardDocumentListIcon"
            trendData={[8, 12, 10, 15, 18, data.metrics.totalOrdersCount]}
          />
          <StatCard
            title={t('admin_stat_aov')}
            value={`${data.metrics.averageOrderValue.toLocaleString()} GEL`}
            change="-2.1%"
            changeType="negative"
            iconName="ChartBarIcon"
            trendData={[500, 550, 480, 520, 510, data.metrics.averageOrderValue]}
          />
          <StatCard
            title={t('admin_stat_low_stock')}
            value={data.metrics.lowStockCount}
            changeType="neutral"
            iconName="ExclamationTriangleIcon"
          />
        </section>

        {/* Monthly Revenue Area Chart */}
        <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                {t('admin_chart_title')}
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                {t('admin_chart_subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800 p-1.5 rounded-lg border border-neutral-100 dark:border-neutral-700/50">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-sm uppercase tracking-wider">
                GEL
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.monthlySalesChart}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={darkModeActive() ? '#262626' : '#f5f5f5'}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                  />
                  <YAxis
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkModeActive() ? '#171717' : '#ffffff',
                      borderColor: darkModeActive() ? '#262626' : '#e5e5e5',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={chartColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-neutral-50 dark:bg-neutral-950 rounded-xl animate-pulse flex items-center justify-center text-xs text-neutral-400">
                {t('admin_chart_rendering')}
              </div>
            )}
          </div>
        </section>

        {/* Lower Grid (Recent Orders, Low Stock, Best Sellers) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Table */}
          <section className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                  {t('admin_recent_orders')}
                </h3>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  {t('admin_recent_orders_sub')}
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                {t('admin_view_all_orders')}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-neutral-400 dark:text-neutral-500 font-bold uppercase text-[9px] border-b border-neutral-100 dark:border-neutral-800">
                    <th className="py-2.5">{t('admin_table_id')}</th>
                    <th>{t('admin_table_customer')}</th>
                    <th>{t('admin_table_payment')}</th>
                    <th>{t('admin_table_status')}</th>
                    <th className="text-right">{t('admin_table_total')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-400 italic">
                        {t('admin_no_recent_orders')}
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((o) => (
                      <tr
                        key={o.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-3.5 font-bold">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="hover:underline text-neutral-900 dark:text-white"
                          >
                            {o.id}
                          </Link>
                        </td>
                        <td>
                          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {o.customerName}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-light">{o.phone}</p>
                        </td>
                        <td>
                          <span className="bg-neutral-100 dark:bg-neutral-800 text-[10px] px-2 py-0.5 rounded font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              o.status === 'PENDING'
                                ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400'
                                : o.status === 'PROCESSING' || o.status === 'CONFIRMED'
                                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                                  : o.status === 'DELIVERED'
                                    ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                                    : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="text-right font-bold text-neutral-900 dark:text-white">
                          {o.total} GEL
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Low Stock & Best Sellers Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Best Sellers */}
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                  {t('admin_best_sellers')}
                </h3>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  {t('admin_best_sellers_sub')}
                </p>
              </div>

              <div className="space-y-3">
                {data.bestSellers.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic py-4 text-center">
                    {t('admin_no_sales')}
                  </p>
                ) : (
                  data.bestSellers.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-100/60 dark:border-neutral-800"
                    >
                      <div>
                        <p className="text-xs font-semibold text-neutral-950 dark:text-white leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5 font-light">
                          {t('admin_qty_sold')}{item.qty}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {item.revenue} GEL
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Low Stock Alerts */}
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                  {t('admin_low_stock_warning')}
                </h3>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  {t('admin_low_stock_sub')}
                </p>
              </div>

              <div className="space-y-3">
                {data.lowStockAlerts.length === 0 ? (
                  <p className="text-xs text-green-600 dark:text-green-400 italic py-4 text-center">
                    {t('admin_all_inventory_healthy')}
                  </p>
                ) : (
                  data.lowStockAlerts.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 rounded-xl bg-red-50/20 dark:bg-red-950/10 border border-red-100/50 dark:border-red-900/30"
                    >
                      <div>
                        <p className="text-xs font-semibold text-neutral-950 dark:text-white leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded dark:bg-red-950/40 dark:text-red-400">
                          {item.inventory} {t('admin_left')}
                        </span>
                        <button
                          onClick={() => handleRestock(item.id, item.inventory)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
                          title="Restock Item"
                        >
                          <Icon name="ArrowUpCircleIcon" size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
