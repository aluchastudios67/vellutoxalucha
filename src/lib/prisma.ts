import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function rewriteDatabaseUrl(url: string): string {
  if (!url) return url;
  try {
    if (url.includes('supabase.co') || url.includes('supabase.com')) {
      let rewritten = url;
      // Case 1: Contains port 5432, replace with 6543
      if (rewritten.includes(':5432')) {
        rewritten = rewritten.replace(':5432', ':6543');
      }
      // Case 2: No port specified (e.g., @db.xxxx.supabase.co/postgres)
      else if (!rewritten.includes(':6543')) {
        const atIdx = rewritten.indexOf('@');
        if (atIdx !== -1) {
          const pathStart = rewritten.indexOf('/', atIdx);
          const queryStart = rewritten.indexOf('?', atIdx);
          const endIdx = pathStart !== -1 ? pathStart : (queryStart !== -1 ? queryStart : rewritten.length);
          const hostPart = rewritten.substring(atIdx + 1, endIdx);
          if (!hostPart.includes(':')) {
            rewritten = rewritten.substring(0, endIdx) + ':6543' + rewritten.substring(endIdx);
          }
        }
      }

      // Ensure pgbouncer=true is appended for pooled connections
      if (rewritten.includes(':6543') && !rewritten.includes('pgbouncer=true')) {
        const sep = rewritten.includes('?') ? '&' : '?';
        rewritten = rewritten + sep + 'pgbouncer=true';
      }
      return rewritten;
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

