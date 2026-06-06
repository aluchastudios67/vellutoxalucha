'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function EditorialStrip() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-neutral-950 flex items-center justify-center">
      {/* Video Loop Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-65"
      >
        <source
          src="/assets/images/SnapInsta.to_AQN_HKtelsBukRPV6FO_5JzUNpOKeQ9DBn9rKuebf2TDkKPx5jVjYcluoqxiUuzdojcJrU2vZI4YfjCPYbAi0pdiNBIlStPulap0eug.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Luxury Scrim Overlay */}
      <div className="absolute inset-0 bg-neutral-950/40 z-10" />

      {/* Center Text content */}
      <div className="relative z-20 text-center px-6 max-w-3xl space-y-6">
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-white">
          {t('strip_title')}
        </span>
        <h3 className="font-serif italic text-3xl sm:text-5xl font-light text-white leading-tight">
          {t('strip_subtitle')}
        </h3>
        <div className="w-12 h-px bg-white mx-auto" />
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-300">
          {t('strip_collection')}
        </p>
      </div>
    </section>
  );
}
