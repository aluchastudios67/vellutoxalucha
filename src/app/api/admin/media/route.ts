import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const MEDIA_DIR = path.join(process.cwd(), 'public', 'assets', 'images');

export async function GET() {
  try {
    if (!fs.existsSync(MEDIA_DIR)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(MEDIA_DIR);
    const mediaItems = files
      .filter((file) => {
        // filter images and videos
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4'].includes(ext);
      })
      .map((file, idx) => {
        const filePath = path.join(MEDIA_DIR, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();

        return {
          id: `media-${idx}`,
          name: file,
          url: `/assets/images/${file}`,
          size: Math.round(stats.size / 1024), // in KB
          mimeType: ext === '.mp4' ? 'video/mp4' : `image/${ext.replace('.', '')}`,
          createdAt: stats.birthtime,
          folder: file.startsWith('SnapInsta') ? 'Instagram' : 'Store Branding',
        };
      });

    return NextResponse.json(mediaItems);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read media library.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean file name
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const destinationPath = path.join(MEDIA_DIR, cleanName);

    // Write file to assets directory
    fs.writeFileSync(destinationPath, buffer);

    return NextResponse.json({
      success: true,
      id: `media-${Date.now()}`,
      name: cleanName,
      url: `/assets/images/${cleanName}`,
      size: Math.round(file.size / 1024),
      mimeType: file.type,
      createdAt: new Date(),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to upload media item.' }, { status: 500 });
  }
}
