'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  id: string;
  url: string;
  isFeatured: boolean;
}

interface ProductVariant {
  id: string;
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
  variants: ProductVariant[];
}

interface ProductDetailsClientProps {
  product: Product;
}

const COLOR_MAP: Record<string, string> = {
  'Midnight Onyx': '#111111',
  'Tuscan Cocoa': '#5D4037',
  'Alabaster Milk': '#F5EFE6',
  'Rose Quartz': '#F3B0C3',
  'Ethereal Azure': '#A8D3E6',
  'Ivory Silk': '#FFFDF9',
  'Sage Garden': '#9CA998',
  'Dusty Rose': '#CCA7A2',
  'Classic Navy': '#1B365D',
  'Midnight Noir': '#111111',
  'Alabaster White': '#F8F6F2',
  'Powder Rose': '#FFD1DC',
  'Soft Horizon': '#89CFF0',
};

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { language } = useLanguage();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const getName = () => {
    if (language === 'GE') return product.nameKa;
    if (language === 'RU') return product.nameRu;
    return product.name;
  };

  const getDesc = () => {
    if (language === 'GE') return product.descriptionKa;
    if (language === 'RU') return product.descriptionRu;
    return product.description;
  };

  const getCatName = () => {
    if (!product.category) return '';
    if (language === 'GE') return product.category.nameKa;
    if (language === 'RU') return product.category.nameRu;
    return product.category.name;
  };

  const handleAddToCart = () => {
    const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));
    const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)));

    if (uniqueSizes.length > 0 && !selectedSize) {
      alert(
        language === 'GE'
          ? 'გთხოვთ აირჩიოთ ზომა'
          : language === 'RU'
            ? 'Пожалуйста, выберите размер'
            : 'Please select a size'
      );
      return;
    }
    if (uniqueColors.length > 0 && !selectedColor) {
      alert(
        language === 'GE'
          ? 'გთხოვთ აირჩიოთ ფერი'
          : language === 'RU'
            ? 'Пожалуйста, выберите цвет'
            : 'Please select a color'
      );
      return;
    }

    setIsAdding(true);
    const cartItemId = `${product.id}_${selectedSize || 'default'}_${selectedColor || 'default'}`;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: cartItemId,
        name: product.name,
        nameKa: product.nameKa,
        nameRu: product.nameRu,
        price: product.price,
        img:
          product.images?.[activeIdx]?.url ||
          product.images?.[0]?.url ||
          '/assets/images/no_image.png',
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      });
    }

    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2200);
    }, 600);
  };

  const sizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s))
  );
  const colors = Array.from(
    new Set(product.variants.map((v) => v.color).filter((c): c is string => !!c))
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-16 pt-6 pb-24">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-neutral-400 mb-10">
        <Link href="/" className="hover:text-neutral-800 transition-colors duration-200">
          {language === 'GE' ? 'მთავარი' : language === 'RU' ? 'Главная' : 'Home'}
        </Link>
        <span className="opacity-30">—</span>
        <Link href="/collections" className="hover:text-neutral-800 transition-colors duration-200">
          {language === 'GE' ? 'კოლექციები' : language === 'RU' ? 'Коллекции' : 'Collections'}
        </Link>
        <span className="opacity-30">—</span>
        <span className="text-neutral-700 font-bold truncate max-w-[160px] sm:max-w-xs">
          {getName()}
        </span>
      </nav>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-10 xl:gap-20 items-start">
        {/* ══════════ LEFT: Image Gallery ══════════ */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Vertical thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 sm:pt-0 sm:w-[72px] flex-shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className="relative flex-shrink-0 w-[64px] h-[80px] sm:w-full sm:h-[88px] rounded-xl overflow-hidden transition-all duration-150"
                  style={{
                    outline: activeIdx === idx ? '2px solid #111' : '2px solid transparent',
                    outlineOffset: '2px',
                    opacity: activeIdx === idx ? 1 : 0.55,
                  }}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image — all images stacked, toggled by opacity for INSTANT switch */}
          <div className="order-1 sm:order-2 flex-1 relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-100 shadow-sm">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="absolute inset-0 transition-opacity duration-200"
                  style={{ opacity: activeIdx === idx ? 1 : 0, zIndex: activeIdx === idx ? 1 : 0 }}
                >
                  <Image
                    src={img.url}
                    alt={getName()}
                    fill
                    priority={idx === 0}
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-neutral-300 text-sm">
                No image
              </div>
            )}

            {/* Tag badge over image */}
            {product.tag && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-neutral-950 text-white text-[9px] font-black tracking-[0.22em] uppercase px-3 py-1.5 rounded-full shadow-lg">
                  {product.tag}
                </span>
              </div>
            )}

            {/* Image counter dot */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className="transition-all duration-150"
                    style={{
                      width: activeIdx === idx ? 20 : 6,
                      height: 6,
                      borderRadius: 99,
                      background: activeIdx === idx ? '#fff' : 'rgba(255,255,255,0.45)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════ RIGHT: Product Info ══════════ */}
        <div className="flex flex-col gap-0 lg:sticky lg:top-28">
          {/* Category chip */}
          <div className="flex items-center gap-2 mb-5">
            {product.category && (
              <Link
                href="/collections"
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 border border-neutral-200 px-3 py-1 rounded-full hover:border-neutral-400 hover:text-neutral-700 transition-all duration-200"
              >
                {getCatName()}
              </Link>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-bold text-neutral-950 leading-[1.1] tracking-tight mb-3">
            {getName()}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-7">
            <span className="text-3xl font-black text-neutral-950 tracking-tight">
              {product.price}
            </span>
            <span className="text-lg font-semibold text-neutral-500">
              {language === 'GE' ? 'ლ' : language === 'RU' ? '₾' : 'GEL'}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-neutral-200 via-neutral-100 to-transparent mb-7" />

          {/* Description */}
          <p className="text-[15px] text-neutral-500 font-light leading-[1.8] mb-8">{getDesc()}</p>

          {/* ── Size Selector ── */}
          {sizes.length > 0 && (
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                  {language === 'GE' ? 'ზომა' : language === 'RU' ? 'Размер' : 'Size'}
                </span>
                {selectedSize && (
                  <span className="text-[11px] font-semibold text-neutral-600 tracking-wide">
                    {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="relative h-11 px-5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-150"
                    style={{
                      background: selectedSize === size ? '#111' : 'transparent',
                      color: selectedSize === size ? '#fff' : '#555',
                      border: selectedSize === size ? '2px solid #111' : '2px solid #e5e5e5',
                      transform: selectedSize === size ? 'scale(1.04)' : 'scale(1)',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Color Selector ── */}
          {colors.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                  {language === 'GE' ? 'ფერი' : language === 'RU' ? 'Цвет' : 'Color'}
                </span>
                {selectedColor && (
                  <span className="text-[11px] font-semibold text-neutral-600 tracking-wide">
                    {selectedColor}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => {
                  const hex = COLOR_MAP[color];
                  let isLight = false;
                  if (hex) {
                    const c = hex.replace('#', '');
                    const rgb = parseInt(c, 16);
                    const r = (rgb >> 16) & 0xff;
                    const g = (rgb >> 8) & 0xff;
                    const b = (rgb >> 0) & 0xff;
                    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    isLight = luma > 175;
                  }

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className="flex items-center gap-2.5 pl-3.5 pr-4 h-11 rounded-xl text-[12px] font-bold tracking-wide transition-all duration-200 shadow-sm"
                      style={{
                        background: hex || 'transparent',
                        color: isLight ? '#111111' : '#ffffff',
                        border:
                          selectedColor === color ? '2px solid #111111' : '2px solid transparent',
                        outline:
                          selectedColor === color
                            ? `2.5px solid ${isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)'}`
                            : 'none',
                        outlineOffset: '-4px',
                        transform: selectedColor === color ? 'scale(1.05)' : 'scale(1)',
                        boxShadow:
                          selectedColor === color
                            ? '0 6px 16px rgba(0,0,0,0.15)'
                            : '0 2px 6px rgba(0,0,0,0.05)',
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
                        }}
                      />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Quantity + Add to Cart ── */}
          <div className="flex gap-3 items-stretch mt-2">
            {/* Quantity stepper */}
            <div
              className="flex items-center rounded-2xl border-2 border-neutral-200 overflow-hidden flex-shrink-0"
              style={{ height: 56 }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center text-xl text-neutral-400 hover:text-neutral-950 hover:bg-neutral-50 transition-all"
              >
                −
              </button>
              <span className="w-10 text-center text-[15px] font-bold text-neutral-950 select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center text-xl text-neutral-400 hover:text-neutral-950 hover:bg-neutral-50 transition-all"
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 relative overflow-hidden rounded-2xl font-bold text-[13px] tracking-[0.15em] uppercase transition-all duration-200 flex items-center justify-center gap-3"
              style={{
                height: 56,
                background: addedSuccess ? '#16a34a' : '#111',
                color: '#fff',
                boxShadow: addedSuccess
                  ? '0 8px 32px rgba(22,163,74,0.25)'
                  : '0 8px 32px rgba(0,0,0,0.18)',
                transform: isAdding ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              {/* Shimmer effect on hover */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
                }}
              />
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  {language === 'GE'
                    ? 'ემატება...'
                    : language === 'RU'
                      ? 'Добавление...'
                      : 'Adding…'}
                </span>
              ) : addedSuccess ? (
                <span className="flex items-center gap-2">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {language === 'GE' ? 'დაემატა!' : language === 'RU' ? 'Добавлено!' : 'Added!'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="3"
                      y1="6"
                      x2="21"
                      y2="6"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 10a4 4 0 01-8 0"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {language === 'GE'
                    ? 'კალათაში დამატება'
                    : language === 'RU'
                      ? 'В корзину'
                      : 'Add to Cart'}
                </span>
              )}
            </button>
          </div>

          {/* ── Details strip ── */}
          <div className="mt-10 pt-8 border-t border-neutral-100 grid grid-cols-3 gap-4 text-center">
            {[
              {
                icon: '✦',
                label:
                  language === 'GE'
                    ? 'პრემიუმ ხარისხი'
                    : language === 'RU'
                      ? 'Люкс качество'
                      : 'Premium Quality',
              },
              {
                icon: '◎',
                label:
                  language === 'GE'
                    ? 'უფასო მიწოდება'
                    : language === 'RU'
                      ? 'Бесплатная доставка'
                      : 'Free Delivery',
              },
              {
                icon: '↩',
                label:
                  language === 'GE'
                    ? '14-დღიანი დაბრუნება'
                    : language === 'RU'
                      ? '14 дней возврат'
                      : '14-Day Returns',
              },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <span className="text-[16px] text-neutral-400">{item.icon}</span>
                <span className="text-[10px] font-semibold tracking-wide text-neutral-400 leading-tight text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
