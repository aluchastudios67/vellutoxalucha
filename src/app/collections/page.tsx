import React from 'react';
import Navigation from '@/components/Navigation';
import MiniCart from '@/components/MiniCart';
import Footer from '@/components/Footer';
import CollectionsClient from '@/app/components/CollectionsClient';

// Ensure the client is created properly for SSR. Ideally imported from a dedicated lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for server-side read, or anon key if RLS allows
);

export const revalidate = 30;

async function getCollectionsData() {
  try {
    // Promise.all enforces concurrent execution of independent DB requests
    const [categoriesResult, productsResult] = await Promise.all([
      supabase
        .from('Category')
        .select('id, name, nameKa, nameRu, slug')
        .order('name', { ascending: true }),
      supabase
        .from('Product')
        // PostgREST Aliasing avoids O(N) Array.map computations on the server
        .select(`
          id, name, nameKa, nameRu, price, tag, description, descriptionKa, descriptionRu,
          category:Category!inner(id, name, nameKa, nameRu, slug),
          images:ProductImage(url, isFeatured),
          variants:ProductVariant(size, color, stock)
        `)
        .eq('status', 'ACTIVE')
        .order('createdAt', { ascending: false }),
    ]);

    if (categoriesResult.error) throw categoriesResult.error;
    if (productsResult.error) throw productsResult.error;

    return { 
      categories: categoriesResult.data, 
      products: productsResult.data 
    };
  } catch (error) {
    console.error("Supabase error in getCollectionsData:", error);
    return { categories: [], products: [] };
  }
}

export default async function CollectionsPage() {
  const { categories, products } = await getCollectionsData();

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-950 animate-in fade-in duration-1000 ease-out">
      <Navigation />
      <MiniCart />
      
      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
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

          <CollectionsClient products={products as any} categories={categories as any} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
