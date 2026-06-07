'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

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
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

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
    // Find featured image, or default to first image, or fallback
    const featured = item.images?.find((img) => img.isFeatured);
    return featured?.url || item.images?.[0]?.url || '/assets/images/no_image.png';
  };

  const getCatName = (cat: Category) => {
    if (language === 'GE') return cat.nameKa;
    if (language === 'RU') return cat.nameRu;
    return cat.name;
  };

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setSelectedColor('');
    setSelectedImageIndex(0);
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
              <div
                onClick={() => openQuickView(item)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm cursor-pointer"
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickView(item);
                      }}
                      className="mt-3 w-full py-2.5 bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      {language === 'GE' ? 'აირჩიე ზომა' : language === 'RU' ? 'Выбрать опции' : 'Quick View'}
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
              <div
                onClick={() => openQuickView(item)}
                className="pt-4 space-y-1 px-1 cursor-pointer"
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
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          {/* Modal Close Overlay */}
          <div
            onClick={() => setSelectedProduct(null)}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] z-10 transition-all transform duration-300">
            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-30 p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Column: Image Gallery */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-r border-neutral-100 bg-neutral-50/50">
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-xs flex-1 min-h-[250px] md:min-h-0">
                <Image
                  src={selectedProduct.images?.[selectedImageIndex]?.url || getImg(selectedProduct)}
                  alt={getName(selectedProduct)}
                  fill
                  quality={85}
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-thin">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                        selectedImageIndex === idx ? 'border-neutral-900' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt="thumbnail"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Selectors */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
              <div className="space-y-6">
                {/* Category & Tag */}
                <div className="flex items-center gap-2">
                  {selectedProduct.category && (
                    <span className="text-[9px] font-bold tracking-widest uppercase bg-neutral-100 px-2.5 py-1 rounded-full text-neutral-600">
                      {getCatName(selectedProduct.category)}
                    </span>
                  )}
                  {selectedProduct.tag && (
                    <span className="text-[9px] font-bold tracking-widest uppercase bg-neutral-950 text-white px-2.5 py-1 rounded-full">
                      {selectedProduct.tag}
                    </span>
                  )}
                </div>

                {/* Title & Price */}
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
                    {getName(selectedProduct)}
                  </h3>
                  <div className="mt-2 text-xl font-bold text-neutral-900">
                    {selectedProduct.price} {language === 'GE' ? 'ლ' : language === 'RU' ? '₾' : 'GEL'}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    {language === 'GE' ? 'აღწერა' : language === 'RU' ? 'Описание' : 'Description'}
                  </h4>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed">
                    {getDesc(selectedProduct)}
                  </p>
                </div>

                {/* Size Selector */}
                {(() => {
                  const sizes = Array.from(
                    new Set(
                      selectedProduct.variants
                        ?.map((v) => v.size)
                        .filter((s): s is string => !!s) || []
                    )
                  );
                  if (sizes.length === 0) return null;
                  return (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                        {language === 'GE' ? 'აირჩიეთ ზომა' : language === 'RU' ? 'Выберите размер' : 'Select Size'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                              selectedSize === size
                                ? 'bg-neutral-950 text-white border-neutral-950'
                                : 'bg-transparent text-neutral-700 border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Color Selector */}
                {(() => {
                  const colors = Array.from(
                    new Set(
                      selectedProduct.variants
                        ?.map((v) => v.color)
                        .filter((c): c is string => !!c) || []
                    )
                  );
                  if (colors.length === 0) return null;
                  return (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                        {language === 'GE' ? 'აირჩიეთ ფერი' : language === 'RU' ? 'Выберите цвет' : 'Select Color'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                              selectedColor === color
                                ? 'bg-neutral-950 text-white border-neutral-950'
                                : 'bg-transparent text-neutral-700 border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Add to Cart Actions */}
              <div className="mt-8 border-t border-neutral-100 pt-6">
                <button
                  onClick={() => {
                    const sizes = Array.from(
                      new Set(
                        selectedProduct.variants?.map((v) => v.size).filter((s): s is string => !!s) || []
                      )
                    );
                    const colors = Array.from(
                      new Set(
                        selectedProduct.variants?.map((v) => v.color).filter((c): c is string => !!c) || []
                      )
                    );

                    if (sizes.length > 0 && !selectedSize) {
                      alert(
                        language === 'GE'
                          ? 'გთხოვთ აირჩიოთ ზომა'
                          : language === 'RU'
                          ? 'Пожалуйста, выберите размер'
                          : 'Please select a size'
                      );
                      return;
                    }
                    if (colors.length > 0 && !selectedColor) {
                      alert(
                        language === 'GE'
                          ? 'გთხოვთ აირჩიოთ ფერი'
                          : language === 'RU'
                          ? 'Пожалуйста, выберите цвет'
                          : 'Please select a color'
                      );
                      return;
                    }

                    // Create unique ID combining ID, size, and color
                    const cartItemId = `${selectedProduct.id}_${selectedSize || 'default'}_${selectedColor || 'default'}`;

                    addToCart({
                      id: cartItemId,
                      name: selectedProduct.name,
                      nameKa: selectedProduct.nameKa,
                      nameRu: selectedProduct.nameRu,
                      price: selectedProduct.price,
                      img: selectedProduct.images?.[selectedImageIndex]?.url || getImg(selectedProduct),
                      size: selectedSize || undefined,
                      color: selectedColor || undefined,
                    });

                    setSelectedProduct(null); // Close modal on success
                  }}
                  className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg tracking-wider uppercase text-xs"
                >
                  {language === 'GE' ? 'კალათაში დამატება' : language === 'RU' ? 'Добавить в корзину' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
