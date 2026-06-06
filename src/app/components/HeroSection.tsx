'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const HERO_SLIDES = [
  {
    src: '/assets/images/SnapInsta.to_509639901_17883773823313946_8207471632911727314_n.jpg',
    alt: 'Velluto premium collection',
  },
  {
    src: '/assets/images/SnapInsta.to_567283772_17897423943313946_1224297561252081588_n.jpg',
    alt: 'Velluto exclusive design series',
  },
  {
    src: '/assets/images/SnapInsta.to_639852206_17912699673313946_602977115060223598_n.png',
    alt: 'Velluto luxury statement catalog',
  },
];

const CINEMATIC_STYLE = `
  @keyframes velluto-cinematic-in {
    0%   { opacity: 0; transform: scale(0.92); letter-spacing: 0.35em; }
    60%  { opacity: 1; }
    100% { opacity: 1; transform: scale(1); letter-spacing: inherit; }
  }
  .velluto-logo-cinematic {
    animation: velluto-cinematic-in 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: 0.4s;
    opacity: 0;
  }
`;

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const existing = document.getElementById('velluto-cinematic-style');
    if (!existing) {
      const style = document.createElement('style');
      style.id = 'velluto-cinematic-style';
      style.textContent = CINEMATIC_STYLE;
      document.head.appendChild(style);
    }
  }, []);

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

      {/* Background Slides */}
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
              transition: isActive ? 'opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
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

      {/* ── Centered Logo — Cinematic Fade + Scale ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="velluto-logo-cinematic flex flex-col items-center gap-5">

          {/* Logo — cropped to letters only (hides the V shape above) */}
          <div
            style={{
              width: '420px',
              height: '80px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              src="/assets/images/app_logo.png"
              alt="Velluto"
              width={420}
              height={420}
              quality={85}
              priority
              className="object-contain select-none"
              style={{
                filter: 'brightness(1.1)',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: 'auto',
              }}
            />
          </div>

          {/* Thin rule under the logo */}
          <div
            style={{
              width: '48px',
              height: '1px',
              background: 'rgba(255,255,255,0.35)',
            }}
          />

          {/* Subtle tagline */}
          <span
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontFamily: 'inherit',
            }}
          >
            New Collection
          </span>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => advanceTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
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
