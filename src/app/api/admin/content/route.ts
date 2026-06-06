import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'styles', 'content_config.json');

const DEFAULT_CONFIG = {
  hero: {
    title: 'VELLUTO',
    subtitle: 'The Art of Fine Craftsmanship',
    description: 'Discover curated collections of timeless gold and diamond jewelry designed to complement your elegance.',
  },
  promoBanner: {
    text: 'Complimentary shipping across Tbilisi on all orders above 300 GEL',
    isActive: true,
  },
  testimonials: [
    { name: 'Sophie M.', role: 'Collector', text: 'Velluto rings possess an architectural weight that I have not found anywhere else. Pure poetry.' },
    { name: 'David K.', role: 'Artist', text: 'The faceted bracelet catches the light unlike any jewelry piece I own. Sublime design.' }
  ],
  faqs: [
    { q: 'Where are your pieces crafted?', a: 'All Velluto jewelry is handcrafted at our private design workshop in Tbilisi, Georgia.' },
    { q: 'Do you offer custom engravings?', a: 'Yes, we offer complimentary custom laser or hand engraving on all bands and signet rings.' }
  ]
};

export async function GET() {
  try {
    let config = DEFAULT_CONFIG;
    if (fs.existsSync(CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }

    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ config, blogPosts });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch content.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { config, newBlogPost } = body;

    // 1. Update Homepage Config JSON
    if (config) {
      const dirPath = path.dirname(CONFIG_PATH);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    }

    // 2. Add New Blog Post if provided
    if (newBlogPost) {
      const { title, titleKa, titleRu, content, contentKa, contentRu, slug, image } = newBlogPost;
      if (!title || !content || !slug) {
        return NextResponse.json({ error: 'Missing blog parameters.' }, { status: 400 });
      }

      // Get default author (super admin)
      const defaultAuthor = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
      if (!defaultAuthor) {
        return NextResponse.json({ error: 'No admin user found to assign as author.' }, { status: 500 });
      }

      await prisma.blogPost.create({
        data: {
          title,
          titleKa: titleKa || title,
          titleRu: titleRu || title,
          content,
          contentKa: contentKa || content,
          contentRu: contentRu || content,
          slug,
          image: image || '/assets/images/no_image.png',
          status: 'PUBLISHED',
          authorId: defaultAuthor.id,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_CONTENT',
        details: 'Updated storefront landing configurations or posted a blog entry.',
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update content.' }, { status: 500 });
  }
}
