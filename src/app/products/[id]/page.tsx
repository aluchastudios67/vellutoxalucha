import React from 'react';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import MiniCart from '@/components/MiniCart';
import Footer from '@/components/Footer';
import ProductDetailsClient from './ProductDetailsClient';
import { prisma } from '@/lib/prisma';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { isFeatured: 'desc' }
      },
      variants: true
    }
  });
  return product;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="relative min-h-screen text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-950 flex flex-col justify-between" style={{ background: '#faf9f7' }}>
      <div>
        {/* Navigation Header */}
        <Navigation />

        {/* Cart Drawer */}
        <MiniCart />

        {/* Product Details Wrapper */}
        <main className="pt-28 pb-20">
          <ProductDetailsClient product={product as any} />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
