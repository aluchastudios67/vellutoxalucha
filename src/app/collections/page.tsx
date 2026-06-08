import React from 'react';
import Navigation from '@/components/Navigation';
import MiniCart from '@/components/MiniCart';
import Footer from '@/components/Footer';
import CollectionsClient from '@/app/components/CollectionsClient';
import { prisma } from '@/lib/prisma';

// Always server-rendered on demand — never prerendered at build time
export const revalidate = 30;

async function getCollectionsData() {
  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          nameKa: true,
          nameRu: true,
          price: true,
          tag: true,
          description: true,
          descriptionKa: true,
          descriptionRu: true,
          category: {
            select: { id: true, name: true, nameKa: true, nameRu: true, slug: true },
          },
          images: {
            select: { url: true, isFeatured: true },
          },
          variants: {
            select: { size: true, color: true, stock: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { categories, products };
  } catch (error) {
    console.error("Prisma error in getCollectionsData:", error);
    return { categories: [], products: [] };
  }
}

export default async function CollectionsPage() {
  const { categories, products } = await getCollectionsData();

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Navigation Header */}
      <Navigation />

      {/* Cart Drawer */}
      <MiniCart />

      {/* Collections Content */}
      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-neutral-400">
              Velluto Catalog
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900">
              Our Collections
            </h1>
            <p className="text-neutral-400 font-light text-sm sm:text-base max-w-xl mx-auto">
              Explore our handcrafted collections of premium garments and tailored clothing,
              designed for timeless elegance.
            </p>
          </div>

          {/* Interactive grid and filters */}
          <CollectionsClient products={products as any} categories={categories} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
