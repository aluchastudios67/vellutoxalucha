'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import DataTable from '../components/DataTable';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  total: number;
  createdAt: string;
  items: { productName: string; qty: number }[];
}

export default function OrdersLog() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/orders?status=${statusFilter}&payment=${paymentFilter}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to load orders log.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter]);

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert(t('admin_orders_no_export'));
      return;
    }

    const headers = [
      t('admin_orders_col_id'),
      t('admin_orders_col_customer'),
      t('admin_orders_col_phone'),
      t('admin_orders_col_address'),
      t('admin_orders_col_date'),
      t('admin_orders_col_time'),
      t('admin_orders_col_method'),
      t('admin_orders_col_status'),
      t('admin_orders_col_pay_status'),
      t('admin_orders_col_total'),
    ];
    const rows = orders.map((o) => [
      o.id,
      o.customerName,
      o.phone,
      o.address.replace(/"/g, '""'),
      o.deliveryDate,
      o.deliveryTime,
      o.paymentMethod,
      o.status,
      o.paymentStatus,
      o.total,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Velluto_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: t('admin_orders_col_id'),
      accessor: (o: Order) => (
        <a
          href={`/admin/orders/${o.id}`}
          className="font-bold hover:underline text-neutral-900 dark:text-white"
        >
          {o.id}
        </a>
      ),
      sortable: true,
      sortKey: 'id',
      className: 'w-24',
    },
    {
      header: t('admin_orders_col_customer'),
      accessor: (o: Order) => (
        <div>
          <p className="font-semibold text-neutral-900 dark:text-white">{o.customerName}</p>
          <p className="text-[10px] text-neutral-400 font-light mt-0.5">{o.phone}</p>
        </div>
      ),
      sortable: true,
      sortKey: 'customerName',
    },
    {
      header: t('admin_orders_col_items'),
      accessor: (o: Order) => (
        <div className="max-w-xs truncate font-light text-neutral-500 dark:text-neutral-400">
          {o.items.map((item) => `${item.productName} (x${item.qty})`).join(', ')}
        </div>
      ),
    },
    {
      header: t('admin_orders_col_date'),
      accessor: (o: Order) => (
        <div>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{o.deliveryDate}</p>
          <p className="text-[10px] text-neutral-400 font-light">@ {o.deliveryTime}</p>
        </div>
      ),
      sortable: true,
      sortKey: 'deliveryDate',
    },
    {
      header: t('admin_orders_col_method'),
      accessor: (o: Order) => (
        <span className="bg-neutral-100 dark:bg-neutral-800 text-[10px] px-2 py-0.5 rounded font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
          {o.paymentMethod}
        </span>
      ),
      sortable: true,
      sortKey: 'paymentMethod',
    },
    {
      header: t('admin_orders_col_pay_status'),
      accessor: (o: Order) => (
        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            o.paymentStatus === 'PAID'
              ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
              : o.paymentStatus === 'REFUNDED'
                ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
          }`}
        >
          {o.paymentStatus}
        </span>
      ),
      sortable: true,
      sortKey: 'paymentStatus',
    },
    {
      header: t('admin_orders_col_status'),
      accessor: (o: Order) => (
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
      ),
      sortable: true,
      sortKey: 'status',
    },
    {
      header: t('admin_orders_col_total'),
      accessor: (o: Order) => (
        <span className="font-bold text-neutral-900 dark:text-white">{o.total} GEL</span>
      ),
      sortable: true,
      sortKey: 'total',
      className: 'text-right font-semibold',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
            {t('admin_orders_loading')}
          </p>
        </div>
      </AdminLayout>
    );
  }

  const filters = (
    <div className="flex gap-2.5 items-center">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 rounded-xl focus:outline-none"
      >
        <option value="All">{t('admin_orders_filter_all_status')}</option>
        <option value="PENDING">{t('admin_orders_filter_pending')}</option>
        <option value="PROCESSING">{t('admin_orders_filter_processing')}</option>
        <option value="SHIPPED">{t('admin_orders_filter_shipped')}</option>
        <option value="DELIVERED">{t('admin_orders_filter_delivered')}</option>
        <option value="CANCELLED">{t('admin_orders_filter_cancelled')}</option>
        <option value="REFUNDED">{t('admin_orders_filter_refunded')}</option>
      </select>

      <select
        value={paymentFilter}
        onChange={(e) => setPaymentFilter(e.target.value)}
        className="text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 rounded-xl focus:outline-none"
      >
        <option value="All">{t('admin_orders_filter_all_pay')}</option>
        <option value="Cash">{t('admin_orders_filter_cash')}</option>
        <option value="Card">{t('admin_orders_filter_card')}</option>
        <option value="Bank">{t('admin_orders_filter_bank')}</option>
      </select>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              {t('admin_orders_title')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              {t('admin_orders_subtitle')}
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 transition-colors shadow-sm"
          >
            <Icon name="ArrowDownTrayIcon" size={14} />
            {t('admin_orders_export')}
          </button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={orders}
          searchPlaceholder={t('admin_orders_search')}
          searchKey="customerName"
          filterComponent={filters}
          emptyMessage={t('admin_orders_empty')}
        />
      </div>
    </AdminLayout>
  );
}
