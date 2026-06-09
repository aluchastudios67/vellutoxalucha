const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.tqahugftssvxudwwdnkn:TavaTanaTikiTaka99@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    }
  }
});
async function main() {
  try {
    const cats = await prisma.category.count();
    console.log('Success!', cats);
  } catch (e) {
    console.error('Failed with new URL format', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
