'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
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
  trafficOverview: {
    visitors: number;
    pageViews: number;
    conversionRate: number;
    bounceRate: number;
  };
}

const CATEGORY_COLORS = ['#171717', '#404040', '#737373', '#a3a3a3'];

export default function BusinessAnalytics() {
  const { t } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load business analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const handleDownloadReport = () => {
    if (!data) return;
    const reportData = [
      ['Business Metrics Report - Velluto', 'Generated: ' + new Date().toLocaleDateString()],
      [],
      ['Metric', 'Value'],
      ['Total Revenue', `${data.metrics.totalRevenue} GEL`],
      ['Total Orders', data.metrics.totalOrdersCount],
      ['Average Order Value', `${data.metrics.averageOrderValue} GEL`],
      ['Total Visitors', data.trafficOverview.visitors],
      ['Total Pageviews', data.trafficOverview.pageViews],
      ['Conversion Rate', `${data.trafficOverview.conversionRate}%`],
      ['Bounce Rate', `${data.trafficOverview.bounceRate}%`],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      reportData.map((row) => row.map((val) => `"${val}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Velluto_Business_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !data) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
            {t('admin_analytics_load')}
          </p>
        </div>
      </AdminLayout>
    );
  }

  // Categories Chart Mock Aggregation
  const categorySalesData = [
    { name: 'Dresses', value: 4500 },
    { name: 'Suits', value: 2800 },
    { name: 'Knitwear', value: 2200 },
  ];

  // Traffic Source Mock data
  const trafficSources = [
    { name: 'Direct', visitors: 840, conversion: 2.8 },
    { name: 'Organic Search', visitors: 420, conversion: 1.5 },
    { name: 'Instagram Referral', visitors: 520, conversion: 5.4 },
    { name: 'Email Campaign', visitors: 60, conversion: 6.2 },
  ];

  const chartStroke = darkModeActive() ? '#ffffff' : '#171717';
  const gridColor = darkModeActive() ? '#262626' : '#f5f5f5';

  function darkModeActive() {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Title & Date Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-b border-neutral-100 dark:border-neutral-800 pb-5 gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              {t('admin_analytics_title')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              {t('admin_analytics_sub')}
            </p>
          </div>
          <div className="flex gap-2.5 items-center justify-end">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-xl focus:outline-none"
            >
              <option value="30days">{t('admin_analytics_30d')}</option>
              <option value="6months">{t('admin_analytics_6m')}</option>
              <option value="year">{t('admin_analytics_1y')}</option>
            </select>
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-md"
            >
              <Icon name="ArrowDownTrayIcon" size={14} />
              {t('admin_analytics_dl')}
            </button>
          </div>
        </div>

        {/* 2-Column charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Monthly Revenue Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                {t('admin_analytics_rev_vol')}
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mb-6">
                {t('admin_analytics_rev_sub')}
              </p>
            </div>

            <div className="h-80 w-full">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.monthlySalesChart}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSalesRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartStroke} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={chartStroke} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
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
                      stroke={chartStroke}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSalesRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-neutral-50 dark:bg-neutral-950 rounded-xl animate-pulse" />
              )}
            </div>
          </div>

          {/* Categories Pie Chart */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                {t('admin_analytics_cat')}
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mb-6">
                {t('admin_analytics_cat_sub')}
              </p>
            </div>

            <div className="h-60 w-full flex items-center justify-center">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySalesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categorySalesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-neutral-50 dark:bg-neutral-950 rounded-xl animate-pulse" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-neutral-100 dark:border-neutral-800">
              {categorySalesData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[idx] }}
                  />
                  <span className="text-neutral-500 dark:text-neutral-400 truncate max-w-[80px]">
                    {entry.name}
                  </span>
                  <span className="font-bold ml-auto">{entry.value} GEL</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources & Conversion rates metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traffic Overview card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                {t('admin_analytics_traffic')}
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                {t('admin_analytics_traffic_sub')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-850">
                <p className="text-[10px] uppercase font-bold text-neutral-400">{t('admin_analytics_visitors')}</p>
                <h4 className="text-2xl font-bold mt-2 text-neutral-900 dark:text-white">
                  {data.trafficOverview.visitors}
                </h4>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-850">
                <p className="text-[10px] uppercase font-bold text-neutral-400">{t('admin_analytics_pageviews')}</p>
                <h4 className="text-2xl font-bold mt-2 text-neutral-900 dark:text-white">
                  {data.trafficOverview.pageViews}
                </h4>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-850">
                <p className="text-[10px] uppercase font-bold text-neutral-400">{t('admin_analytics_conv')}</p>
                <h4 className="text-2xl font-bold mt-2 text-neutral-900 dark:text-white">
                  {data.trafficOverview.conversionRate}%
                </h4>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-850">
                <p className="text-[10px] uppercase font-bold text-neutral-400">{t('admin_analytics_bounce')}</p>
                <h4 className="text-2xl font-bold mt-2 text-neutral-900 dark:text-white">
                  {data.trafficOverview.bounceRate}%
                </h4>
              </div>
            </div>
          </div>

          {/* Traffic Sources breakdown */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                {t('admin_analytics_channel')}
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                {t('admin_analytics_channel_sub')}
              </p>
            </div>

            <div className="h-64 w-full">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trafficSources}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="visitors" fill={chartStroke} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-neutral-50 dark:bg-neutral-950 rounded-xl animate-pulse" />
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
