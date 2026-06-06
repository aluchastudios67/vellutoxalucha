import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            total: true,
            createdAt: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute stats per customer
    const formattedCustomers = customers.map((c) => {
      const successfulOrders = c.orders.filter(o => o.status !== 'CANCELLED');
      const totalSpent = successfulOrders.reduce((sum, o) => sum + o.total, 0);
      const ordersCount = c.orders.length;

      return {
        id: c.id,
        name: c.name,
        email: c.email || '—',
        phone: c.phone,
        address: c.address,
        notes: c.notes || '',
        segment: c.segment,
        ordersCount,
        totalSpent,
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json(formattedCustomers);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch customers.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { id, notes, segment } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing customer ID.' }, { status: 400 });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        notes,
        segment,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_CUSTOMER_PROFILE',
        details: `Updated notes/segment for customer: ${updatedCustomer.name}`,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update customer.' }, { status: 500 });
  }
}
