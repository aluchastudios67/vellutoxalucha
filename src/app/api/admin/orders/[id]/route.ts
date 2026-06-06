import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
        coupon: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch order details.' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const body = await req.json();
    const { status, paymentStatus, deliveryDate, deliveryTime, address, customerName, phone } = body;

    const currentOrder = await prisma.order.findUnique({ where: { id } });
    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        paymentStatus,
        deliveryDate,
        deliveryTime,
        address,
        customerName,
        phone,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_ORDER',
        details: `Updated order ${id}: Status=${status}, PaymentStatus=${paymentStatus}`,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}
