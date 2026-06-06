const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear database
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.mediaLibrary.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Hash Password
  const hashedPassword = bcrypt.hashSync('VellutoAdmin2026!', 10);

  // 3. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@velluto.com',
      password: hashedPassword,
      name: 'Elena Rostova',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@velluto.com',
      password: hashedPassword,
      name: 'Giorgi Kldiashvili',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@velluto.com',
      password: hashedPassword,
      name: 'Tamta Sharashidze',
      role: 'STAFF',
      status: 'ACTIVE',
    },
  });

  console.log('Admin users seeded.');

  // 4. Create Categories
  const rings = await prisma.category.create({
    data: { name: 'Rings', nameKa: 'ბეჭდები', nameRu: 'Кольца', slug: 'rings' },
  });

  const necklaces = await prisma.category.create({
    data: { name: 'Necklaces', nameKa: 'ყელსაბამები', nameRu: 'Колье', slug: 'necklaces' },
  });

  const bracelets = await prisma.category.create({
    data: { name: 'Bracelets', nameKa: 'სამაჯურები', nameRu: 'Браслеты', slug: 'bracelets' },
  });

  const earrings = await prisma.category.create({
    data: { name: 'Earrings', nameKa: 'საყურეები', nameRu: 'Серьги', slug: 'earrings' },
  });

  console.log('Categories seeded.');

  // 5. Create Products
  const p1 = await prisma.product.create({
    data: {
      id: 'velluto-1',
      name: 'Aura Gold Ring',
      nameKa: 'ოქროს ბეჭედი აურა',
      nameRu: 'Золотое кольцо Аура',
      description: 'An elegant 18k yellow gold signet ring featuring hand-engraved geometric lines and micro-facets.',
      descriptionKa: 'დახვეწილი 18-კარატიანი ყვითელი ოქროს ბეჭედი გეომეტრიული ფასეტებით.',
      descriptionRu: 'Элегантное печатное кольцо из 18-каратного желтого золота с ручной гравировкой.',
      price: 250,
      sku: 'VEL-RING-AURA-01',
      inventory: 12,
      status: 'ACTIVE',
      tag: 'New',
      rating: 5,
      categoryId: rings.id,
      seoTitle: 'Aura Gold Ring - Velluto Jewelry',
      seoDescription: 'Shop Aura Gold Ring, handcrafted 18k yellow gold signet ring from Velluto.',
    },
  });

  const p2 = await prisma.product.create({
    data: {
      id: 'velluto-2',
      name: 'Elegance Diamond Necklace',
      nameKa: 'ბრილიანტის ყელსაბამი',
      nameRu: 'Бриллиантовое колье Элегантность',
      description: 'Stunning VS1 diamond halo necklace suspended on an ultra-fine 18k white gold link chain.',
      descriptionKa: 'ბრილიანტის თვალისმომჭრელი ყელსაბამი 18-კარატიანი თეთრი ოქროს ფაქიზი ჯაჭვით.',
      descriptionRu: 'Потрясающее колье с бриллиантом VS1 на тонкой цепочке из белого золота 18 карат.',
      price: 680,
      sku: 'VEL-NECK-ELEG-02',
      inventory: 5,
      status: 'ACTIVE',
      tag: 'Popular',
      rating: 5,
      categoryId: necklaces.id,
    },
  });

  const p3 = await prisma.product.create({
    data: {
      id: 'velluto-3',
      name: 'Velluto Link Bracelet',
      nameKa: 'ოქროს სამაჯური',
      nameRu: 'Золотой браслет Velluto',
      description: 'Solid gold interlocking links structured to reflect light at every movement.',
      descriptionKa: 'ოქროს მასიური სამაჯური ურთიერთდაკავშირებული რგოლებით, რომელიც იმეორებს ხელის მოძრაობას.',
      descriptionRu: 'Массивный браслет из золота с переплетающимися звеньями.',
      price: 450,
      sku: 'VEL-BRAC-LINK-03',
      inventory: 8,
      status: 'ACTIVE',
      rating: 4,
      categoryId: bracelets.id,
    },
  });

  const p4 = await prisma.product.create({
    data: {
      id: 'velluto-4',
      name: 'Gleam Diamond Earrings',
      nameKa: 'ბრილიანტის საყურეები',
      nameRu: 'Бриллиантовые серьги Сияние',
      description: 'Elegant architectural diamond studs securely claw-set in solid 18k white gold.',
      descriptionKa: 'ბრილიანტის ელეგანტური საყურეები 18-კარატიან თეთრ ოქროში ჩასმული.',
      descriptionRu: 'Серьги-гвоздики с бриллиантами в оправе из белого золота 18 карат.',
      price: 520,
      sku: 'VEL-EAR-GLEAM-04',
      inventory: 3,
      status: 'ACTIVE',
      tag: 'Limited',
      rating: 5,
      categoryId: earrings.id,
    },
  });

  const p5 = await prisma.product.create({
    data: {
      id: 'velluto-5',
      name: 'Solitaire Diamond Ring',
      nameKa: 'სოლიტერის ბეჭედი',
      nameRu: 'Кольцо с бриллиантом Солитер',
      description: 'Classic single-stone solitaire engagement ring showcasing a brilliant round-cut VS1 diamond.',
      descriptionKa: 'კლასიკური ნიშნობის ბეჭედი ბრილიანტის თვლით 18-კარატიან ყვითელ ოქროში.',
      descriptionRu: 'Классическое помолвочное кольцо с круглым бриллиантом VS1.',
      price: 850,
      sku: 'VEL-RING-SOLI-05',
      inventory: 15,
      status: 'ACTIVE',
      tag: 'Exclusive',
      rating: 5,
      categoryId: rings.id,
    },
  });

  const p6 = await prisma.product.create({
    data: {
      id: 'velluto-6',
      name: 'Classic Gold Band',
      nameKa: 'კლასიკური ოქროს რგოლი',
      nameRu: 'Классическое обручальное кольцо',
      description: 'Highly polished traditional dome wedding band crafted in solid 18k yellow gold.',
      descriptionKa: 'კლასიკური ტრადიციული ოქროს ბეჭედი ყოველდღიური ტარებისთვის.',
      descriptionRu: 'Классическое обручальное кольцо из полированного желтого золота 18 карат.',
      price: 190,
      sku: 'VEL-RING-BAND-06',
      inventory: 30,
      status: 'ACTIVE',
      rating: 4,
      categoryId: rings.id,
    },
  });

  console.log('Products seeded.');

  // 6. Create Product Variants
  await prisma.productVariant.createMany({
    data: [
      { productId: 'velluto-1', sku: 'VEL-RING-AURA-01-S16', size: '16', stock: 4, metal: 'Yellow Gold 18k' },
      { productId: 'velluto-1', sku: 'VEL-RING-AURA-01-S17', size: '17', stock: 5, metal: 'Yellow Gold 18k' },
      { productId: 'velluto-1', sku: 'VEL-RING-AURA-01-S18', size: '18', stock: 3, metal: 'Yellow Gold 18k' },
      { productId: 'velluto-2', sku: 'VEL-NECK-ELEG-02-STD', size: '45cm', stock: 5, metal: 'White Gold 18k' },
      { productId: 'velluto-5', sku: 'VEL-RING-SOLI-05-S16', size: '16', stock: 5, metal: 'Yellow Gold 18k' },
      { productId: 'velluto-5', sku: 'VEL-RING-SOLI-05-S17', size: '17', stock: 7, metal: 'Yellow Gold 18k' },
      { productId: 'velluto-5', sku: 'VEL-RING-SOLI-05-W17', size: '17', stock: 3, metal: 'White Gold 18k', priceAdjustment: 50.0 },
    ],
  });

  // 7. Create Product Images
  await prisma.productImage.createMany({
    data: [
      { productId: 'velluto-1', url: '/assets/images/SnapInsta.to_504425330_18067191356475333_7061950038494519014_n.jpg', isFeatured: true },
      { productId: 'velluto-2', url: '/assets/images/SnapInsta.to_505890033_18067191329475333_1202540640618067158_n.jpg', isFeatured: true },
      { productId: 'velluto-3', url: '/assets/images/SnapInsta.to_511492285_17883773805313946_5802540714295682398_n.jpg', isFeatured: true },
      { productId: 'velluto-4', url: '/assets/images/SnapInsta.to_513722015_17883773814313946_4635551935292356186_n.jpg', isFeatured: true },
      { productId: 'velluto-5', url: '/assets/images/SnapInsta.to_571222514_17897423925313946_8859102415012714442_n.jpg', isFeatured: true },
      { productId: 'velluto-6', url: '/assets/images/SnapInsta.to_582104208_17902823109313946_7703722575297763764_n.jpg', isFeatured: true },
    ],
  });

  console.log('Product variants and images seeded.');

  // 8. Create Coupons
  const c1 = await prisma.coupon.create({
    data: { code: 'VELLUTO10', discountType: 'PERCENTAGE', discountValue: 10.0, isActive: true },
  });

  const c2 = await prisma.coupon.create({
    data: { code: 'WELCOME100', discountType: 'FIXED', discountValue: 100.0, isActive: true },
  });

  console.log('Coupons seeded.');

  // 9. Create Customers
  const cust1 = await prisma.customer.create({
    data: {
      name: 'Nino Bakradze',
      email: 'nino.b@gmail.com',
      phone: '+995599778899',
      address: 'Chavchavadze Ave 25, Tbilisi',
      notes: 'Prefers evening deliveries.',
      segment: 'VIP',
    },
  });

  const cust2 = await prisma.customer.create({
    data: {
      name: 'Alexei Ivanov',
      email: 'alex.i@yandex.ru',
      phone: '+995577123456',
      address: 'Pekini St 10, Tbilisi',
      notes: 'Always orders in Russian.',
      segment: 'Regular',
    },
  });

  console.log('Customers seeded.');

  // 10. Create Orders
  const order1 = await prisma.order.create({
    data: {
      id: 'ORD-100204',
      customerName: 'Nino Bakradze',
      phone: '+995599778899',
      address: 'Chavchavadze Ave 25, Tbilisi',
      deliveryDate: '2026-06-08',
      deliveryTime: '18:00',
      paymentMethod: 'Card',
      notes: 'Please wrap as a gift.',
      status: 'PENDING',
      paymentStatus: 'PAID',
      total: 1100.0,
      customerId: cust1.id,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, productId: 'velluto-1', productName: 'Aura Gold Ring', productPrice: 250.0, qty: 1, variantSelected: 'Size 17' },
      { orderId: order1.id, productId: 'velluto-5', productName: 'Solitaire Diamond Ring', productPrice: 850.0, qty: 1, variantSelected: 'Size 17' },
    ],
  });

  const order2 = await prisma.order.create({
    data: {
      id: 'ORD-100205',
      customerName: 'Alexei Ivanov',
      phone: '+995577123456',
      address: 'Pekini St 10, Tbilisi',
      deliveryDate: '2026-06-09',
      deliveryTime: '14:00',
      paymentMethod: 'Cash',
      status: 'PROCESSING',
      paymentStatus: 'UNPAID',
      total: 520.0,
      customerId: cust2.id,
    },
  });

  await prisma.orderItem.create({
    data: { orderId: order2.id, productId: 'velluto-4', productName: 'Gleam Diamond Earrings', productPrice: 520.0, qty: 1 },
  });

  console.log('Orders and order items seeded.');

  // 11. Create Notifications
  await prisma.notification.createMany({
    data: [
      { title: 'New Order Placed', message: 'Order ORD-100204 has been submitted by Nino Bakradze.', type: 'ORDER' },
      { title: 'Low Stock Alert', message: 'Gleam Diamond Earrings (velluto-4) is down to 3 items in stock.', type: 'INVENTORY' },
    ],
  });

  // 12. Create Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: 'SYSTEM_INITIALIZATION',
      details: 'Super admin initialized and default catalogue catalogs loaded.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('Seeding complete successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
