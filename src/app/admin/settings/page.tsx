'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';

export default function StoreSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error('Failed to load store settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (section: string | null, key: string, value: any) => {
    if (section) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [key]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [key]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('Global store configurations saved successfully.');
        loadSettings();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update store settings.');
      }
    } catch (e) {
      alert('Error connecting to settings API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuperAdmin = true;

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <Icon name="ExclamationTriangleIcon" size={32} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-bold">Access Denied</h3>
          <p className="text-xs text-neutral-400 mt-1">Only Super Administrators have access to modify global store settings.</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading || !settings) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">Loading Configuration Profiles...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">Store Settings</h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">Configure taxes, local delivery costs, boutique details, and banking information</p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Configurations Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* General Details & Banking info */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* General Boutique info */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">Boutique Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Store Display Name</label>
                  <input type="text" value={settings.storeName} onChange={(e) => handleChange(null, 'storeName', e.target.value)} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Contact Email Address</label>
                  <input type="email" value={settings.contactEmail} onChange={(e) => handleChange(null, 'contactEmail', e.target.value)} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Showroom Contact Phone</label>
                  <input type="text" value={settings.contactPhone} onChange={(e) => handleChange(null, 'contactPhone', e.target.value)} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Showroom Address</label>
                  <input type="text" value={settings.address} onChange={(e) => handleChange(null, 'address', e.target.value)} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Payment Integration details */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">Payment Integrations</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={settings.payments.cashOnDelivery} onChange={(e) => handleChange('payments', 'cashOnDelivery', e.target.checked)} className="rounded" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={settings.payments.cardOnDelivery} onChange={(e) => handleChange('payments', 'cardOnDelivery', e.target.checked)} className="rounded" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">Card on Delivery</span>
                </label>
                <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={settings.payments.bankTransfer} onChange={(e) => handleChange('payments', 'bankTransfer', e.target.checked)} className="rounded" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">Bank Transfer</span>
                </label>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Showroom Bank Accounts (Details printed on Invoices)</label>
                <textarea
                  value={settings.payments.bankDetails}
                  onChange={(e) => handleChange('payments', 'bankDetails', e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none resize-none font-mono"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">Social Network Coordinates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Instagram Page Link</label>
                  <input type="text" value={settings.socialLinks.instagram} onChange={(e) => handleChange('socialLinks', 'instagram', e.target.value)} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Facebook Page Link</label>
                  <input type="text" value={settings.socialLinks.facebook} onChange={(e) => handleChange('socialLinks', 'facebook', e.target.value)} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Pinterest Coordinates</label>
                  <input type="text" value={settings.socialLinks.pinterest} onChange={(e) => handleChange('socialLinks', 'pinterest', e.target.value)} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none font-mono" />
                </div>
              </div>
            </div>

          </div>

          {/* Right: Shipping & Taxes rates */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery Cost variables */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">Shipping Logistics</h3>
              
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Tbilisi Local Delivery Fee (GEL)</label>
                <input type="number" min="0" value={settings.shipping.tbilisiRate} onChange={(e) => handleChange('shipping', 'tbilisiRate', Number(e.target.value))} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Regional/Out-of-Town Delivery Fee (GEL)</label>
                <input type="number" min="0" value={settings.shipping.regionalRate} onChange={(e) => handleChange('shipping', 'regionalRate', Number(e.target.value))} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none" />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Min Order value for Free Delivery (GEL)</label>
                <input type="number" min="0" value={settings.shipping.minFreeShipping} onChange={(e) => handleChange('shipping', 'minFreeShipping', Number(e.target.value))} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none" />
              </div>
            </div>

            {/* Taxes & VAT configs */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">Tax Settings</h3>
              
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">VAT Tax Rate (%)</label>
                <input type="number" min="0" max="100" value={settings.tax.vatRate} onChange={(e) => handleChange('tax', 'vatRate', Number(e.target.value))} className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none" />
              </div>

              <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl cursor-pointer">
                <input type="checkbox" checked={settings.tax.isTaxIncluded} onChange={(e) => handleChange('tax', 'isTaxIncluded', e.target.checked)} className="rounded" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">Taxes are included in displayed pricing</span>
              </label>
            </div>

          </div>

        </div>

      </form>
    </AdminLayout>
  );
}
