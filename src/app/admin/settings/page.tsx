'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';

export default function StoreSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingBanners, setPendingBanners] = useState<{ file: File; previewUrl: string }[]>([]);

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
          [key]: value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [key]: value,
      });
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);
    
    const newPending = selectedFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    
    setPendingBanners(prev => [...prev, ...newPending]);
    e.target.value = '';
  };

  const removeHeroImage = (index: number) => {
    const newImages = [...(settings.heroImages || [])];
    newImages.splice(index, 1);
    setSettings({
      ...settings,
      heroImages: newImages,
    });
  };

  const removePendingHeroImage = (index: number) => {
    setPendingBanners(prev => {
      const item = prev[index];
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Upload pending hero images first
      const newUrls: string[] = [];
      if (pendingBanners.length > 0) {
        for (const item of pendingBanners) {
          const formData = new FormData();
          formData.append('file', item.file);
          
          const res = await fetch('/api/admin/media', {
            method: 'POST',
            body: formData,
          });
          
          if (!res.ok) {
            const uploadErr = await res.json();
            throw new Error(uploadErr.error || `Failed to upload image: ${item.file.name}`);
          }
          
          const data = await res.json();
          newUrls.push(data.url);
        }
      }
      
      // 2. Merge existing and newly uploaded images
      const finalHeroImages = [...(settings.heroImages || []), ...newUrls];
      const updatedSettings = {
        ...settings,
        heroImages: finalHeroImages,
      };
      
      // 3. Post final merged settings to save to the database
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (res.ok) {
        alert('Global store configurations saved successfully.');
        // Clean up preview URLs
        pendingBanners.forEach(item => URL.revokeObjectURL(item.previewUrl));
        setPendingBanners([]);
        loadSettings();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update store settings.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving settings.');
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
          <p className="text-xs text-neutral-400 mt-1">
            Only Super Administrators have access to modify global store settings.
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading || !settings) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
            Loading Configuration Profiles...
          </p>
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
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              Store Settings
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              Configure taxes, local delivery costs, boutique details, and banking information
            </p>
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
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">
                Boutique Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Store Display Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => handleChange(null, 'storeName', e.target.value)}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange(null, 'contactEmail', e.target.value)}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Showroom Contact Phone
                  </label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => handleChange(null, 'contactPhone', e.target.value)}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Showroom Address
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange(null, 'address', e.target.value)}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Integration details */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">
                Payment Integrations
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.payments.cashOnDelivery}
                    onChange={(e) => handleChange('payments', 'cashOnDelivery', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Cash on Delivery
                  </span>
                </label>
                <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.payments.cardOnDelivery}
                    onChange={(e) => handleChange('payments', 'cardOnDelivery', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Card on Delivery
                  </span>
                </label>
                <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.payments.bankTransfer}
                    onChange={(e) => handleChange('payments', 'bankTransfer', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Bank Transfer
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Showroom Bank Accounts (Details printed on Invoices)
                </label>
                <textarea
                  value={settings.payments.bankDetails}
                  onChange={(e) => handleChange('payments', 'bankDetails', e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none resize-none font-mono"
                />
              </div>
            </div>

            {/* Hero Banner Images */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">
                Hero Banner Images
              </h3>
              <p className="text-[10px] text-neutral-500 font-medium">
                Upload images to display in the main landing page hero carousel.
              </p>

              <div className="flex flex-wrap gap-4">
                {(settings.heroImages || []).map((url: string, idx: number) => (
                  <div
                    key={`existing-${idx}`}
                    className="relative w-24 h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
                  >
                    <img src={url} alt={`Hero ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeHeroImage(idx)}
                      className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center shadow hover:bg-neutral-100"
                    >
                      <Icon name="XMarkIcon" size={12} />
                    </button>
                  </div>
                ))}

                {pendingBanners.map((item, idx) => (
                  <div
                    key={`pending-${idx}`}
                    className="relative w-24 h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-blue-500 border-2 border-dashed"
                  >
                    <img src={item.previewUrl} alt={`Pending Hero ${idx}`} className="w-full h-full object-cover opacity-70" />
                    <span className="absolute bottom-1 left-1 bg-blue-500 text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Draft
                    </span>
                    <button
                      type="button"
                      onClick={() => removePendingHeroImage(idx)}
                      className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center shadow hover:bg-neutral-100"
                    >
                      <Icon name="XMarkIcon" size={12} />
                    </button>
                  </div>
                ))}

                <label className="w-24 h-32 flex flex-col items-center justify-center gap-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Icon name="PlusIcon" size={16} className="text-neutral-400" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                        Add
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    multiple
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">
                Social Network Coordinates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Instagram Page Link
                  </label>
                  <input
                    type="text"
                    value={settings.socialLinks.instagram}
                    onChange={(e) => handleChange('socialLinks', 'instagram', e.target.value)}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Facebook Page Link
                  </label>
                  <input
                    type="text"
                    value={settings.socialLinks.facebook}
                    onChange={(e) => handleChange('socialLinks', 'facebook', e.target.value)}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Pinterest Coordinates
                  </label>
                  <input
                    type="text"
                    value={settings.socialLinks.pinterest}
                    onChange={(e) => handleChange('socialLinks', 'pinterest', e.target.value)}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Shipping & Taxes rates */}
          <div className="lg:col-span-4 space-y-6">
            {/* Delivery Cost variables */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Shipping Logistics
              </h3>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Tbilisi Local Delivery Fee (GEL)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.shipping.tbilisiRate}
                  onChange={(e) => handleChange('shipping', 'tbilisiRate', Number(e.target.value))}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Regional/Out-of-Town Delivery Fee (GEL)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.shipping.regionalRate}
                  onChange={(e) => handleChange('shipping', 'regionalRate', Number(e.target.value))}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Min Order value for Free Delivery (GEL)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.shipping.minFreeShipping}
                  onChange={(e) =>
                    handleChange('shipping', 'minFreeShipping', Number(e.target.value))
                  }
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Taxes & VAT configs */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Tax Settings
              </h3>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  VAT Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.tax.vatRate}
                  onChange={(e) => handleChange('tax', 'vatRate', Number(e.target.value))}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tax.isTaxIncluded}
                  onChange={(e) => handleChange('tax', 'isTaxIncluded', e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  Taxes are included in displayed pricing
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
