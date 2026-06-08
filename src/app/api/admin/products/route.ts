import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      nameKa,
      nameRu,
      price,
      sku,
      inventory,
      status,
      tag,
      rating,
      categoryId,
      description,
      descriptionKa,
      descriptionRu,
      seoTitle,
      seoDescription,
      images,
      variants,
    } = body;

    if (!id || !name || !nameKa || !nameRu || !price || !sku || !categoryId) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    // Check duplicate SKU
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return NextResponse.json({ error: 'SKU code already exists.' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        id,
        name,
        nameKa,
        nameRu,
        price: Number(price),
        sku,
        inventory: Number(inventory || 0),
        status: status || 'ACTIVE',
        tag,
        rating: Number(rating || 5),
        categoryId,
        description: description || '',
        descriptionKa: descriptionKa || '',
        descriptionRu: descriptionRu || '',
        seoTitle,
        seoDescription,
        images: {
          create:
            images?.map((url: string, idx: number) => ({
              url,
              isFeatured: idx === 0,
            })) || [],
        },
        variants: {
          create:
            variants?.map((v: any) => ({
              sku: v.sku,
              size: v.size,
              color: v.color,
              metal: v.metal,
              stock: Number(v.stock || 0),
              priceAdjustment: Number(v.priceAdjustment || 0),
            })) || [],
        },
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_PRODUCT',
        details: `Created product catalog item ${name} (${sku})`,
      },
    });

    return NextResponse.json(newProduct);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create product.' }, { status: 500 });
  }
}
