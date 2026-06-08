'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Icon from '@/components/ui/AppIcon';

export default function Navigation() {
  const { cartCount, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const showWhiteHeader = !isHome || isScrolled;

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showWhiteHeader ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo - Inverted when transparent header over dark hero background */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/assets/images/logowithbg.png"
            alt="Velluto"
            width={300}
            height={144}
            className={`h-36 w-auto object-contain -my-10 transition-all duration-300 ${
              showWhiteHeader ? '' : 'invert'
            }`}
            priority
          />
        </Link>

        {/* Desktop Links - White when over dark hero, dark grey when scrolled */}
        <nav
          className={`hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
            showWhiteHeader ? 'text-neutral-600' : 'text-neutral-100'
          }`}
        >
          <Link
            href="/collections"
            className={`transition-colors duration-300 ${
              showWhiteHeader ? 'hover:text-neutral-950' : 'hover:text-white'
            }`}
          >
            {t('collections')}
          </Link>
          <Link
            href="/#about-us"
            className={`transition-colors duration-300 ${
              showWhiteHeader ? 'hover:text-neutral-950' : 'hover:text-white'
            }`}
          >
            {t('our_story')}
          </Link>
          <Link
            href="/#shop-the-look"
            className={`transition-colors duration-300 ${
              showWhiteHeader ? 'hover:text-neutral-950' : 'hover:text-white'
            }`}
          >
            {t('shop_the_look')}
          </Link>
          <Link
            href="/#location"
            className={`transition-colors duration-300 ${
              showWhiteHeader ? 'hover:text-neutral-950' : 'hover:text-white'
            }`}
          >
            {t('visit_us')}
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Optional Languages Selector */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold tracking-wider">
            {(['EN', 'GE', 'RU'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 py-0.5 rounded transition-all duration-300 ${
                  language === lang
                    ? showWhiteHeader
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-900 shadow-sm'
                    : showWhiteHeader
                      ? 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                      : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Call Us Action */}
          <a
            href="tel:+995599123456"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <Icon name="PhoneIcon" size={12} />
            {t('call_us')}
          </a>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2.5 rounded-full transition-all duration-200 ${
              showWhiteHeader
                ? 'text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100/80'
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
            aria-label="Shopping Cart"
          >
            <Icon name="ShoppingBagIcon" size={22} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Mobile Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-full transition-all ${
              showWhiteHeader
                ? 'text-neutral-800 hover:bg-neutral-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle Menu"
          >
            <Icon name={isMobileMenuOpen ? 'XIcon' : 'MenuIcon'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] bg-white border-b border-neutral-100 shadow-lg p-6 animate-slide-down">
          <nav className="flex flex-col gap-4 text-base font-semibold text-neutral-800">
            <Link
              href="/collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-950 transition-colors"
            >
              {t('collections')}
            </Link>
            <Link
              href="/#about-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-950 transition-colors"
            >
              {t('our_story')}
            </Link>
            <Link
              href="/#shop-the-look"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-950 transition-colors"
            >
              {t('shop_the_look')}
            </Link>
            <Link
              href="/#location"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-950 transition-colors"
            >
              {t('visit_us')}
            </Link>
            <a
              href="tel:+995599123456"
              className="inline-flex items-center gap-2 justify-center bg-neutral-950 text-white py-3 rounded-xl mt-2 hover:bg-neutral-900 transition-colors"
            >
              <Icon name="PhoneIcon" size={14} />
              {t('call_us')}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
