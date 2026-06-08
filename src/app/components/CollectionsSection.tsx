// Server Component — no 'use client' directive
// Data is fetched at request time directly from Prisma.
// Gracefully returns empty data if database is not available (e.g. build time).

import { prisma } from '@/lib/prisma';
import CollectionsClient from './CollectionsClient';

// Force server-side rendering — never pre-render at build time
export const dynamic = 'force-dynamic';

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
  } catch {
    // Database not available at build time — return empty state
    return { categories: [], products: [] };
  }
}

export default async function CollectionsSection() {
  const { categories, products } = await getCollectionsData();

  return (
    <section id="collections" className="py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-neutral-400">
            Curated Collections
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900">
            The Collection
          </h2>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-xl mx-auto">
            Carefully selected statement pieces from our latest season, photographed as worn.
          </p>
        </div>

        {/* Interactive part (filters, hover, cart) handled client-side */}
        <CollectionsClient products={products as any} categories={categories} />
      </div>
    </section>
  );
}
