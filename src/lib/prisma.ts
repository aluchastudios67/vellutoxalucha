import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function rewriteDatabaseUrl(url: string): string {
  if (!url) return url;
  try {
    if (url.includes('tqahugftssvxudwwdnkn')) {
      const match = url.match(/^(postgres|postgresql):\/\/([^:]+):([^@]+)@/);
      if (match) {
        const password = match[3];
        return `postgresql://postgres.tqahugftssvxudwwdnkn:${password}@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;
      }
    }
  } catch (err) {
    console.error('Error rewriting DATABASE_URL:', err);
  }
  return url;
}

function buildDatabaseUrl() {
  const base = process.env.DATABASE_URL || 'postgresql://postgres:TavaTanaTikiTaka99@db.tqahugftssvxudwwdnkn.supabase.co:6543/postgres?pgbouncer=true';
  const rewritten = rewriteDatabaseUrl(base);
  const separator = rewritten.includes('?') ? '&' : '?';
  return rewritten.includes('connection_limit=') ? rewritten : rewritten + separator + 'connection_limit=1';
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

