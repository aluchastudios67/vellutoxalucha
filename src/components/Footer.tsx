'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/assets/images/app_logo.png"
              alt="Velluto"
              className="h-36 w-auto object-contain invert -my-10"
            />
          </Link>
          <p className="text-sm max-w-sm text-neutral-400 leading-relaxed pt-2">
            {t('footer_desc')}
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-full transition-colors"
              aria-label="Facebook"
            >
              <Icon name="FacebookIcon" size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Icon name="InstagramIcon" size={18} />
            </a>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">{t('collections')}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#new-arrivals" className="hover:text-white transition-colors">
                {t('collections')}
              </a>
            </li>
            <li>
              <a href="#about-us" className="hover:text-white transition-colors">
                {t('our_story')}
              </a>
            </li>
            <li>
              <a href="#shop-the-look" className="hover:text-white transition-colors">
                {t('shop_the_look')}
              </a>
            </li>
            <li>
              <a href="#location" className="hover:text-white transition-colors">
                {t('visit_us')}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact details */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">{t('visit_us')}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Icon name="MapPinIcon" size={16} className="text-neutral-500" />
              <span>{t('address_value')}</span>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="PhoneIcon" size={16} className="text-neutral-500" />
              <a href="tel:+995599123456" className="hover:text-white transition-colors">
                +995 599 12 34 56
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="MailIcon" size={16} className="text-neutral-500" />
              <a href="mailto:hello@velluto.ge" className="hover:text-white transition-colors">
                hello@velluto.ge
              </a>
            </li>
            <li className="flex items-center gap-3 text-xs text-neutral-500">
              <Icon name="ClockIcon" size={16} className="text-neutral-600" />
              <span>{t('hours_value')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-900 text-center text-xs text-neutral-600">
        <p>© {new Date().getFullYear()} Velluto. {t('footer_copyright')}</p>
      </div>
    </footer>
  );
}
