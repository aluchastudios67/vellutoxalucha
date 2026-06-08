import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function buildDatabaseUrl() {
  const base = process.env.DATABASE_URL ?? '';
  // Avoid appending duplicate params if already present
  const separator = base.includes('?') ? '&' : '?';
  return base + separator + 'connection_limit=10&pool_timeout=20&connect_timeout=15';
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: { url: buildDatabaseUrl() },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
