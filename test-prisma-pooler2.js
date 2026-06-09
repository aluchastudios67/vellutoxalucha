const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:TavaTanaTikiTaka99@db.tqahugftssvxudwwdnkn.supabase.co:6543/postgres?pgbouncer=true'
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
