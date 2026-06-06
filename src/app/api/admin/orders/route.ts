import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const payment = searchParams.get('payment') || '';

    const whereClause: any = {};
    if (status && status !== 'All') {
      whereClause.status = status;
    }
    if (payment && payment !== 'All') {
      whereClause.paymentMethod = payment;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
        customer: true,
        coupon: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      address,
      deliveryDate,
      deliveryTime,
      paymentMethod,
      notes,
      items,
      total,
      couponCode,
    } = body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0 || !total) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    // Generate numeric order ID (e.g. ORD-100204 format)
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Manage Customer Profile (Match by Phone)
    let customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone,
          address,
          segment: 'New',
        },
      });
    } else {
      // Update customer address if it changed
      await prisma.customer.update({
        where: { id: customer.id },
        data: { address },
      });
    }

    // 2. Coupon Validation
    let couponId = null;
    if (couponCode) {
      const dbCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (dbCoupon && dbCoupon.isActive) {
        couponId = dbCoupon.id;
        await prisma.coupon.update({
          where: { id: dbCoupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    // 3. Create Order
    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        customerName,
        phone,
        address,
        deliveryDate,
        deliveryTime,
        paymentMethod,
        notes,
        total: Number(total),
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        customerId: customer.id,
        couponId,
      },
    });

    // 4. Create OrderItems and Deduct Inventory
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.id,
          productName: item.name,
          productPrice: Number(item.price),
          qty: Number(item.qty),
          variantSelected: item.variantSelected || null,
        },
      });

      // Deduct inventory from general product stock
      try {
        await prisma.product.update({
          where: { id: item.id },
          data: {
            inventory: { decrement: Number(item.qty) },
          },
        });
      } catch (err) {
        console.error(`Failed to decrement product stock for ${item.id}`);
      }
    }

    // 5. Create System Notification
    await prisma.notification.create({
      data: {
        title: 'New Storefront Order',
        message: `${customerName} placed order ${orderId} total ${total} GEL.`,
        type: 'ORDER',
      },
    });

    return NextResponse.json(newOrder);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create order.' }, { status: 500 });
  }
}
