'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: string;
  name: string;
  nameKa: string;
  nameRu: string;
  price: number;
  img: string;
  tag?: string;
  rating: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'velluto-1',
    name: 'Bordeaux Blazer Set',
    nameKa: 'ბორდო ბლეიზერის სეტი',
    nameRu: 'Бордовый блейзер сет',
    price: 390,
    img: '/assets/images/SnapInsta.to_504425330_18067191356475333_7061950038494519014_n.jpg',
    tag: 'New',
    rating: 5
  },
  {
    id: 'velluto-2',
    name: 'Ash Linen 3-Piece Suit',
    nameKa: 'ნაცრისფერი სამნაწილიანი კოსტუმი',
    nameRu: 'Серый льняной костюм тройка',
    price: 690,
    img: '/assets/images/SnapInsta.to_505890033_18067191329475333_1202540640618067158_n.jpg',
    tag: 'Popular',
    rating: 5
  },
  {
    id: 'velluto-3',
    name: 'Citrine Puff Mini Dress',
    nameKa: 'ყვითელი მინი კაბა',
    nameRu: 'Мини-платье Citrine',
    price: 520,
    img: '/assets/images/SnapInsta.to_511492285_17883773805313946_5802540714295682398_n.jpg',
    tag: 'Exclusive',
    rating: 5
  },
  {
    id: 'velluto-4',
    name: 'Citrine Open-Back Dress',
    nameKa: 'ყვითელი კაბა ღია ზურგით',
    nameRu: 'Платье Citrine с открытой спиной',
    price: 520,
    img: '/assets/images/SnapInsta.to_513722015_17883773814313946_4635551935292356186_n.jpg',
    tag: 'Limited',
    rating: 5
  },
  {
    id: 'velluto-5',
    name: 'Forest Jewel Blazer',
    nameKa: 'მწვანე ბიჟუტერიის ბლეიზერი',
    nameRu: 'Блейзер Forest Jewel',
    price: 420,
    img: '/assets/images/SnapInsta.to_571222514_17897423925313946_8859102415012714442_n.jpg',
    rating: 5
  },
  {
    id: 'velluto-6',
    name: 'Pearl Sequin Mini Dress',
    nameKa: 'მარგალიტის ბზინვარე კაბა',
    nameRu: 'Платье с пайетками Pearl',
    price: 580,
    img: '/assets/images/SnapInsta.to_582104208_17902823109313946_7703722575297763764_n.jpg',
    tag: 'New',
    rating: 4
  }
];

export default function NewArrivals() {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const revealRef = useScrollAnimation();
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);

  // Load products from localStorage to allow admin management edits to display on the storefront
  useEffect(() => {
    const savedProducts = localStorage.getItem('velluto_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error('Error parsing products from localStorage', e);
      }
    } else {
      // Initialize localStorage with defaults if not present
      localStorage.setItem('velluto_products', JSON.stringify(DEFAULT_PRODUCTS));
    }

    // Add a simple storage event listener to reflect real-time updates
    const handleStorageChange = () => {
      const updatedProducts = localStorage.getItem('velluto_products');
      if (updatedProducts) {
        setProducts(JSON.parse(updatedProducts));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event dispatch wrapper support for single tab updates
    window.addEventListener('products_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('products_updated', handleStorageChange);
    };
  }, []);

  const getProdName = (prod: Product) => {
    if (language === 'GE') return prod.nameKa;
    if (language === 'RU') return prod.nameRu;
    return prod.name;
  };

  return (
    <section id="new-arrivals" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Head */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-500">
            {t('handcrafted_luxury')}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">
            {t('new_arrivals')}
          </h2>
          <p className="text-neutral-500 font-light text-sm sm:text-base">
            {t('arrivals_subtitle')}
          </p>
        </div>

        {/* Product Grid */}
        <div ref={revealRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((prod) => (
            <article
              key={prod.id}
              className="group relative flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="aspect-[3/4] bg-neutral-50 rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md transition-all duration-300">
                <img
                  src={prod.img}
                  alt={getProdName(prod)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {prod.tag && (
                  <span className="absolute top-4 left-4 bg-neutral-950 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    {prod.tag}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="pt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-neutral-900 text-base">{getProdName(prod)}</h3>
                  <span className="text-base font-semibold text-neutral-900">
                    {prod.price} {t('gel')}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-neutral-800 text-xs">
                  {Array.from({ length: prod.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {Array.from({ length: 5 - prod.rating }).map((_, i) => (
                    <span key={i} className="text-neutral-200">★</span>
                  ))}
                </div>

                {/* Action button */}
                <div className="pt-4">
                  <button
                    onClick={() => addToCart({ id: prod.id, name: prod.name, nameKa: prod.nameKa, nameRu: prod.nameRu, price: prod.price, img: prod.img })}
                    className="w-full inline-flex items-center justify-center gap-2 border border-neutral-950 text-neutral-950 font-semibold py-2.5 rounded-full hover:bg-neutral-950 hover:text-white transition-all duration-300 text-xs uppercase tracking-wider"
                  >
                    <Icon name="PlusIcon" size={14} />
                    {t('add_to_cart')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
