'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/context/LanguageContext';

interface LookItem {
  id: string;
  name: string;
  price: number;
  top: string; // percentage from top
  left: string; // percentage from left
  img: string;
}

export default function ShopTheLook({ products: initialProducts = [] }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const revealRef = useScrollAnimation();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const mappedInitial =
    Array.isArray(initialProducts) && initialProducts.length >= 1
      ? initialProducts.slice(0, 1).map((p: any, idx: number) => ({
          id: p.id,
          name: p.name,
          nameKa: p.nameKa,
          nameRu: p.nameRu,
          price: p.price,
          img: p.images?.[0]?.url || '/assets/images/no_image.png',
          top: '45%',
          left: '42%',
        }))
      : [];

  const [lookItems] = useState<LookItem[]>(mappedInitial);

  const getItemName = (item: any) => {
    if (language === 'GE') return item.nameKa || item.name;
    if (language === 'RU') return item.nameRu || item.name;
    return item.name;
  };

  const getLocalizedNameFields = (item: any) => {
    return {
      nameKa: item.nameKa,
      nameRu: item.nameRu,
    };
  };

  return (
    <section id="shop-the-look" className="py-24 bg-neutral-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Text Description */}
          <div ref={revealRef} className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400">
              {t('shop_look')}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              {t('shop_look_title')}
            </h2>
            <p className="text-neutral-400 font-light leading-relaxed text-sm sm:text-base">
              {t('shop_look_subtitle')}
            </p>

            {/* List version for mobile accessibility */}
            <div className="space-y-4 pt-6 border-t border-neutral-800">
              {lookItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-neutral-900/50 border border-neutral-800/80 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 relative flex-shrink-0">
                      <Image
                        src={item.img}
                        alt={getItemName(item)}
                        fill
                        sizes="40px"
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{getItemName(item)}</h3>
                      <p className="text-neutral-400 text-xs mt-0.5">
                        {item.price} {t('gel')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        img: item.img,
                        ...getLocalizedNameFields(item),
                      })
                    }
                    className="p-2 bg-white text-neutral-950 hover:bg-neutral-200 transition-colors rounded-full"
                    aria-label="Add to cart"
                  >
                    <Icon name="PlusIcon" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Showcase Image */}
          <div className="lg:col-span-7 relative flex justify-center">
            <div className="relative aspect-[4/5] w-full max-w-lg bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
              {lookItems.length > 0 && lookItems[0].img && (
                <Image
                  src="/assets/images/SnapInsta.to_587489546_17902823082313946_8580408224463025574_n.jpg"
                  alt="Shop the look editorial"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover select-none"
                />
              )}
              <div className="absolute inset-0 bg-neutral-950/10 transition-colors duration-500 group-hover:bg-neutral-950/20" />

              {/* Hotspots */}
              {lookItems.map((item) => (
                <div
                  key={item.id}
                  className="absolute"
                  style={{ top: item.top, left: item.left }}
                  onMouseEnter={() => setActiveHotspot(item.id)}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <button
                    onClick={() => setActiveHotspot(activeHotspot === item.id ? null : item.id)}
                    className="relative w-6 h-6 flex items-center justify-center bg-white text-neutral-950 font-bold rounded-full border border-neutral-900 focus:outline-none transition-transform hover:scale-110 shadow-lg"
                    aria-label={`Hotspot for ${getItemName(item)}`}
                  >
                    <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-30" />
                    <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full z-10" />
                  </button>

                  {/* Popover Card */}
                  {activeHotspot === item.id && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-48 bg-white text-neutral-950 p-3 rounded-xl shadow-2xl animate-fade-in text-center flex flex-col items-center border border-neutral-100">
                      <div className="w-12 h-14 relative mb-2">
                        <Image
                          src={item.img}
                          alt={getItemName(item)}
                          fill
                          sizes="48px"
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-bold text-[13px] text-neutral-900 leading-tight">
                        {getItemName(item)}
                      </h4>
                      <p className="text-xs font-semibold text-neutral-900 mt-0.5">
                        {item.price} {t('gel')}
                      </p>
                      <button
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            img: item.img,
                            ...getLocalizedNameFields(item),
                          })
                        }
                        className="mt-2 w-full bg-neutral-950 text-white hover:bg-neutral-900 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors"
                      >
                        {t('add_to_cart')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
