import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Always dynamic — queries the live database on each request
export const dynamic = 'force-dynamic';

export const FALLBACK_CATEGORIES = [
  {
    id: "53ca6f72-110b-40a2-8afb-656564fba44a",
    name: "Rings",
    nameKa: "ბეჭდები",
    nameRu: "Кольца",
    slug: "rings"
  },
  {
    id: "43a1484f-be9e-467f-a567-20bee0a4afd6",
    name: "Necklaces",
    nameKa: "ყელსაბამები",
    nameRu: "Колье",
    slug: "necklaces"
  },
  {
    id: "c3fa539d-fdc3-48f4-9c8d-e59e36127f63",
    name: "Bracelets",
    nameKa: "სამაჯურები",
    nameRu: "Браслеты",
    slug: "bracelets"
  },
  {
    id: "bf5361cf-faa7-4820-a06b-d43dc572f5a7",
    name: "Earrings",
    nameKa: "საყურეები",
    nameRu: "Серьги",
    slug: "earrings"
  },
  {
    id: "d79be4df-5706-42bc-98ec-214607a9dd53",
    name: "Dresses",
    nameKa: "კაბები",
    nameRu: "Платья",
    slug: "dresses"
  },
  {
    id: "a9b0628d-1b78-49fa-8261-0dd883b3d518",
    name: "Suits & Co-ords",
    nameKa: "კოსტუმები",
    nameRu: "Костюмы",
    slug: "suits-and-coords"
  },
  {
    id: "00794e01-5c9a-48cd-9b59-2137295c8aa4",
    name: "Knitwear",
    nameKa: "ნაქსოვი",
    nameRu: "Трикотаж",
    slug: "knitwear"
  },
  {
    id: "9d5242da-0d24-42ca-a494-037f995d39f1",
    name: "Tops & Blouses",
    nameKa: "ბლუზები",
    nameRu: "Блузки",
    slug: "tops-and-blouses"
  },
  {
    id: "3a56516c-1787-4928-aed3-084fecde684e",
    name: "Outerwear",
    nameKa: "გარეთა ტანსაცმელი",
    nameRu: "Верхняя одежда",
    slug: "outerwear"
  },
  {
    id: "eae856de-5a4c-4dbf-a5c3-873471ce5c48",
    name: "Accessories",
    nameKa: "აქსესუარები",
    nameRu: "Аксессуары",
    slug: "accessories"
  }
];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    const response = NextResponse.json(categories);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return response;
  } catch (e) {
    console.error('Failed to fetch categories from DB, returning fallback:', e);
    const response = NextResponse.json(FALLBACK_CATEGORIES);
    response.headers.set('Cache-Control', 'public, s-maxage=600');
    return response;
  }
}

