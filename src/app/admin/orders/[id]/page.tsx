'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface OrderItem {
  id: string;
  productName: string;
  productPrice: number;
  qty: number;
  variantSelected?: string;
}

interface Customer {
  name: string;
  phone: string;
  address: string;
  email?: string;
  segment?: string;
}

interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: string;
  notes?: string;
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
  items: OrderItem[];
  customer?: Customer;
  coupon?: Coupon;
}

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLanguage();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Editable fields
  const [status, setStatus] = useState<Order['status']>('PENDING');
  const [paymentStatus, setPaymentStatus] = useState<Order['paymentStatus']>('UNPAID');

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
      } else {
        alert(t('admin_order_not_found'));
        router.push('/admin/orders');
      }
    } catch (e) {
      console.error('Failed to load order.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (res.ok) {
        alert(t('admin_order_update_success'));
        loadOrderDetails();
      } else {
        alert(t('admin_order_update_fail'));
      }
    } catch (e) {
      alert('Network error updating order.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (isLoading || !order) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
            {t('admin_order_loading')}
          </p>
        </div>
      </AdminLayout>
    );
  }

  // Calculations for Invoice
  const subtotal = order.items.reduce((sum, item) => sum + item.productPrice * item.qty, 0);
  const vat = Math.round(subtotal * 0.18); // 18% VAT included
  const discountAmount = order.coupon
    ? order.coupon.discountType === 'PERCENTAGE'
      ? (subtotal * order.coupon.discountValue) / 100
      : order.coupon.discountValue
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-10 print:bg-white print:text-black">
        {/* Header Title & Printable Invoice Actions */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5 print:hidden">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              {t('admin_order_title')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              {t('admin_order_subtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="border border-neutral-300 dark:border-neutral-800 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-950 dark:hover:border-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Icon name="DocumentTextIcon" size={14} />
              {t('admin_order_view_invoice')}
            </button>
            <Link
              href="/admin/orders"
              className="border border-neutral-300 dark:border-neutral-800 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-950 dark:hover:border-white transition-colors"
            >
              {t('admin_order_back')}
            </Link>
          </div>
        </div>

        {/* Dynamic Details 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
          {/* Left Panel: Items ordered & billing specs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Products catalog list */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                {t('admin_order_items')}
              </h3>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-neutral-950 dark:text-white text-sm">
                        {item.productName}
                      </p>
                      {item.variantSelected && (
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-light mt-0.5">
                          {t('admin_order_options')}{item.variantSelected}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900 dark:text-white text-xs">
                        {item.productPrice} GEL
                      </p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                        {t('admin_order_qty')}{item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div className="border-t border-neutral-150 dark:border-neutral-800 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>{t('admin_order_subtotal')}</span>
                  <span>{subtotal} GEL</span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                    <span>{t('admin_order_discount')} ({order.coupon.code})</span>
                    <span className="text-red-500 font-medium">-{discountAmount} GEL</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>{t('admin_order_vat')}</span>
                  <span>{vat} GEL</span>
                </div>
                <div className="flex justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3 text-neutral-900 dark:text-white text-sm font-bold">
                  <span>{t('admin_order_grand_total')}</span>
                  <span>{order.total} GEL</span>
                </div>
              </div>
            </div>

            {/* Gift notes or special instructions */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                {t('admin_order_notes')}
              </h3>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-150 dark:border-neutral-800 italic text-xs text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
                {order.notes ? `"${order.notes}"` : t('admin_order_no_notes')}
              </div>
            </div>
          </div>

          {/* Right Panel: Status controls & customer details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Manager widget */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                {t('admin_order_actions')}
              </h3>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('admin_order_status_label')}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Order['status'])}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                >
                  <option value="PENDING">{t('admin_orders_filter_pending')}</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">{t('admin_orders_filter_processing')}</option>
                  <option value="SHIPPED">{t('admin_orders_filter_shipped')}</option>
                  <option value="DELIVERED">{t('admin_orders_filter_delivered')}</option>
                  <option value="CANCELLED">{t('admin_orders_filter_cancelled')}</option>
                  <option value="REFUNDED">{t('admin_orders_filter_refunded')}</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('admin_order_payment_label')}
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as Order['paymentStatus'])}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                >
                  <option value="UNPAID">{t('admin_order_unpaid')}</option>
                  <option value="PAID">{t('admin_order_paid')}</option>
                  <option value="REFUNDED">{t('admin_orders_filter_refunded')}</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="w-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold py-3 rounded-lg text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center"
                >
                  {isUpdating ? t('admin_order_updating') : t('admin_order_update_btn')}
                </button>
              </div>
            </div>

            {/* Customer specs card */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                {t('admin_order_client')}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
                    {t('admin_order_name')}
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
                    {t('admin_order_phone')}
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white hover:underline">
                    <a href={`tel:${order.phone}`}>{order.phone}</a>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
                    {t('admin_order_delivery_address')}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400 font-light">
                    {order.address}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
                    {t('admin_order_delivery_schedule')}
                  </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {order.deliveryDate} @ {order.deliveryTime}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
                    {t('admin_order_payment_option')}
                  </span>
                  <span className="font-bold uppercase bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[10px] text-neutral-600 dark:text-neutral-300 w-max">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Modal Overlay (Full Printable layout when active) */}
        {isInvoiceOpen && (
          <div className="fixed inset-0 bg-neutral-950/65 flex items-center justify-center z-50 print:relative print:inset-auto print:bg-white print:p-0">
            {/* Modal click overlay blocker */}
            <div className="fixed inset-0 print:hidden" onClick={() => setIsInvoiceOpen(false)} />

            <div className="bg-white text-neutral-950 w-full max-w-3xl rounded-3xl p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] print:shadow-none print:p-0 print:max-h-full print:rounded-none">
              {/* Modal close & print controls */}
              <div className="absolute top-6 right-6 flex gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white font-semibold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <Icon name="PrinterIcon" size={14} /> {t('admin_invoice_print')}
                </button>
                <button
                  onClick={() => setIsInvoiceOpen(false)}
                  className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <Icon name="XMarkIcon" size={16} />
                </button>
              </div>

              {/* Luxury Invoice Design */}
              <div className="space-y-8 print:p-5">
                {/* Brand Banner */}
                <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-6">
                  <div>
                    <h1 className="font-display text-3xl font-bold tracking-[0.25em] uppercase text-neutral-900">
                      Velluto
                    </h1>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                      Luxury Fashion & Premium Apparel Store
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <h2 className="font-bold text-lg uppercase tracking-wider">{t('admin_invoice_title')}</h2>
                    <p className="text-neutral-500 font-mono mt-0.5">#{order.id}</p>
                    <p className="text-neutral-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Billing details block */}
                <div className="grid grid-cols-2 gap-8 text-xs border-b border-neutral-100 pb-6">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      {t('admin_invoice_billed_to')}
                    </h4>
                    <p className="font-bold text-sm text-neutral-900">{order.customerName}</p>
                    <p className="text-neutral-600 mt-1">Phone: {order.phone}</p>
                    <p className="text-neutral-600 mt-0.5">Address: {order.address}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      {t('admin_invoice_boutique')}
                    </h4>
                    <p className="font-semibold text-neutral-900">Velluto Tbilisi Showroom</p>
                    <p className="text-neutral-500 mt-1">Email: boutique@velluto.com</p>
                    <p className="text-neutral-500 mt-0.5">Vardisubani, Tbilisi, Georgia</p>
                  </div>
                </div>

                {/* Items grid */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-900 text-neutral-400 font-bold uppercase text-[9px] pb-2">
                      <th className="py-2.5">{t('admin_invoice_item_name')}</th>
                      <th>{t('admin_invoice_variant_det')}</th>
                      <th className="text-center">{t('admin_order_qty').replace(': x', '')}</th>
                      <th className="text-right">{t('admin_invoice_unit_price')}</th>
                      <th className="text-right">{t('admin_order_subtotal')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 font-semibold text-neutral-900">{item.productName}</td>
                        <td className="text-neutral-500 font-light italic">
                          {item.variantSelected || '—'}
                        </td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-right">{item.productPrice} GEL</td>
                        <td className="text-right font-semibold">
                          {item.productPrice * item.qty} GEL
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Invoicing summary calculations */}
                <div className="flex justify-end pt-4 border-t border-neutral-900/10 text-xs">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-neutral-500">
                      <span>{t('admin_order_subtotal')}</span>
                      <span>{subtotal} GEL</span>
                    </div>
                    {order.coupon && (
                      <div className="flex justify-between text-neutral-500">
                        <span>{t('admin_invoice_coupon')} ({order.coupon.code})</span>
                        <span className="text-red-500">-{discountAmount} GEL</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-500">
                      <span>{t('admin_order_vat')}</span>
                      <span>{vat} GEL</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-neutral-900 pt-2 font-bold text-sm text-neutral-900">
                      <span>{t('admin_order_grand_total')}</span>
                      <span>{order.total} GEL</span>
                    </div>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="pt-8 border-t border-neutral-100 text-[10px] text-neutral-400 text-center leading-relaxed font-light">
                  <p>Thank you for choosing Velluto. Handcrafted in Tbilisi, Georgia.</p>
                  <p className="mt-0.5">
                    For inquiries or order size consultations, please contact us at
                    boutique@velluto.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
