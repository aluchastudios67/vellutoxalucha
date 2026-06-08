'use client';

import React from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/context/LanguageContext';

export default function LocationStrip() {
  const revealRef = useScrollAnimation();
  const { t } = useLanguage();

  return (
    <section id="location" className="py-20 bg-neutral-50 border-t border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text and details */}
        <div ref={revealRef} className="space-y-6">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-500">
            {t('visit_us')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            {t('visit_us_title')}
          </h2>
          <p className="text-neutral-600 font-light text-base sm:text-lg leading-relaxed">
            {t('visit_us_desc')}
          </p>

          <ul className="space-y-4 pt-4 text-sm font-medium text-neutral-800">
            <li className="flex items-center gap-3">
              <Icon name="MapPinIcon" size={18} className="text-neutral-700" />
              <a
                href="https://maps.app.goo.gl/wh7ZXLwAnUTgk17H6"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {t('address_value')}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="PhoneIcon" size={18} className="text-neutral-700" />
              <a href="tel:+995599123456" className="hover:underline">
                +995 599 12 34 56
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="ClockIcon" size={18} className="text-neutral-700" />
              <span>{t('hours_value')}</span>
            </li>
          </ul>

          <div className="pt-2">
            <a
              href="https://maps.app.goo.gl/wh7ZXLwAnUTgk17H6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors shadow-md"
            >
              <Icon name="ExternalLinkIcon" size={12} />
              {t('open_maps')}
            </a>
          </div>
        </div>

        {/* Boutique showcase image */}
        <div className="relative aspect-[16/10] bg-neutral-100 rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/assets/images/SnapInsta.to_694137775_18072766193427734_1434467531449252322_n.jpg"
            alt="Velluto Tbilisi Boutique"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            Open 24/7
          </div>
        </div>
      </div>
    </section>
  );
}
