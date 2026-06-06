import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(coupons);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch coupons.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { code, discountType, discountValue, expiresAt, isActive, usageLimit } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const formattedCode = code.toUpperCase().trim();

    // Check duplicate
    const existing = await prisma.coupon.findUnique({ where: { code: formattedCode } });
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists.' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: formattedCode,
        discountType,
        discountValue: Number(discountValue),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== undefined ? isActive : true,
        usageLimit: usageLimit ? Number(usageLimit) : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_COUPON',
        details: `Created coupon code: ${formattedCode}`,
      },
    });

    return NextResponse.json(coupon);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create coupon.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {

    const { id, isActive } = await req.json();

    const coupon = await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });

    await prisma.auditLog.create({
      data: {
        action: 'TOGGLE_COUPON',
        details: `Toggled coupon ${coupon.code} active state to ${isActive}`,
      },
    });

    return NextResponse.json(coupon);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle coupon.' }, { status: 500 });
  }
}
