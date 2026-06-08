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

const LOOK_ITEMS: LookItem[] = [
  {
    id: 'item-1',
    name: 'Aurelia Sun-Drenched Yellow Dress',
    price: 490,
    top: '45%',
    left: '42%',
    img: '/assets/item 1/DSC06881.jpeg',
  },
  {
    id: 'item-2',
    name: 'Elysian Drape Blazer Suit',
    price: 470,
    top: '72%',
    left: '55%',
    img: '/assets/item 2/IMG_8337.jpeg',
  },
];

export default function ShopTheLook() {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const revealRef = useScrollAnimation();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const getItemName = (id: string, defaultName: string) => {
    if (id === 'item-1') {
      if (language === 'GE') return 'ოქროსფერი კაბა აურელია';
      if (language === 'RU') return 'Желтое платье Aurelia';
    }
    if (id === 'item-2') {
      if (language === 'GE') return 'ორეული ელიზიანი';
      if (language === 'RU') return 'Костюм блейзер Elysian';
    }
    return defaultName;
  };

  const getLocalizedNameFields = (id: string) => {
    if (id === 'item-1') {
      return {
        nameKa: 'ოქროსფერი კაბა აურელია',
        nameRu: 'Желтое платье Aurelia',
      };
    }
    if (id === 'item-2') {
      return {
        nameKa: 'ორეული ელიზიანი',
        nameRu: 'Костюм блейзер Elysian',
      };
    }
    return {};
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
              {LOOK_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-neutral-900/50 border border-neutral-800/80 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 relative flex-shrink-0">
                      <Image
                        src={item.img}
                        alt={getItemName(item.id, item.name)}
                        fill
                        sizes="40px"
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {getItemName(item.id, item.name)}
                      </p>
                      <p className="text-xs text-neutral-300">
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
                        ...getLocalizedNameFields(item.id),
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
              <Image
                src="/assets/images/SnapInsta.to_587489546_17902823082313946_8580408224463025574_n.jpg"
                alt="Model styling luxury fashion look"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover select-none"
              />

              {/* Interactive Hotspot Dots */}
              {LOOK_ITEMS.map((item) => (
                <div key={item.id} className="absolute" style={{ top: item.top, left: item.left }}>
                  <button
                    onMouseEnter={() => setActiveHotspot(item.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    onClick={() => setActiveHotspot(activeHotspot === item.id ? null : item.id)}
                    className="relative w-6 h-6 flex items-center justify-center bg-white text-neutral-950 font-bold rounded-full border border-neutral-900 focus:outline-none transition-transform hover:scale-110 shadow-lg"
                    aria-label={`Hotspot for ${getItemName(item.id, item.name)}`}
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
                          alt={getItemName(item.id, item.name)}
                          fill
                          sizes="48px"
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-[11px] font-bold text-neutral-800 line-clamp-1">
                        {getItemName(item.id, item.name)}
                      </p>
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
                            ...getLocalizedNameFields(item.id),
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
