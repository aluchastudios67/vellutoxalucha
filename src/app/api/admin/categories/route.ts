import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const FALLBACK_CATEGORIES = [
  {
    id: "53ca6f72-110b-40a2-8afb-656564fba44a",
    name: "Rings",
    nameKa: "ბეჭდები",
    nameRu: "Кольца",
    slug: "rings",
    _count: { products: 0 }
  },
  {
    id: "43a1484f-be9e-467f-a567-20bee0a4afd6",
    name: "Necklaces",
    nameKa: "ყელსაბამები",
    nameRu: "Колье",
    slug: "necklaces",
    _count: { products: 0 }
  },
  {
    id: "c3fa539d-fdc3-48f4-9c8d-e59e36127f63",
    name: "Bracelets",
    nameKa: "სამაჯურები",
    nameRu: "Браслеты",
    slug: "bracelets",
    _count: { products: 0 }
  },
  {
    id: "bf5361cf-faa7-4820-a06b-d43dc572f5a7",
    name: "Earrings",
    nameKa: "საყურეები",
    nameRu: "Серьги",
    slug: "earrings",
    _count: { products: 0 }
  },
  {
    id: "d79be4df-5706-42bc-98ec-214607a9dd53",
    name: "Dresses",
    nameKa: "კაბები",
    nameRu: "Платья",
    slug: "dresses",
    _count: { products: 0 }
  },
  {
    id: "a9b0628d-1b78-49fa-8261-0dd883b3d518",
    name: "Suits & Co-ords",
    nameKa: "კოსტუმები",
    nameRu: "Костюмы",
    slug: "suits-and-coords",
    _count: { products: 0 }
  },
  {
    id: "00794e01-5c9a-48cd-9b59-2137295c8aa4",
    name: "Knitwear",
    nameKa: "ნაქსოვი",
    nameRu: "Трикотаж",
    slug: "knitwear",
    _count: { products: 0 }
  },
  {
    id: "9d5242da-0d24-42ca-a494-037f995d39f1",
    name: "Tops & Blouses",
    nameKa: "ბლუზები",
    nameRu: "Бლუზები", // Keep consistent
    slug: "tops-and-blouses",
    _count: { products: 0 }
  },
  {
    id: "3a56516c-1787-4928-aed3-084fecde684e",
    name: "Outerwear",
    nameKa: "გარეთა ტანსაცმელი",
    nameRu: "Верхняя одежда",
    slug: "outerwear",
    _count: { products: 0 }
  },
  {
    id: "eae856de-5a4c-4dbf-a5c3-873471ce5c48",
    name: "Accessories",
    nameKa: "აქსესუარები",
    nameRu: "Аксессуары",
    slug: "accessories",
    _count: { products: 0 }
  }
];

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
    console.error('Failed to fetch admin categories, returning fallback:', e);
    return NextResponse.json(FALLBACK_CATEGORIES);
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
    }).catch((err: any) => console.warn('Audit log write failed (non-critical):', err));

    return NextResponse.json(category);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  }
}
