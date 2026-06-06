'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/context/LanguageContext';

export default function EditorialIntro() {
  const revealRef = useScrollAnimation();
  const { t } = useLanguage();

  return (
    <section id="about-us" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Brand Narrative */}
        <div ref={revealRef} className="space-y-8">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-500">
            {t('heritage_title')}
          </span>
          
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            {t('heritage_subtitle')}
          </h2>
          
          <div className="space-y-6 text-neutral-600 font-light leading-relaxed text-base sm:text-lg">
            <p>
              {t('heritage_desc1')}
            </p>
            <p>
              {t('heritage_desc2')}
            </p>
          </div>
          
          <div className="pt-4 border-t border-neutral-100 flex items-center gap-8">
            <div>
              <p className="text-2xl font-bold text-neutral-900">{t('stats_years')}</p>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">{t('stats_years_label')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{t('stats_items')}</p>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">{t('stats_items_label')}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Image Grid Collage */}
        <div className="relative">
          <div className="aspect-[4/5] w-full bg-neutral-100 rounded-2xl overflow-hidden relative shadow-2xl">
            <img
              src="/assets/images/SnapInsta.to_660404461_18571325920023235_6002293829497873707_n.jpg"
              alt="Artisanal jewelry creation"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[6000ms]"
            />
          </div>
          {/* Floating detail tag */}
          <div className="absolute -bottom-6 -left-6 bg-neutral-950 text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block">
            <p className="text-xs font-semibold tracking-widest uppercase text-white mb-1">Attention to Detail</p>
            <p className="text-sm font-light text-neutral-300">Each piece undergoes a detailed audit to ensure it matches the highest standards.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
