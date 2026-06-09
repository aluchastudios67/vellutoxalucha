const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const categories = await prisma.category.findMany();
  console.log('Categories in Supabase:', categories.map(c => c.name));
  
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'global' } });
  console.log('Hero Images in Supabase:', settings ? settings.data.heroImages : 'No settings');
}
main().finally(() => prisma.$disconnect());
