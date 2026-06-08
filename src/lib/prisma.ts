import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function buildDatabaseUrl() {
  const base = process.env.DATABASE_URL || 'postgresql://postgres:TavaTanaTikiTaka99@db.tqahugftssvxudwwdnkn.supabase.co:6543/postgres?pgbouncer=true';
  // Avoid appending duplicate params if already present
  const separator = base.includes('?') ? '&' : '?';
  return base + separator + 'connection_limit=1';
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
