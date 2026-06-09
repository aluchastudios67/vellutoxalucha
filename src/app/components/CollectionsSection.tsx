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
        where: { 
          status: 'ACTIVE',
        },
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
        {/* Interactive part (filters, hover, cart, plus dynamic headers/footers) handled client-side */}
        <CollectionsClient 
          products={products as any} 
          categories={categories} 
          hideFilters={true} 
          limit={4} 
          showHeader={true} 
          showFooter={true} 
        />
      </div>
    </section>
  );
}
