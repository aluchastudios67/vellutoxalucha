'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';

const FASHION_COLORS: { name: string; hex: string }[] = [
  { name: 'Midnight Onyx', hex: '#111111' },
  { name: 'Tuscan Cocoa', hex: '#5D4037' },
  { name: 'Alabaster Milk', hex: '#F5EFE6' },
  { name: 'Rose Quartz', hex: '#F3B0C3' },
  { name: 'Ethereal Azure', hex: '#A8D3E6' },
  { name: 'Ivory Silk', hex: '#FFFDF9' },
  { name: 'Sage Garden', hex: '#9CA998' },
  { name: 'Dusty Rose', hex: '#CCA7A2' },
  { name: 'Classic Navy', hex: '#1B365D' },
  { name: 'Midnight Noir', hex: '#111111' },
  { name: 'Alabaster White', hex: '#F8F6F2' },
  { name: 'Powder Rose', hex: '#FFD1DC' },
  { name: 'Soft Horizon', hex: '#89CFF0' },
  { name: 'Baby Pink', hex: '#F4C2C2' },
  { name: 'Baby Blue', hex: '#89CFF0' },
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Brown', hex: '#5D4037' },
];

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
  id?: string;
  sku: string;
  size: string;
  color: string;
  metal: string;
  stock: number;
  priceAdjustment: number;
}

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        const [catRes, medRes, prodRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/media'),
          fetch(`/api/admin/products/${id}`)
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (medRes.ok) {
          const medData = await medRes.json();
          setMediaItems(medData);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setFormData({
            id: prodData.id,
            name: prodData.name,
            nameKa: prodData.nameKa,
            nameRu: prodData.nameRu,
            price: prodData.price,
            sku: prodData.sku,
            inventory: prodData.inventory,
            status: prodData.status,
            tag: prodData.tag || '',
            rating: prodData.rating,
            categoryId: prodData.categoryId,
            description: prodData.description || '',
            descriptionKa: prodData.descriptionKa || '',
            descriptionRu: prodData.descriptionRu || '',
            seoTitle: prodData.seoTitle || '',
            seoDescription: prodData.seoDescription || '',
          });
          setSelectedImages(prodData.images?.map((img: any) => img.url) || []);
          setVariants(prodData.variants || []);
        } else {
          alert('Product details could not be found.');
          router.push('/admin/products');
        }
      } catch (e) {
        console.error('Failed to load edit options');
      } finally {
        setIsLoading(false);
      }
    };

    loadFormOptions();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddVariant = () => {
    const code = formData.sku
      ? `${formData.sku}-VAR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : `VAR-${Date.now().toString().slice(-6)}`;
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

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: selectedImages.length > 0 ? selectedImages : ['/assets/images/no_image.png'],
          variants,
        }),
      });

      if (res.ok) {
        alert('Product updated successfully.');
        router.push('/admin/products');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update product details.');
      }
    } catch (e) {
      alert('Network communication error occurred.');
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
            Loading Product details...
          </p>
        </div>
      </AdminLayout>
    );
  }

  const isStaff = false;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Header Title & Actions */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              Edit Product
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              {isStaff
                ? 'Limited management mode (Update inventory only)'
                : `Modify metadata and taxonomy for SKU: ${formData.sku}`}
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
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
                    disabled={isStaff}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
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
                    disabled={isStaff}
                    value={formData.nameKa}
                    onChange={handleChange}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
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
                    disabled={isStaff}
                    value={formData.nameRu}
                    onChange={handleChange}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
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
                    disabled={isStaff}
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white resize-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Description (KA)
                  </label>
                  <textarea
                    name="descriptionKa"
                    disabled={isStaff}
                    value={formData.descriptionKa}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white resize-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Description (RU)
                  </label>
                  <textarea
                    name="descriptionRu"
                    disabled={isStaff}
                    value={formData.descriptionRu}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white resize-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
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
                    disabled={isStaff}
                    name="price"
                    value={formData.price || ''}
                    onChange={handleChange}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isStaff}
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
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
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-900 dark:text-white"
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
                {!isStaff && (
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Icon name="PlusIcon" size={12} /> Add Variant
                  </button>
                )}
              </div>

              {variants.length === 0 ? (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 italic py-4">
                  No variants defined. Add size or color choices if applicable.
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
                            disabled={isStaff}
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                            className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                            Size
                          </label>
                          <select
                            disabled={isStaff}
                            value={variant.size}
                            onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                            className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                          >
                            <option value="">— Size —</option>
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                            Color
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              list={`color-options-${idx}`}
                              disabled={isStaff}
                              value={variant.color || variant.metal || ''}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[idx] = { ...newVariants[idx], color: e.target.value, metal: e.target.value };
                                setVariants(newVariants);
                              }}
                              className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-7 pr-2.5 py-1.5 rounded focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                              placeholder="Color (e.g. Red, #ff0000)"
                            />
                            <datalist id={`color-options-${idx}`}>
                              {FASHION_COLORS.map((c) => (
                                <option key={c.name} value={c.name} />
                              ))}
                            </datalist>
                            {/* Color swatch preview */}
                            <span
                              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-neutral-300 pointer-events-none"
                              style={{ backgroundColor: FASHION_COLORS.find(c => c.name === (variant.color || variant.metal))?.hex || (variant.color || variant.metal) || '#e5e5e5' }}
                            />
                          </div>
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
                            disabled={isStaff}
                            value={variant.priceAdjustment}
                            placeholder="e.g. 50"
                            onChange={(e) =>
                              handleVariantChange(idx, 'priceAdjustment', Number(e.target.value))
                            }
                            className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                          />
                        </div>
                      </div>
                      {!isStaff && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-red-500 hover:text-red-700 p-2 border border-red-200 dark:border-red-900 bg-white dark:bg-neutral-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors inline-flex justify-center"
                        >
                          <Icon name="TrashIcon" size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Images selection gallery */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Image Gallery
                </h3>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Select one or more catalog assets stored in your media vault
                </p>
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
                        disabled={isStaff}
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
                  Product ID
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.id}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-3 py-2.5 rounded-lg focus:outline-none text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Store Category *
                </label>
                <select
                  name="categoryId"
                  required
                  disabled={isStaff}
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
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
                  disabled={isStaff}
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
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
                  disabled={isStaff}
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="e.g. New, Limited, Popular"
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Initial Star Rating
                </label>
                <select
                  name="rating"
                  disabled={isStaff}
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
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
                  disabled={isStaff}
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="Custom Google title tag..."
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  SEO Meta Description
                </label>
                <textarea
                  name="seoDescription"
                  disabled={isStaff}
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Google description snippet..."
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none resize-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
