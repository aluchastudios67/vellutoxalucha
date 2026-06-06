import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    // Load original product with relations
    const original = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: true,
      },
    });

    if (!original) {
      return NextResponse.json({ error: 'Original product not found.' }, { status: 404 });
    }

    const uniqueStamp = Date.now().toString().slice(-4);
    const newId = `${original.id}-copy-${uniqueStamp}`;
    const newSku = `${original.sku}-COPY-${uniqueStamp}`;

    const duplicatedProduct = await prisma.product.create({
      data: {
        id: newId,
        name: `${original.name} (Copy)`,
        nameKa: `${original.nameKa} (ასლი)`,
        nameRu: `${original.nameRu} (Копия)`,
        description: original.description,
        descriptionKa: original.descriptionKa,
        descriptionRu: original.descriptionRu,
        price: original.price,
        sku: newSku,
        inventory: original.inventory,
        status: 'DRAFT', // Set to draft status initially
        tag: original.tag,
        rating: original.rating,
        categoryId: original.categoryId,
        seoTitle: original.seoTitle ? `${original.seoTitle} (Copy)` : null,
        seoDescription: original.seoDescription,
        images: {
          create: original.images.map((img) => ({
            url: img.url,
            isFeatured: img.isFeatured,
          })),
        },
        variants: {
          create: original.variants.map((v) => ({
            sku: `${v.sku}-COPY-${uniqueStamp}`,
            size: v.size,
            color: v.color,
            metal: v.metal,
            stock: v.stock,
            priceAdjustment: v.priceAdjustment,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DUPLICATE_PRODUCT',
        details: `Duplicated product ${original.name} to ${duplicatedProduct.name}`,
      },
    });

    return NextResponse.json(duplicatedProduct);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to duplicate product.' }, { status: 500 });
  }
}
