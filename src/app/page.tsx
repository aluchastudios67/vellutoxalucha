import React from 'react';
import Navigation from '@/components/Navigation';
import MiniCart from '@/components/MiniCart';
import HeroSection from '@/app/components/HeroSection';
import EditorialIntro from '@/app/components/EditorialIntro';
import EditorialStrip from '@/app/components/EditorialStrip';
import NewArrivals from '@/app/components/NewArrivals';
import CollectionsSection from '@/app/components/CollectionsSection';
import ShopTheLook from '@/app/components/ShopTheLook';
// import LocationStrip from '@/app/components/LocationStrip';
import InstagramGallery from '@/app/components/InstagramGallery';
import Footer from '@/components/Footer';

import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const revalidate = 30;

async function getHomePageData() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        nameKa: true,
        nameRu: true,
        price: true,
        tag: true,
        rating: true,
        images: { select: { url: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const settingsPath = path.join(process.cwd(), 'src', 'styles', 'settings_config.json');
    let settings = null;
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    }

    return { products, settings };
  } catch (e) {
    return { products: [], settings: null };
  }
}

export default async function Home() {
  const { products, settings } = await getHomePageData();

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Navigation Header */}
      <Navigation />

      {/* Cart Drawer */}
      <MiniCart />

      {/* Hero Section */}
      <main>
        <HeroSection settings={settings} />

        {/* Editorial Story Narrative */}
        <EditorialIntro />

        {/* Dynamic Video & Brand Statement Strip */}
        <EditorialStrip />

        {/* Full Collections with category filter */}
        <CollectionsSection />

        {/* New Arrivals spotlight */}
        <NewArrivals products={products as any} />

        {/* Interactive Lookbook */}
        <ShopTheLook products={products as any} />

        {/* Instagram Post Showcase */}
        <InstagramGallery />

        {/* Boutique Location and Hours */}
        {/* <LocationStrip /> */}
      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
