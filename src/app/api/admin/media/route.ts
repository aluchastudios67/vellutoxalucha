import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'media';

export async function GET() {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) throw error;

    const mediaItems = data.map((file, idx) => {
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
      
      return {
        id: file.id || `media-${idx}`,
        name: file.name,
        url: publicUrlData.publicUrl,
        size: Math.round((file.metadata?.size || 0) / 1024), // in KB
        mimeType: file.metadata?.mimetype || 'application/octet-stream',
        createdAt: file.created_at,
        folder: file.name.startsWith('SnapInsta') ? 'Instagram' : 'Store Branding',
      };
    }).filter(file => file.name !== '.emptyFolderPlaceholder'); // supabase sometimes creates these

    return NextResponse.json(mediaItems);
  } catch (e: any) {
    console.error('Error fetching media:', e);
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
    let buffer = Buffer.from(bytes);

    // Clean file name and ensure unique
    const ext = path.extname(file.name);
    let cleanName = file.name.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now() + ext;

    // Check size and compress if needed (3MB = 3 * 1024 * 1024 bytes)
    const MAX_SIZE = 3 * 1024 * 1024;
    let mimeType = file.type;

    if (buffer.length > MAX_SIZE && mimeType.startsWith('image/')) {
      // Compress with sharp
      buffer = await sharp(buffer)
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer() as any;
        
      mimeType = 'image/jpeg';
      cleanName = cleanName.replace(ext, '.jpg'); // Change extension if we converted to JPEG
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(cleanName, buffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(cleanName);

    return NextResponse.json({
      success: true,
      id: `media-${Date.now()}`,
      name: cleanName,
      url: publicUrlData.publicUrl,
      size: Math.round(buffer.length / 1024),
      mimeType: mimeType,
      createdAt: new Date(),
    });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Failed to upload media item.' }, { status: 500 });
  }
}
