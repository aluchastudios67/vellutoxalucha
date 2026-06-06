'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface CollectionItem {
  id: string;
  name: string;
  nameKa: string;
  nameRu: string;
  price: number;
  img: string;
  category: string;
  tag?: string;
  description: string;
  descriptionKa: string;
  descriptionRu: string;
}

type Category = 'All' | 'Blazers' | 'Dresses' | 'Suits' | 'Coats';

const COLLECTIONS: CollectionItem[] = [
  // ── Blazers ──
  {
    id: 'col-1',
    name: 'Bordeaux Blazer',
    nameKa: 'ბორდო ბლეიზერი',
    nameRu: 'Бордовый блейзер',
    price: 390,
    img: '/assets/images/SnapInsta.to_504425330_18067191356475333_7061950038494519014_n.jpg',
    category: 'Blazers',
    tag: 'New',
    description: 'Single-button structured blazer in deep burgundy with gold emblem detail.',
    descriptionKa: 'ერთ-ღილიანი ბლეიზერი ბორდო ფერში ოქროს ემბლემით.',
    descriptionRu: 'Однобортный блейзер бордового цвета с золотой эмблемой.',
  },
  {
    id: 'col-2',
    name: 'Forest Jewel Blazer',
    nameKa: 'მწვანე ბიჟუტერიის ბლეიზერი',
    nameRu: 'Блейзер Forest Jewel',
    price: 420,
    img: '/assets/images/SnapInsta.to_571222514_17897423925313946_8859102415012714442_n.jpg',
    category: 'Blazers',
    description: 'Double-breasted dark green blazer with crystal jewel buttons, styled with a white structured bag.',
    descriptionKa: 'მუქი მწვანე ბლეიზერი ბრილიანტის ღილებით.',
    descriptionRu: 'Двубортный блейзер темно-зеленого цвета с кристальными пуговицами.',
  },
  {
    id: 'col-3',
    name: 'Dark Chocolate Blazer',
    nameKa: 'მუქი შოკოლადის ბლეიზერი',
    nameRu: 'Тёмно-коричневый блейзер',
    price: 445,
    img: '/assets/images/669377477_18085027145365724_5755948249310207510_n.jpg',
    category: 'Blazers',
    tag: 'Popular',
    description: 'Oversized double-breasted chocolate blazer with wide lapels, paired with a gold chain necklace.',
    descriptionKa: 'ოვერსაიზი ორმაგ-ღილიანი ბლეიზერი შოკოლადის ფერში.',
    descriptionRu: 'Оверсайз двубортный блейзер шоколадного цвета с широкими лацканами.',
  },
  {
    id: 'col-4',
    name: 'Black Power Blazer',
    nameKa: 'შავი ბლეიზერი',
    nameRu: 'Чёрный блейзер Power',
    price: 380,
    img: '/assets/images/656863613_18094032934872648_1607529735855471252_n.jpg',
    category: 'Blazers',
    description: 'Sharp black blazer worn with leather gloves and a pearl charm choker — editorial edge.',
    descriptionKa: 'შავი ბლეიზერი, სტილიზებული მოთეთრო ყელსაბამით.',
    descriptionRu: 'Чёрный блейзер с кожаными перчатками и жемчужным чокером.',
  },
  {
    id: 'col-5',
    name: 'Taupe Puff Blazer',
    nameKa: 'ჯაყო-ბლეიზერი ტაუპ ფერში',
    nameRu: 'Блейзер с объёмными рукавами',
    price: 410,
    img: '/assets/images/565010092_17896476444313946_5874841559799174791_n.jpg',
    category: 'Blazers',
    tag: 'Limited',
    description: 'Sculpted puff-sleeve blazer in taupe with rhinestone buttons, paired with mini shorts.',
    descriptionKa: 'ჯაყო-სახელოიანი ბლეიზერი ტაუპ ფერში.',
    descriptionRu: 'Блейзер с объёмными рукавами и стразами.',
  },

  // ── Dresses ──
  {
    id: 'col-6',
    name: 'Citrine Puff Mini Dress',
    nameKa: 'ყვითელი მინი კაბა',
    nameRu: 'Мини-платье Citrine с объёмными рукавами',
    price: 520,
    img: '/assets/images/SnapInsta.to_511492285_17883773805313946_5802540714295682398_n.jpg',
    category: 'Dresses',
    tag: 'Exclusive',
    description: 'Citrine yellow mini dress with dramatic puff sleeves, a keyhole cut-out front, and open back.',
    descriptionKa: 'ყვითელი მინი კაბა, ჯაყო სახელოებით და კაბის გახსნილი ზურგით.',
    descriptionRu: 'Мини-платье лимонного цвета с объёмными рукавами и открытой спиной.',
  },
  {
    id: 'col-7',
    name: 'Pearl Sequin Mini Dress',
    nameKa: 'მარგალიტის ბზინვარე კაბა',
    nameRu: 'Платье с пайетками Pearl',
    price: 580,
    img: '/assets/images/SnapInsta.to_582104208_17902823109313946_7703722575297763764_n.jpg',
    category: 'Dresses',
    tag: 'New',
    description: 'Cream boucle-sequin keyhole mini dress with strong shoulders — party-perfect.',
    descriptionKa: 'კრემისფერი ბლუზი პაიეტებით, კლასიკური სტილის.',
    descriptionRu: 'Мини-платье цвета крем с пайетками, с вырезом и строгими плечами.',
  },
  {
    id: 'col-8',
    name: 'Noir Crystal Dress',
    nameKa: 'შავი ბრწყინვალე კაბა',
    nameRu: 'Платье Noir Crystal',
    price: 610,
    img: '/assets/images/613186982_17906524104313946_1161426320000551239_n.jpg',
    category: 'Dresses',
    description: 'Black crystal-encrusted bat-sleeve evening dress with a beret, radiating Parisian glamour.',
    descriptionKa: 'შავი კრისტალებით მოქარგული საღამოს კაბა.',
    descriptionRu: 'Чёрное вечернее платье с кристаллами и рукавами-кимоно.',
  },

  // ── Suits ──
  {
    id: 'col-9',
    name: 'Ash Linen 3-Piece Suit',
    nameKa: 'ნაცრისფერი სამნაწილიანი კოსტუმი',
    nameRu: 'Серый льняной костюм тройка',
    price: 690,
    img: '/assets/images/SnapInsta.to_505890033_18067191329475333_1202540640618067158_n.jpg',
    category: 'Suits',
    tag: 'Popular',
    description: 'Three-piece grey linen suit — blazer, waistcoat, and wide-leg trousers — a boardroom power play.',
    descriptionKa: '3-ნაწილიანი ნაცრისფერი სელის კოსტუმი — ბლეიზერი, ჟილეტი, შარვალი.',
    descriptionRu: 'Трёхчастный серый льняной костюм — блейзер, жилет, брюки.',
  },
  {
    id: 'col-10',
    name: 'Tobacco Oversized Suit',
    nameKa: 'ჩაი-ფერი ოვერსაიზ კოსტუმი',
    nameRu: 'Оверсайз костюм Tobacco',
    price: 720,
    img: '/assets/images/587190041_17902398984313946_6954722523838154381_n.jpg',
    category: 'Suits',
    description: 'Oversized tobacco-brown wool suit with fluid wide trousers, styled with stilettos.',
    descriptionKa: 'ოვერსაიზი ყავისფერი მატყლის კოსტუმი ფართო შარვლით.',
    descriptionRu: 'Оверсайз костюм цвета табака из шерсти с широкими брюками.',
  },
  {
    id: 'col-11',
    name: 'Mocha Wide-Leg Suit',
    nameKa: 'მოკა ფართო-შარვლიანი კოსტუმი',
    nameRu: 'Костюм Mocha с широкими брюками',
    price: 650,
    img: '/assets/images/SnapInsta.to_660404461_18571325920023235_6002293829497873707_n.jpg',
    category: 'Suits',
    tag: 'New',
    description: 'Full dark mocha monochrome suit with flared trousers, beret, and loafers — street-luxe.',
    descriptionKa: 'მუქი მოკა ფერის მოнოქრომი კოსტუმი ბერეტით.',
    descriptionRu: 'Монохромный костюм цвета мокко с расклешёнными брюками.',
  },
  {
    id: 'col-12',
    name: 'Bordeaux Wide-Leg Set',
    nameKa: 'ბორდო ფართო-შარვლიანი სეტი',
    nameRu: 'Бордовый сет с широкими брюками',
    price: 680,
    img: '/assets/images/491461720_18312104614237796_5164390498939757014_n.jpg',
    category: 'Suits',
    description: 'Rich bordeaux wide-leg suit set worn outdoors — tailored to perfection.',
    descriptionKa: 'ბორდო ფართო-შარვლიანი სეტი, ქალაქის სტილი.',
    descriptionRu: 'Бордовый сет с широкими брюками — городской стиль.',
  },
  {
    id: 'col-13',
    name: 'Ivory Military Jacket Set',
    nameKa: 'სპილოძვლის სამხედრო ჟაკეტის სეტი',
    nameRu: 'Слоновая кость — военный жакет с брюками',
    price: 560,
    img: '/assets/images/496924846_17877595104313946_5217244369845907245_n.jpg',
    category: 'Suits',
    tag: 'Limited',
    description: 'Ivory mandarin-collar cropped jacket with gold button embroidery and matching wide trousers.',
    descriptionKa: 'სპილოძვლის სამხედრო სტილის მოკლე ჟაკეტი.',
    descriptionRu: 'Укороченный жакет молочного цвета с воротником-стойкой и брюками.',
  },

  // ── Coats ──
  {
    id: 'col-14',
    name: 'Camel Structured Coat',
    nameKa: 'ქამელის სტრუქტურული ქურთუკი',
    nameRu: 'Верблюжье структурированное пальто',
    price: 790,
    img: '/assets/images/610744728_18371701102094939_2178069007767022993_n.jpg',
    category: 'Coats',
    tag: 'Exclusive',
    description: 'Camel wool coat with sharp structured shoulders and button cuff detail — elevated everyday.',
    descriptionKa: 'ქამელის ფერის მატყლის ქურთუკი მკვეთრი მხრებით.',
    descriptionRu: 'Верблюжье шерстяное пальто со структурированными плечами.',
  },
];

const CATEGORIES: Category[] = ['All', 'Blazers', 'Dresses', 'Suits', 'Coats'];

export default function CollectionsSection() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const revealRef = useScrollAnimation();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? COLLECTIONS
    : COLLECTIONS.filter(item => item.category === activeCategory);

  const getName = (item: CollectionItem) => {
    if (language === 'GE') return item.nameKa;
    if (language === 'RU') return item.nameRu;
    return item.name;
  };

  const getDesc = (item: CollectionItem) => {
    if (language === 'GE') return item.descriptionKa;
    if (language === 'RU') return item.descriptionRu;
    return item.description;
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
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
              }`}
            >
              {cat === 'All'
                ? (language === 'GE' ? 'ყველა' : language === 'RU' ? 'Все' : 'All')
                : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
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
                  src={item.img}
                  alt={getName(item)}
                  fill
                  quality={85}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/30 transition-all duration-500 flex items-end"
                >
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
                        img: item.img,
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
                <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-neutral-700 text-[9px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
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
      </div>
    </section>
  );
}
