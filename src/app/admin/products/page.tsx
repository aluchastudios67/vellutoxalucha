'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../components/AdminLayout';
import DataTable from '../components/DataTable';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: string;
  name: string;
  nameKa: string;
  nameRu: string;
  price: number;
  sku: string;
  inventory: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  tag?: string;
  rating: number;
  category: { name: string };
  images: { url: string }[];
}

export default function ProductsCatalog() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDuplicate = async (prodId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${prodId}/duplicate`, {
        method: 'POST',
      });
      if (res.ok) {
        alert(t('admin_product_dupe_success'));
        loadProducts();
      } else {
        alert(t('admin_product_dupe_fail'));
      }
    } catch (e) {
      alert('Error duplicating product.');
    }
  };

  const handleDelete = async (prodId: string) => {
    if (
      !window.confirm(t('admin_product_del_confirm'))
    )
      return;
    try {
      const res = await fetch(`/api/admin/products/${prodId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert(t('admin_product_del_success'));
        loadProducts();
      } else {
        alert(t('admin_product_del_fail'));
      }
    } catch (e) {
      alert('Error deleting product.');
    }
  };

  const columns = [
    {
      header: t('admin_products_image'),
      accessor: (p: Product) => (
        <div className="w-10 h-12 rounded bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative shadow-sm">
          <Image
            src={p.images?.[0]?.url || '/assets/images/no_image.png'}
            alt={p.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      ),
      className: 'w-16',
    },
    {
      header: t('admin_products_name_sku'),
      accessor: (p: Product) => (
        <div>
          <p className="font-semibold text-neutral-900 dark:text-white leading-tight">
            {language === 'GE' && p.nameKa ? p.nameKa : language === 'RU' && p.nameRu ? p.nameRu : p.name}
          </p>
          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{p.sku}</p>
        </div>
      ),
      sortable: true,
      sortKey: 'name',
    },
    {
      header: t('admin_products_category'),
      accessor: (p: Product) => (
        <span className="text-neutral-600 dark:text-neutral-400 font-medium">
          {p.category?.name || '—'}
        </span>
      ),
      sortable: true,
      sortKey: 'categoryId',
    },
    {
      header: t('admin_products_price'),
      accessor: (p: Product) => (
        <span className="font-bold text-neutral-900 dark:text-white">{p.price} GEL</span>
      ),
      sortable: true,
      sortKey: 'price',
    },
    {
      header: t('admin_products_inventory'),
      accessor: (p: Product) => (
        <span
          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
            p.inventory <= 0
              ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
              : p.inventory <= 5
                ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400'
                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
          }`}
        >
          {p.inventory <= 0 ? t('admin_out_of_stock') : `${p.inventory} ${t('admin_units')}`}
        </span>
      ),
      sortable: true,
      sortKey: 'inventory',
    },
    {
      header: t('admin_products_status'),
      accessor: (p: Product) => (
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            p.status === 'ACTIVE'
              ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
              : p.status === 'DRAFT'
                ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
          }`}
        >
          {p.status}
        </span>
      ),
      sortable: true,
      sortKey: 'status',
    },
    {
      header: t('admin_products_actions'),
      accessor: (p: Product) => {
        const canWrite = true;
        return (
          <div className="flex gap-3 items-center justify-end">
            {canWrite && (
              <button
                onClick={() => handleDuplicate(p.id)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                title="Duplicate Product"
              >
                <Icon name="DocumentDuplicateIcon" size={14} />
              </button>
            )}
            <Link
              href={`/admin/products/${p.id}`}
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              title="Edit Product"
            >
              <Icon name="PencilSquareIcon" size={14} />
            </Link>
            {canWrite && (
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-400 hover:text-red-600"
                title="Delete Product"
              >
                <Icon name="TrashIcon" size={14} />
              </button>
            )}
          </div>
        );
      },
      className: 'text-right w-28',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
            {t('admin_products_loading')}
          </p>
        </div>
      </AdminLayout>
    );
  }

  const canWrite = true;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              {t('admin_products_title')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              {t('admin_products_subtitle')}
            </p>
          </div>
          {canWrite && (
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
            >
              <Icon name="PlusIcon" size={14} />
              {t('admin_products_add')}
            </Link>
          )}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={products}
          searchPlaceholder={t('admin_products_search')}
          searchKey="name"
          emptyMessage={t('admin_products_empty')}
        />
      </div>
    </AdminLayout>
  );
}
