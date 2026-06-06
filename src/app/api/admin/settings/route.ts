import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'src', 'styles', 'settings_config.json');

const DEFAULT_SETTINGS = {
  storeName: 'Velluto Luxury Store',
  contactEmail: 'boutique@velluto.com',
  contactPhone: '+995 599 12 34 56',
  address: 'Vardisubani, Tbilisi, Georgia',
  socialLinks: {
    instagram: 'https://www.instagram.com/velluto_____/',
    facebook: 'https://facebook.com/velluto',
    pinterest: 'https://pinterest.com/velluto'
  },
  shipping: {
    tbilisiRate: 0, // free
    regionalRate: 15,
    minFreeShipping: 300
  },
  tax: {
    vatRate: 18, // 18% in Georgia
    isTaxIncluded: true
  },
  payments: {
    bankTransfer: true,
    cashOnDelivery: true,
    cardOnDelivery: true,
    bankDetails: 'TBC Bank: GE82TB77364525374839'
  }
};

export async function GET() {
  try {
    let settings = DEFAULT_SETTINGS;
    if (fs.existsSync(SETTINGS_PATH)) {
      settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
    }
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read settings.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Only Super Admin can edit store settings.' }, { status: 403 });
    }

    const settings = await req.json();

    const dirPath = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_SETTINGS',
        details: 'Updated global store shipping, tax, payment parameters.',
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update store settings.' }, { status: 500 });
  }
}
