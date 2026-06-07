import React from 'react';
import Navigation from '@/components/Navigation';
import MiniCart from '@/components/MiniCart';
import HeroSection from '@/app/components/HeroSection';
import EditorialIntro from '@/app/components/EditorialIntro';
import EditorialStrip from '@/app/components/EditorialStrip';
import NewArrivals from '@/app/components/NewArrivals';
import CollectionsSection from '@/app/components/CollectionsSection';
import ShopTheLook from '@/app/components/ShopTheLook';
import LocationStrip from '@/app/components/LocationStrip';
import InstagramGallery from '@/app/components/InstagramGallery';
import Footer from '@/components/Footer';

// Force SSR — CollectionsSection fetches live product data from the database
export const dynamic = 'force-dynamic';


export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Navigation Header */}
      <Navigation />

      {/* Cart Drawer */}
      <MiniCart />

      {/* Hero Section */}
      <main>
        <HeroSection />

        {/* Editorial Story Narrative */}
        <EditorialIntro />

        {/* Dynamic Video & Brand Statement Strip */}
        <EditorialStrip />

        {/* Full Collections with category filter */}
        <CollectionsSection />

        {/* New Arrivals spotlight */}
        <NewArrivals />

        {/* Interactive Lookbook */}
        <ShopTheLook />

        {/* Instagram Post Showcase */}
        <InstagramGallery />

        {/* Boutique Location and Hours */}
        <LocationStrip />
      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
