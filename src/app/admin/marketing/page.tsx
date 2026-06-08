'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  expiresAt?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}

export default function MarketingCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Coupon form state
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    expiresAt: '',
    usageLimit: '',
  });

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (e) {
      console.error('Failed to load coupon list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      if (res.ok) {
        loadCoupons();
      } else {
        alert('Failed to change coupon active status.');
      }
    } catch (e) {
      alert('Error updating coupon.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || formData.discountValue <= 0) {
      alert('Please fill out all required parameters correctly.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Discount coupon created successfully.');
        setFormData({
          code: '',
          discountType: 'PERCENTAGE',
          discountValue: 0,
          expiresAt: '',
          usageLimit: '',
        });
        loadCoupons();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create discount coupon.');
      }
    } catch (e) {
      alert('Network error creating coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
            Loading Marketing Center...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              Marketing & Discounts
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              Create promotional coupons, define flash discounts, and review usage
            </p>
          </div>
        </div>

        {/* 2-Column Creator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Create Coupon form */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                Create Coupon
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase font-semibold mt-1">
                Define promotional offer parameters
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. SUMMER10"
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat (GEL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    required
                    min="1"
                    value={formData.discountValue || ''}
                    onChange={handleChange}
                    placeholder="e.g. 10 or 100"
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Usage Limit (optional)
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder="e.g. 100 times"
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold py-3 rounded-lg text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isSubmitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Active coupons list */}
          <div className="lg:col-span-8 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                Active Coupons
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase font-semibold mt-1">
                Review active promotional codes and usage status
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-neutral-400 dark:text-neutral-500 font-bold uppercase text-[9px] border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <th className="py-2.5">Code</th>
                    <th>Discount</th>
                    <th>Usage status</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-400 italic">
                        No coupons registered.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-4 font-bold text-neutral-900 dark:text-white font-mono">
                          {c.code}
                        </td>
                        <td className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {c.discountValue} {c.discountType === 'PERCENTAGE' ? '%' : 'GEL'} OFF
                        </td>
                        <td>
                          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : 'uses'}
                          </p>
                        </td>
                        <td className="text-neutral-500 dark:text-neutral-400">
                          {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}
                        </td>
                        <td>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              c.isActive
                                ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                                : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                            }`}
                          >
                            {c.isActive ? 'Active' : 'Expired/Inactive'}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => handleToggleActive(c.id, c.isActive)}
                            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                              c.isActive
                                ? 'border-red-200 hover:border-red-600 text-red-500 hover:text-red-700 hover:bg-red-50/30'
                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-white text-neutral-600 dark:text-neutral-300'
                            }`}
                          >
                            {c.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
