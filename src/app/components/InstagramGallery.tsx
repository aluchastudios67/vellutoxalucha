'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/context/LanguageContext';

interface GalleryImage {
  src: string;
  alt: string;
  span?: 'tall' | 'normal';
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/assets/images/466683399_17855518965313946_135400479774660435_n.jpg',
    alt: 'Velluto premium luxury jewelry detail',
    span: 'tall'
  },
  {
    src: '/assets/images/467509994_17856082881313946_5041263538202115010_n.jpg',
    alt: 'Velluto gold rings stack showcase',
    span: 'normal'
  },
  {
    src: '/assets/images/474749660_17864735742313946_7878688106869986165_n.jpg',
    alt: 'Elegant necklace display by Velluto',
    span: 'normal'
  },
  {
    src: '/assets/images/475000754_17864895795313946_4704149861034976879_n.jpg',
    alt: 'Luxury bridal rings custom design',
    span: 'tall'
  },
  {
    src: '/assets/images/475514378_17865712293313946_8496582647092697662_n.jpg',
    alt: 'Fine handcrafted details of Velluto',
    span: 'normal'
  },
  {
    src: '/assets/images/475805997_17865665238313946_5498269175980725608_n.jpg',
    alt: 'Minimal luxury gold collection items',
    span: 'normal'
  },
  {
    src: '/assets/images/475890770_17865694551313946_716347146579670514_n.jpg',
    alt: 'Velluto custom collection earrings',
    span: 'normal'
  },
  {
    src: '/assets/images/476233110_17865705579313946_6551059994165377979_n.jpg',
    alt: 'Luxury fashion photoshoot featuring Velluto',
    span: 'normal'
  }
];

export default function InstagramGallery() {
  const revealRef = useScrollAnimation();
  const { t } = useLanguage();

  return (
    <section id="instagram-gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-500">
              {t('insta_title')}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mt-2">
              {t('insta_subtitle')}
            </h2>
          </div>
          <a
            href="https://www.instagram.com/velluto_____/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 border-b-2 border-neutral-950 pb-1 hover:text-amber-500 hover:border-amber-500 transition-all"
          >
            <Icon name="CameraIcon" size={16} />
            @velluto_____
          </a>
        </div>

        {/* Masonry-style Grid */}
        <div
          ref={revealRef}
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gridAutoRows: '220px'
          }}
        >
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer shadow-sm"
              style={{
                gridRow: img.span === 'tall' ? 'span 2' : 'span 1'
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover overlay */}
              <a
                href="https://www.instagram.com/velluto_____/"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-neutral-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Icon name="CameraIcon" size={18} className="text-neutral-900" />
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/velluto_____/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-neutral-950 text-neutral-950 font-semibold px-8 py-3 rounded-full hover:bg-neutral-950 hover:text-white transition-all duration-300 text-xs uppercase tracking-wider"
          >
            <Icon name="CameraIcon" size={14} />
            {t('explore_collection')}
          </a>
        </div>
      </div>
    </section>
  );
}
