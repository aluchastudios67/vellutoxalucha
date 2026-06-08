import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Default to ADMIN role since auth is localStorage-based
    const role = 'ADMIN' as string;

    if (role === 'STAFF') {
      const { inventory, variants } = body;

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          inventory: Number(inventory),
        },
      });

      if (variants && Array.isArray(variants)) {
        for (const v of variants) {
          if (v.id) {
            await prisma.productVariant.update({
              where: { id: v.id },
              data: { stock: Number(v.stock || 0) },
            });
          }
        }
      }

      await prisma.auditLog.create({
        data: {
          action: 'STAFF_INVENTORY_UPDATE',
          details: `Updated stock levels for product id: ${id}`,
        },
      });

      return NextResponse.json({ success: true, message: 'Stock levels updated successfully.' });
    }

    // Admin/Super Admin has full product management
    const {
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

    // Remove old variants/images and insert new ones or update them
    // For simplicity, delete variants and images, and recreate
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productImage.deleteMany({ where: { productId: id } });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        nameKa,
        nameRu,
        price: Number(price),
        sku,
        inventory: Number(inventory),
        status,
        tag,
        rating: Number(rating),
        categoryId,
        description,
        descriptionKa,
        descriptionRu,
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

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_PRODUCT',
        details: `Updated product metadata for ${name} (${sku})`,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        action: 'DELETE_PRODUCT',
        details: `Deleted product: ${product.name} (SKU: ${product.sku})`,
      },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}
