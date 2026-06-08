import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ── 1. Core metrics — run all three queries in parallel ──────────────────
    const [orderAggregates, lowStockAlerts, bestSellersRaw] = await Promise.all([
      // Total revenue + order count (single aggregate, no JS loop needed)
      prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { total: true },
        _count: { id: true },
      }),

      // Low-stock products (only active ones, only fields we need)
      prisma.product.findMany({
        where: { inventory: { lte: 5 }, status: 'ACTIVE' },
        select: { id: true, name: true, sku: true, inventory: true },
        orderBy: { inventory: 'asc' },
      }),

      // Best sellers via groupBy on OrderItems — DB does the heavy lifting
      prisma.orderItem.groupBy({
        by: ['productId', 'productName'],
        _sum: { qty: true, productPrice: true },
        orderBy: { _sum: { qty: 'desc' } },
        take: 5,
      }),
    ]);

    const totalRevenue = orderAggregates._sum.total ?? 0;
    const totalOrdersCount = orderAggregates._count.id;

    // ── 2. Monthly sales chart — real data, last 6 months ───────────────────
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyOrders = await prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: sixMonthsAgo },
      },
      select: { total: true, createdAt: true },
    });

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Build a map keyed by "YYYY-M" for the last 6 months
    const chartMap = new Map<string, { name: string; revenue: number; orders: number }>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      chartMap.set(key, { name: monthNames[d.getMonth()], revenue: 0, orders: 0 });
    }

    for (const order of monthlyOrders) {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const slot = chartMap.get(key);
      if (slot) {
        slot.revenue += order.total;
        slot.orders += 1;
      }
    }

    const monthlySalesChart = Array.from(chartMap.values());

    // ── 3. Format best sellers ───────────────────────────────────────────────
    const bestSellers = bestSellersRaw.map((row) => ({
      name: row.productName,
      qty: row._sum.qty ?? 0,
      revenue: (row._sum.productPrice ?? 0) * (row._sum.qty ?? 0),
    }));

    // ── 4. Response with cache headers (60s fresh, 5min stale-while-revalidate)
    const response = NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrdersCount,
        averageOrderValue: totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0,
        lowStockCount: lowStockAlerts.length,
      },
      monthlySalesChart,
      bestSellers,
      lowStockAlerts,
      trafficOverview: {
        visitors: 0,
        pageViews: 0,
        conversionRate: 0,
        bounceRate: 0,
      },
    });

    response.headers.set('Cache-Control', 'private, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (e) {
    console.error('[analytics] Failed to fetch analytics:', e);
    return NextResponse.json({ error: 'Failed to fetch analytics statistics.' }, { status: 500 });
  }
}
