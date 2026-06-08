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
  const dresses = await prisma.category.create({
    data: { name: 'Dresses', nameKa: 'კაბები', nameRu: 'Платья', slug: 'dresses' },
  });

  console.log('Categories seeded.');

  // 5. Create Products
  const item1 = await prisma.product.create({
    data: {
      id: 'item-1',
      name: "Aurelia Sun-Drenched Yellow Dress",
      nameKa: "ოქროსფერი კაბა აურელია",
      nameRu: "Желтое платье Aurelia",
      description: "A luxurious flowing yellow dress designed with a premium soft linen blend, offering a relaxed yet refined silhouette for sunny days.",
      descriptionKa: "ულამაზესი ყვითელი კაბა, შექმნილი პრემიუმ კლასის სელისგან.",
      descriptionRu: "Роскошное летящее желтое платье из премиального льна.",
      price: 490,
      sku: 'VEL-DRESS-AURELIA',
      inventory: 100,
      status: 'ACTIVE',
      tag: 'New Collection',
      rating: 5,
      categoryId: dresses.id,
    },
  });

  const item2 = await prisma.product.create({
    data: {
      id: 'item-2',
      name: "Elysian Drape Blazer Suit",
      nameKa: "ორეული ელიზიანი",
      nameRu: "Костюм блейзер Elysian",
      description: "An structured high-end tailoring blazer suit with dynamic drape features, curated for a striking and professional statement style.",
      descriptionKa: "კლასიკური დახვეწილი პიჯაკის ორეული, იდეალური ოფიციალური შეხვედრებისთვის.",
      descriptionRu: "Элегантный блейзер-костюм свободного кроя из тонкой вискозы.",
      price: 470,
      sku: 'VEL-SUIT-ELYSIAN',
      inventory: 80,
      status: 'ACTIVE',
      tag: 'Best Seller',
      rating: 5,
      categoryId: dresses.id,
    },
  });

  const item3 = await prisma.product.create({
    data: {
      id: 'item-3',
      name: "Seraphina Knitwear Lounge Set",
      nameKa: "ნაქსოვი ორეული სერაფინა",
      nameRu: "Трикотажный костюм Seraphina",
      description: "A premium comfort knitwear lounge co-ord set designed to transition seamlessly from upscale lounging to casual day outs.",
      descriptionKa: "ნაქსოვი კომფორტული ორეული ყოველდღიური სტილისთვის.",
      descriptionRu: "Уютный трикотажный комплект свободного кроя для дома и прогулок.",
      price: 480,
      sku: 'VEL-KNIT-SERAPHINA',
      inventory: 80,
      status: 'ACTIVE',
      tag: 'Trending',
      rating: 5,
      categoryId: dresses.id,
    },
  });

  console.log('Products seeded.');

  // 6. Create Product Variants
  await prisma.productVariant.createMany({
    data: [
      { productId: 'item-1', sku: 'VEL-DR-AUR-XS-ONYX', size: 'XS', color: 'Midnight Onyx', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-XS-COCOA', size: 'XS', color: 'Tuscan Cocoa', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-XS-MILK', size: 'XS', color: 'Alabaster Milk', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-XS-PINK', size: 'XS', color: 'Rose Quartz', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-XS-AZURE', size: 'XS', color: 'Ethereal Azure', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-S-ONYX', size: 'S', color: 'Midnight Onyx', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-S-COCOA', size: 'S', color: 'Tuscan Cocoa', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-S-MILK', size: 'S', color: 'Alabaster Milk', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-S-PINK', size: 'S', color: 'Rose Quartz', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-S-AZURE', size: 'S', color: 'Ethereal Azure', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-M-ONYX', size: 'M', color: 'Midnight Onyx', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-M-COCOA', size: 'M', color: 'Tuscan Cocoa', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-M-MILK', size: 'M', color: 'Alabaster Milk', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-M-PINK', size: 'M', color: 'Rose Quartz', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-M-AZURE', size: 'M', color: 'Ethereal Azure', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-L-ONYX', size: 'L', color: 'Midnight Onyx', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-L-COCOA', size: 'L', color: 'Tuscan Cocoa', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-L-MILK', size: 'L', color: 'Alabaster Milk', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-L-PINK', size: 'L', color: 'Rose Quartz', stock: 10, priceAdjustment: 0 },
      { productId: 'item-1', sku: 'VEL-DR-AUR-L-AZURE', size: 'L', color: 'Ethereal Azure', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-S-IVORY', size: 'S', color: 'Ivory Silk', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-S-SAGE', size: 'S', color: 'Sage Garden', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-S-ROSE', size: 'S', color: 'Dusty Rose', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-S-NAVY', size: 'S', color: 'Classic Navy', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-M-IVORY', size: 'M', color: 'Ivory Silk', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-M-SAGE', size: 'M', color: 'Sage Garden', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-M-ROSE', size: 'M', color: 'Dusty Rose', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-M-NAVY', size: 'M', color: 'Classic Navy', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-L-IVORY', size: 'L', color: 'Ivory Silk', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-L-SAGE', size: 'L', color: 'Sage Garden', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-L-ROSE', size: 'L', color: 'Dusty Rose', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-L-NAVY', size: 'L', color: 'Classic Navy', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-XL-IVORY', size: 'XL', color: 'Ivory Silk', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-XL-SAGE', size: 'XL', color: 'Sage Garden', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-XL-ROSE', size: 'XL', color: 'Dusty Rose', stock: 10, priceAdjustment: 0 },
      { productId: 'item-2', sku: 'VEL-SUIT-ELY-XL-NAVY', size: 'XL', color: 'Classic Navy', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-S-NOIR', size: 'S', color: 'Midnight Noir', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-S-WHITE', size: 'S', color: 'Alabaster White', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-S-PDRSE', size: 'S', color: 'Powder Rose', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-S-SBLUE', size: 'S', color: 'Soft Horizon', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-M-NOIR', size: 'M', color: 'Midnight Noir', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-M-WHITE', size: 'M', color: 'Alabaster White', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-M-PDRSE', size: 'M', color: 'Powder Rose', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-M-SBLUE', size: 'M', color: 'Soft Horizon', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-L-NOIR', size: 'L', color: 'Midnight Noir', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-L-WHITE', size: 'L', color: 'Alabaster White', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-L-PDRSE', size: 'L', color: 'Powder Rose', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-L-SBLUE', size: 'L', color: 'Soft Horizon', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-XL-NOIR', size: 'XL', color: 'Midnight Noir', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-XL-WHITE', size: 'XL', color: 'Alabaster White', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-XL-PDRSE', size: 'XL', color: 'Powder Rose', stock: 10, priceAdjustment: 0 },
      { productId: 'item-3', sku: 'VEL-KNIT-SER-XL-SBLUE', size: 'XL', color: 'Soft Horizon', stock: 10, priceAdjustment: 0 },
    ],
  });

  // 7. Create Product Images
  await prisma.productImage.createMany({
    data: [
      { productId: 'item-1', url: '/assets/item 1/DSC06881.jpeg', isFeatured: true },
      { productId: 'item-1', url: '/assets/item 1/DSC06948.9.jpeg', isFeatured: false },
      { productId: 'item-1', url: '/assets/item 1/DSC06962.jpeg', isFeatured: false },
      { productId: 'item-1', url: '/assets/item 1/DSC06980.jpeg', isFeatured: false },
      { productId: 'item-2', url: '/assets/item 2/IMG_8337.jpeg', isFeatured: true },
      { productId: 'item-2', url: '/assets/item 2/IMG_8338.jpeg', isFeatured: false },
      { productId: 'item-2', url: '/assets/item 2/IMG_8339.jpeg', isFeatured: false },
      { productId: 'item-2', url: '/assets/item 2/IMG_8340.jpeg', isFeatured: false },
      { productId: 'item-2', url: '/assets/item 2/IMG_8341.jpeg', isFeatured: false },
      { productId: 'item-2', url: '/assets/item 2/IMG_8346.jpeg', isFeatured: false },
      { productId: 'item-3', url: '/assets/item 3/IMG_0701.jpeg', isFeatured: true },
      { productId: 'item-3', url: '/assets/item 3/IMG_0702.jpeg', isFeatured: false },
      { productId: 'item-3', url: '/assets/item 3/IMG_5005.jpeg', isFeatured: false },
      { productId: 'item-3', url: '/assets/item 3/IMG_9938.jpeg', isFeatured: false },
      { productId: 'item-3', url: '/assets/item 3/IMG_9955.jpeg', isFeatured: false },
      { productId: 'item-3', url: '/assets/item 3/IMG_9958.jpeg', isFeatured: false },
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
      total: 960.0,
      customerId: cust1.id,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, productId: 'item-1', productName: 'Aurelia Sun-Drenched Yellow Dress', productPrice: 490.0, qty: 1, variantSelected: 'Size S / Tuscan Cocoa' },
      { orderId: order1.id, productId: 'item-2', productName: 'Elysian Drape Blazer Suit', productPrice: 470.0, qty: 1, variantSelected: 'Size S / Ivory Silk' },
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
      total: 480.0,
      customerId: cust2.id,
    },
  });

  await prisma.orderItem.create({
    data: { orderId: order2.id, productId: 'item-3', productName: 'Seraphina Knitwear Lounge Set', productPrice: 480.0, qty: 1, variantSelected: 'Size S / Midnight Noir' },
  });

  console.log('Orders and order items seeded.');

  // 11. Create Notifications
  await prisma.notification.createMany({
    data: [
      { title: 'New Order Placed', message: 'Order ORD-100204 has been submitted by Nino Bakradze.', type: 'ORDER' },
      { title: 'Low Stock Alert', message: 'Aurelia Sun-Drenched Yellow Dress (item-1) is down to 3 items in stock.', type: 'INVENTORY' },
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
