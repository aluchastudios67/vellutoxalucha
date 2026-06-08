'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const HERO_SLIDES = [
  {
    src: '/assets/Landpage images/DSC06962.jpeg',
    alt: 'Velluto premium collection',
  },
  {
    src: '/assets/Landpage images/IMG_0701.jpeg',
    alt: 'Velluto exclusive design series',
  },
  {
    src: '/assets/Landpage images/IMG_8337.jpeg',
    alt: 'Velluto luxury statement catalog',
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      advanceTo((activeSlide + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const advanceTo = (next: number) => {
    if (transitioning || next === activeSlide) return;
    setPrevSlide(activeSlide);
    setActiveSlide(next);
    setTransitioning(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPrevSlide(null);
      setTransitioning(false);
    }, 1600);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-neutral-950">
      {/* Background Slides — all pre-rendered, toggled via opacity for GPU compositing */}
      {HERO_SLIDES.map((slide, i) => {
        const isActive = i === activeSlide;
        const isPrev = i === prevSlide;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              opacity: isActive ? 1 : 0,
              transition: isActive ? 'opacity 1400ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              willChange: 'opacity',
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              quality={85}
              sizes="100vw"
              className="object-cover"
              style={{
                transform: isActive ? 'scale(1.06)' : 'scale(1.0)',
                transition: isActive
                  ? 'transform 12000ms cubic-bezier(0.0, 0.0, 0.2, 1)'
                  : 'transform 1500ms ease-out',
                willChange: 'transform',
              }}
            />
          </div>
        );
      })}

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.10) 38%, rgba(10,10,10,0.05) 65%, rgba(10,10,10,0.30) 100%),
            radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.50) 100%)
          `,
        }}
      />

      {/* ── Centered Logo ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="velluto-logo-cinematic flex flex-col items-center gap-5">
          <div style={{ width: 'min(550px, 80vw)', position: 'relative' }}>
            <Image
              src="/assets/images/logowithbg.png"
              alt="Velluto"
              width={550}
              height={160}
              quality={85}
              priority
              className="object-contain select-none"
              style={{
                width: '100%',
                height: 'auto',
                filter: 'invert(1) drop-shadow(0px 1px 4px rgba(0,0,0,0.3))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => advanceTo(i)} aria-label={`Go to slide ${i + 1}`}>
            <span
              className={`block rounded-full transition-all duration-700 ease-out ${
                activeSlide === i
                  ? 'w-10 h-[3px] bg-white'
                  : 'w-[3px] h-[3px] bg-white/35 hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
