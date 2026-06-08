import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Noto_Serif_Georgian, Noto_Sans_Georgian } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import '../styles/tailwind.css';

const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ['georgian', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Velluto — Luxury Fashion Store',
  description:
    'Exclusive hand-crafted apparel and premium fashion designs. Elevate your style with Velluto.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
  },
  openGraph: {
    title: 'Velluto — Luxury Fashion Store',
    description: 'Exclusive hand-crafted apparel and premium fashion designs.',
    images: [{ url: '/assets/images/logowithbg.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${notoSerifGeorgian.variable} ${notoSansGeorgian.variable}`}>
      <body className={notoSansGeorgian.className}>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
