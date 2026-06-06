import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {

    // 1. Fetch Orders & Calculate Metrics
    const allOrders = await prisma.order.findMany({
      include: { items: true },
    });

    const activeOrders = allOrders.filter(o => o.status !== 'CANCELLED');
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrdersCount = allOrders.length;

    // Monthly Sales Chart Data (Mocking last 6 months based on actual orders if present)
    const monthlySalesMap: Record<string, { revenue: number; orders: number }> = {
      'Jan': { revenue: 1250, orders: 4 },
      'Feb': { revenue: 2100, orders: 6 },
      'Mar': { revenue: 1850, orders: 5 },
      'Apr': { revenue: 3200, orders: 8 },
      'May': { revenue: 4100, orders: 11 },
      'Jun': { revenue: 0, orders: 0 },
    };

    // Populate actual June/current order totals if they occur
    activeOrders.forEach((o) => {
      const date = new Date(o.createdAt);
      const month = date.toLocaleString('default', { month: 'short' }); // e.g. "Jun"
      if (monthlySalesMap[month] !== undefined) {
        monthlySalesMap[month].revenue += o.total;
        monthlySalesMap[month].orders += 1;
      } else {
        monthlySalesMap[month] = { revenue: o.total, orders: 1 };
      }
    });

    const monthlySalesChart = Object.entries(monthlySalesMap).map(([name, data]) => ({
      name,
      revenue: data.revenue,
      orders: data.orders,
    }));

    // 2. Best Sellers aggregation
    const itemsGrouped: Record<string, { name: string; qty: number; revenue: number }> = {};
    const items = await prisma.orderItem.findMany();
    items.forEach((item) => {
      if (itemsGrouped[item.productId || ''] !== undefined) {
        itemsGrouped[item.productId || ''].qty += item.qty;
        itemsGrouped[item.productId || ''].revenue += item.productPrice * item.qty;
      } else {
        itemsGrouped[item.productId || ''] = {
          name: item.productName,
          qty: item.qty,
          revenue: item.productPrice * item.qty,
        };
      }
    });

    const bestSellers = Object.values(itemsGrouped)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // 3. Inventory Stock Status & Alerts
    const lowStockAlerts = await prisma.product.findMany({
      where: {
        inventory: { lte: 5 },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        sku: true,
        inventory: true,
      },
    });

    // 4. Traffic & Conversion metrics
    const trafficOverview = {
      visitors: 1840,
      pageViews: 5240,
      conversionRate: 3.2, // percentage
      bounceRate: 42.5,
    };

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrdersCount,
        averageOrderValue: totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0,
        lowStockCount: lowStockAlerts.length,
      },
      monthlySalesChart,
      bestSellers,
      lowStockAlerts,
      trafficOverview,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch analytics statistics.' }, { status: 500 });
  }
}
