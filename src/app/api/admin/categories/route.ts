import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, nameKa, nameRu } = await req.json();

    if (!name || !nameKa || !nameRu) {
      return NextResponse.json(
        { error: 'Missing required translation parameters.' },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check duplicate
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists.' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, nameKa, nameRu, slug },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_CATEGORY',
        details: `Created category: ${name}`,
      },
    });

    return NextResponse.json(category);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  }
}
