'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';

interface Category {
  id: string;
  name: string;
}

interface MediaItem {
  id: string;
  name: string;
  url: string;
}

interface VariantInput {
  sku: string;
  size: string;
  color: string;
  metal: string;
  stock: number;
  priceAdjustment: number;
}

export default function NewProduct() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nameKa: '',
    nameRu: '',
    price: 0,
    sku: '',
    inventory: 0,
    status: 'ACTIVE',
    tag: '',
    rating: 5,
    categoryId: '',
    description: '',
    descriptionKa: '',
    descriptionRu: '',
    seoTitle: '',
    seoDescription: '',
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantInput[]>([]);

  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        const catRes = await fetch('/api/admin/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
          if (catData.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: catData[0].id }));
          }
        }

        const medRes = await fetch('/api/admin/media');
        if (medRes.ok) {
          const medData = await medRes.json();
          setMediaItems(medData);
        }
      } catch (e) {
        console.error('Failed to load form config options');
      }
    };

    loadFormOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddVariant = () => {
    const code = formData.sku
      ? `${formData.sku}-VAR-${variants.length + 1}`
      : `VAR-${Date.now().toString().slice(-4)}`;
    setVariants([
      ...variants,
      { sku: code, size: '', color: '', metal: '', stock: 0, priceAdjustment: 0 },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, key: keyof VariantInput, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [key]: value };
    setVariants(updated);
  };

  const toggleImageSelection = (url: string) => {
    if (selectedImages.includes(url)) {
      setSelectedImages(selectedImages.filter((i) => i !== url));
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const newMedia = await res.json();
        setMediaItems((prev) => [newMedia, ...prev]);
        setSelectedImages((prev) => [...prev, newMedia.url]);
      } else {
        alert('Failed to upload image.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      !formData.name ||
      !formData.nameKa ||
      !formData.nameRu ||
      !formData.sku ||
      formData.price <= 0
    ) {
      alert('Please fill out all required parameters correctly.');
      return;
    }

    setIsSubmitting(true);
    const prodId =
      formData.id.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: prodId,
          images: selectedImages.length > 0 ? selectedImages : ['/assets/images/no_image.png'],
          variants,
        }),
      });

      if (res.ok) {
        alert('Product created successfully.');
        router.push('/admin/products');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product.');
      }
    } catch (e) {
      alert('Network communication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canWrite = true;

  if (!canWrite) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <Icon name="ExclamationTriangleIcon" size={32} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-bold">Unauthorized Action</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Staff roles cannot create catalog entries.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Header Title & Actions */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              Add New Product
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              Define pricing, description, variants, and SEO meta
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/products"
              className="border border-neutral-300 dark:border-neutral-800 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-950 dark:hover:border-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: General Product Meta Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title / Description Translations */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Product Translations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Product Name (EN) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Aura Ring"
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Product Name (KA) *
                  </label>
                  <input
                    type="text"
                    name="nameKa"
                    required
                    value={formData.nameKa}
                    onChange={handleChange}
                    placeholder="მაგ. ბეჭედი აურა"
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Product Name (RU) *
                  </label>
                  <input
                    type="text"
                    name="nameRu"
                    required
                    value={formData.nameRu}
                    onChange={handleChange}
                    placeholder="например, Кольцо Аура"
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Description (EN)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Handcrafted premium linen/cotton garments details..."
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Description (KA)
                  </label>
                  <textarea
                    name="descriptionKa"
                    value={formData.descriptionKa}
                    onChange={handleChange}
                    rows={3}
                    placeholder="დახვეწილი დიზაინის დეტალები..."
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Description (RU)
                  </label>
                  <textarea
                    name="descriptionRu"
                    value={formData.descriptionRu}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Описание деталей ювелирного изделия..."
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Inventory & Pricing */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Pricing & Logistics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Base Price (GEL) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleChange}
                    placeholder="Price in GEL"
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g. VEL-RING-AURA-01"
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Inventory Stock level
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="inventory"
                    value={formData.inventory}
                    onChange={handleChange}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Product Variants Creator */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Product Variants
                </h3>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Icon name="PlusIcon" size={12} /> Add Variant
                </button>
              </div>

              {variants.length === 0 ? (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 italic py-4">
                  No variants defined. Add size or metal choices if applicable.
                </p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-150 dark:border-neutral-800 flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                            Variant SKU
                          </label>
                          <input
                            type="text"
                            required
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                            className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                            Size
                          </label>
                          <input
                            type="text"
                            value={variant.size}
                            placeholder="e.g. 17"
                            onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                            className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                            Color
                          </label>
                          <input
                            type="text"
                            value={variant.metal}
                            placeholder="e.g. Midnight Onyx"
                            onChange={(e) => {
                              handleVariantChange(idx, 'metal', e.target.value);
                              handleVariantChange(idx, 'color', e.target.value);
                            }}
                            className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(idx, 'stock', Number(e.target.value))
                            }
                            className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                            Price Adj (+/-)
                          </label>
                          <input
                            type="number"
                            value={variant.priceAdjustment}
                            placeholder="e.g. 50"
                            onChange={(e) =>
                              handleVariantChange(idx, 'priceAdjustment', Number(e.target.value))
                            }
                            className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-red-500 hover:text-red-700 p-2 border border-red-200 dark:border-red-900 bg-white dark:bg-neutral-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors inline-flex justify-center"
                      >
                        <Icon name="TrashIcon" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Images selection gallery */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    Image Gallery
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Select one or more catalog assets stored in your media vault
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Icon name="ArrowUpTrayIcon" size={12} />{' '}
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                </div>
              </div>

              {mediaItems.length === 0 ? (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 italic py-4">
                  No images uploaded in Media Library yet.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {mediaItems.map((media) => {
                    const isSelected = selectedImages.includes(media.url);
                    return (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => toggleImageSelection(media.url)}
                        className={`aspect-[3/4] rounded-lg overflow-hidden border-2 relative select-none transition-all ${
                          isSelected
                            ? 'border-neutral-900 dark:border-white shadow scale-[1.03]'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-full flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Category, status, tags, rating and SEO details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status & Categorization */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Status & Taxonomy
              </h3>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Product ID (optional)
                </label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="e.g. aurelia-yellow-dress"
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Store Category *
                </label>
                <select
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                >
                  <option value="" disabled>
                    Select a Category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Visibility Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                >
                  <option value="ACTIVE">Active (Storefront Visible)</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Promotional Tag
                </label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="e.g. New, Limited, Popular"
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Initial Star Rating
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                SEO Configurations
              </h3>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="Custom Google title tag..."
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  SEO Meta Description
                </label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Google description snippet..."
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
