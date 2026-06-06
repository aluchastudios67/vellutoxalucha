'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
}

export default function CollectionsSection() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const revealRef = useScrollAnimation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);
        if (catRes.ok) setCategories(await catRes.json());
        if (prodRes.ok) setProducts(await prodRes.json());
      } catch (e) {
        console.error('Failed to load storefront data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category?.slug === activeCategory);

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

  const getImg = (item: Product) =>
    item.images?.[0]?.url || '/assets/images/no_image.png';

  const getCatName = (cat: Category) => {
    if (language === 'GE') return cat.nameKa;
    if (language === 'RU') return cat.nameRu;
    return cat.name;
  };

  return (
    <section id="collections" className="py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-neutral-400">
            {language === 'GE' ? 'კოლექციები' : language === 'RU' ? 'Коллекции' : 'Curated Collections'}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900">
            {language === 'GE' ? 'სეზონის კოლექცია' : language === 'RU' ? 'Коллекция сезона' : 'The Collection'}
          </h2>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-xl mx-auto">
            {language === 'GE'
              ? 'სეზონის საუკეთესო ნაჭრები — ყოველი ადამიანისთვის, ყოველ განწყობაზე.'
              : language === 'RU'
              ? 'Лучшие образы сезона — для каждого момента и настроения.'
              : 'Carefully selected statement pieces from our latest season, photographed as worn.'}
          </p>
        </div>

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
          {categories.map(cat => (
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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4 animate-pulse">
                <div className="aspect-[3/4] rounded-2xl bg-neutral-200" />
                <div className="h-3 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-neutral-400 text-sm">
            {language === 'GE' ? 'პროდუქტები არ მოიძებნა' : language === 'RU' ? 'Товары не найдены' : 'No products found in this category yet.'}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && filtered.length > 0 && (
          <div
            ref={revealRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filtered.map(item => (
              <article
                key={item.id}
                className="group flex flex-col"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image Card */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm">
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
                      <button
                        onClick={() => addToCart({
                          id: item.id,
                          name: item.name,
                          nameKa: item.nameKa,
                          nameRu: item.nameRu,
                          price: item.price,
                          img: getImg(item),
                        })}
                        className="mt-3 w-full py-2.5 bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-100 transition-colors"
                      >
                        {language === 'GE' ? 'კალათაში' : language === 'RU' ? 'В корзину' : 'Add to Cart'}
                      </button>
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
                </div>

                {/* Info */}
                <div className="pt-4 space-y-1 px-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-neutral-900 text-sm leading-snug">
                      {getName(item)}
                    </h3>
                    <span className="text-sm font-bold text-neutral-900 whitespace-nowrap">
                      {item.price} {language === 'GE' ? 'ლ' : language === 'RU' ? '₾' : 'GEL'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-snug line-clamp-1">
                    {getDesc(item)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
