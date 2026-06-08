import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
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

    if (
      !customerName ||
      !phone ||
      !address ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !total
    ) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    // Generate order ID
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // ── Run the entire order creation atomically in a single transaction ─────
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Upsert customer by phone (replaces find + conditional create/update)
      const customer = await tx.customer.upsert({
        where: { phone },
        create: { name: customerName, phone, address, segment: 'New' },
        update: { address },
      });

      // 2. Validate & increment coupon usage
      let couponId: string | null = null;
      if (couponCode) {
        const dbCoupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase().trim() },
        });
        if (dbCoupon?.isActive) {
          couponId = dbCoupon.id;
          await tx.coupon.update({
            where: { id: dbCoupon.id },
            data: { usageCount: { increment: 1 } },
          });
        }
      }

      // 3. Create the order
      const order = await tx.order.create({
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

      // 4. Batch-insert all order items in one query (was serial N inserts)
      await tx.orderItem.createMany({
        data: items.map((item: any) => ({
          orderId: order.id,
          productId: item.id ?? null,
          productName: item.name,
          productPrice: Number(item.price),
          qty: Number(item.qty),
          variantSelected: item.variantSelected ?? null,
        })),
      });

      // 5. Batch-decrement inventory — all in parallel, still inside transaction
      await Promise.all(
        items
          .filter((item: any) => item.id)
          .map((item: any) =>
            tx.product.update({
              where: { id: item.id },
              data: { inventory: { decrement: Number(item.qty) } },
            })
          )
      );

      // 6. Create system notification
      await tx.notification.create({
        data: {
          title: 'New Storefront Order',
          message: `${customerName} placed order ${order.id} for ${total} GEL.`,
          type: 'ORDER',
        },
      });

      return order;
    });

    return NextResponse.json(newOrder);
  } catch (e: any) {
    console.error('[orders POST]', e);
    return NextResponse.json({ error: e.message || 'Failed to create order.' }, { status: 500 });
  }
}
