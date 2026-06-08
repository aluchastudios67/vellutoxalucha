import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Revalidate at most every 2 minutes at the CDN level
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category') || '';

    const whereClause: any = { status: 'ACTIVE' };
    if (categorySlug && categorySlug !== 'All') {
      whereClause.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
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
        // Only pull the featured image — avoids loading all images per product
        images: { where: { isFeatured: true }, take: 1, select: { url: true, isFeatured: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const response = NextResponse.json(products);
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    return response;
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}
