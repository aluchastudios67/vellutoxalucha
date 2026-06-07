'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface Category {
  id: string;
  name: string;
  nameKa: string;
  nameRu: string;
  slug: string;
}

interface ProductImage {
  url: string;
  isFeatured: boolean;
}

interface ProductVariant {
  size: string | null;
  color: string | null;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  nameKa: string;
  nameRu: string;
  price: number;
  tag?: string;
  description: string;
  descriptionKa: string;
  descriptionRu: string;
  category: Category;
  images: ProductImage[];
  variants?: ProductVariant[];
}

interface CollectionsClientProps {
  products: Product[];
  categories: Category[];
}

export default function CollectionsClient({ products, categories }: CollectionsClientProps) {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category?.slug === activeCategory);

  const getName = (item: Product) => {
    if (language === 'GE') return item.nameKa;
    if (language === 'RU') return item.nameRu;
    return item.name;
  };

  const getDesc = (item: Product) => {
    if (language === 'GE') return item.descriptionKa;
    if (language === 'RU') return item.descriptionRu;
    return item.description;
  };

  const getImg = (item: Product) => {
    const featured = item.images?.find((img) => img.isFeatured);
    return featured?.url || item.images?.[0]?.url || '/assets/images/no_image.png';
  };

  const getCatName = (cat: Category) => {
    if (language === 'GE') return cat.nameKa;
    if (language === 'RU') return cat.nameRu;
    return cat.name;
  };

  return (
    <>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
            activeCategory === 'All'
              ? 'bg-neutral-950 text-white border-neutral-950'
              : 'bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
          }`}
        >
          {language === 'GE' ? 'ყველა' : language === 'RU' ? 'Все' : 'All'}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
              activeCategory === cat.slug
                ? 'bg-neutral-950 text-white border-neutral-950'
                : 'bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
            }`}
          >
            {getCatName(cat)}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-neutral-400 text-sm">
          {language === 'GE'
            ? 'პროდუქტები არ მოიძებნა'
            : language === 'RU'
            ? 'Товары не найдены'
            : 'No products found in this category yet.'}
        </div>
      )}

      {/* Product Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Card */}
              <Link
                href={`/products/${item.id}`}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm cursor-pointer block"
              >
                <Image
                  src={getImg(item)}
                  alt={getName(item)}
                  fill
                  quality={85}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/30 transition-all duration-500 flex items-end">
                  <div
                    className={`w-full p-4 transition-all duration-500 ${
                      hoveredId === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <p className="text-white text-xs font-light leading-relaxed line-clamp-2">
                      {getDesc(item)}
                    </p>
                    <span className="mt-3 w-full py-2.5 bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-100 transition-colors text-center block">
                      {language === 'GE' ? 'დეტალები' : language === 'RU' ? 'Подробнее' : 'View Details'}
                    </span>
                  </div>
                </div>

                {/* Tag badge */}
                {item.tag && (
                  <span className="absolute top-3 left-3 bg-neutral-950 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}

                {/* Category pill */}
                {item.category && (
                  <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-neutral-700 text-[9px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                    {getCatName(item.category)}
                  </span>
                )}
              </Link>

              {/* Info */}
              <Link
                href={`/products/${item.id}`}
                className="pt-4 space-y-1 px-1 cursor-pointer block"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-neutral-900 text-sm leading-snug group-hover:underline">
                    {getName(item)}
                  </h3>
                  <span className="text-sm font-bold text-neutral-900 whitespace-nowrap">
                    {item.price} {language === 'GE' ? 'ლ' : language === 'RU' ? '₾' : 'GEL'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-snug line-clamp-1">
                  {getDesc(item)}
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
