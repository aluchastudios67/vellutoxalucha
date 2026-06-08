'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'GE' | 'RU';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Navigation
    collections: 'Collections',
    our_story: 'Our Story',
    shop_the_look: 'Shop The Look',
    visit_us: 'Visit Us',
    call_us: 'Call Us',
    shopping_cart: 'Shopping Cart',

    // Hero
    handcrafted_luxury: 'Handcrafted Luxury',
    hero_title: 'VELLUTO',
    hero_subtitle: 'The Art of Fine Craftsmanship',
    hero_desc:
      'Discover curated collections of timeless luxury fashion and premium garments designed to complement your elegance.',
    explore_collection: 'Explore Collection',
    shop_look: 'Shop the Look',

    // Editorial Intro
    heritage_title: 'THE HERITAGE',
    heritage_subtitle: 'Sculpted by Heritage, Refined for Today',
    heritage_desc1:
      'Born from a lineage of Georgian master tailors, Velluto blends ancestral sartorial techniques with contemporary high-fashion geometry. Every piece is hand-tailored in our Tbilisi workshop using ethically sourced premium fabrics.',
    heritage_desc2:
      'We believe fashion is not an accessory, but a physical extension of your character. A silent dialogue between form, premium fabrics, and design.',
    stats_years: '12+',
    stats_years_label: 'Years of Artistry',
    stats_items: '5,000+',
    stats_items_label: 'Handmade Creations',

    // Editorial Strip
    strip_title: 'Aesthetic Statement',
    strip_subtitle: '"Beauty begins the moment you decide to be yourself."',
    strip_collection: 'The Signature Collection',

    // New Arrivals
    new_arrivals: 'New Arrivals',
    arrivals_subtitle: 'Hand-selected signature pieces from our latest workshop release',
    add_to_cart: 'Add to Cart',
    in_cart: 'In Cart',
    gel: 'GEL',

    // Products
    product_ring_title: 'Velluto Gold Signet Ring',
    product_ring_desc:
      'Hand-engraved 18k yellow gold signet ring featuring clean geometric facets.',
    product_bracelet_title: 'Luxury Faceted Gold Bracelet',
    product_bracelet_desc:
      'Polished solid gold interlocking links, structured to catch the light at every angle.',
    product_earrings_title: 'Diamond Halo Stud Earrings',
    product_earrings_desc:
      'Brilliant-cut VS1 diamonds claw-set in an architectural 18k white gold housing.',

    // Shop the Look
    shop_look_title: 'Shop the Look',
    shop_look_subtitle: 'Hover over the gold hotspots to inspect and shop the look',
    spot_ring: 'Velluto Gold Signet Ring — 2,400 GEL',
    spot_bracelet: 'Luxury Faceted Gold Bracelet — 3,800 GEL',
    spot_earrings: 'Diamond Halo Stud Earrings — 1,950 GEL',

    // Instagram
    insta_title: 'Editorial Showcase',
    insta_subtitle: 'Follow our journey and daily inspirations on Instagram @velluto_____',

    // Location
    visit_us_title: 'Visit Our Boutique',
    visit_us_desc:
      'Our showroom is nestled in the historic district of Tbilisi. Experience the collections in person, receive custom sizing consultations, and preview unreleased collections.',
    address_label: 'Address',
    address_value: 'Vardisubani, Tbilisi, Georgia',
    phone_label: 'Phone',
    hours_label: 'Hours',
    hours_value: 'Open 24/7 · Mon - Sun (Appointments recommended)',
    open_maps: 'Open in Google Maps',

    // Footer
    footer_desc:
      'Exclusive handcrafted fashion and premium apparel designed to elevate your personal style. Created with luxury materials and meticulous craftsmanship.',
    footer_copyright: 'All rights reserved.',

    // Mini Cart
    cart_title: 'Your Selection',
    cart_empty: 'Your cart is empty',
    cart_subtotal: 'Subtotal',
    cart_checkout: 'Proceed to Checkout',

    // Checkout
    checkout_title: 'Secure Checkout',
    checkout_subtitle: 'Finalize your luxury selection and complete your order via WhatsApp',
    billing_details: 'Boutique Delivery Details',
    full_name: 'Full Name',
    phone_number: 'Phone Number',
    order_notes: 'Special Requests / Sizing Notes',
    notes_placeholder: 'E.g., Suit/dress sizing adjustments, preferred fit details...',
    summary: 'Order Summary',
    items_total: 'Items Total',
    delivery: 'Delivery',
    free: 'Free',
    total_due: 'Total Due',
    complete_whatsapp: 'Complete Order via WhatsApp',
    whatsapp_error: 'Please fill in your name and phone number.',
    back_to_shop: 'Back to Shop',
  },
  GE: {
    // Navigation
    collections: 'კოლექციები',
    our_story: 'ჩვენი ისტორია',
    shop_the_look: 'სტილი',
    visit_us: 'გვეწვიეთ',
    call_us: 'დაგვიკავშირდით',
    shopping_cart: 'კალათა',

    // Hero
    handcrafted_luxury: 'ხელნაკეთი ფუფუნება',
    hero_title: 'VELLUTO',
    hero_subtitle: 'საუკეთესო ოსტატობის ხელოვნება',
    hero_desc:
      'აღმოაჩინეთ მარადიული დახვეწილი ტანსაცმლისა და მოდის კოლექციები, რომლებიც ხაზს უსვამს თქვენს ელეგანტურობას.',
    explore_collection: 'კოლექციის ნახვა',
    shop_look: 'სტილის ნახვა',

    // Editorial Intro
    heritage_title: 'მემკვიდრეობა',
    heritage_subtitle: 'შექმნილი მემკვიდრეობით, დახვეწილი დღევანდელობისთვის',
    heritage_desc1:
      'ქართველი მკერავებისა და მოდელიორების ხაზიდან წამოსული Velluto აერთიანებს თერძობის საგვარეულო ტექნიკასა და თანამედროვე მაღალი მოდის გეომეტრიას. თითოეული ნამუშევარი იქმნება ჩვენს თბილისის სახელოსნოში, პრემიუმ კლასის ქსოვილების გამოყენებით.',
    heritage_desc2:
      'ჩვენ გვჯერა, რომ ტანსაცმელი არ არის უბრალო აქსესუარი, არამედ თქვენი ხასიათის ფიზიკური გაგრძელებაა. მდუმარე დიალოგი ფორმას, ქსოვილსა და დიზაინს შორის.',
    stats_years: '12+',
    stats_years_label: 'წლის გამოცდილება',
    stats_items: '5,000+',
    stats_items_label: 'ხელნაკეთი ქმნილება',

    // Editorial Strip
    strip_title: 'ესთეტიკური განაცხადი',
    strip_subtitle: '"სილამაზე იწყება მაშინ, როდესაც გადაწყვეტთ იყოთ საკუთარი თავი."',
    strip_collection: 'საკუთარი ხელწერა',

    // New Arrivals
    new_arrivals: 'ახალი მოდელები',
    arrivals_subtitle: 'ჩვენი სახელოსნოს ბოლო კოლექციიდან საგულდაგულოდ შერჩეული სამოსი',
    add_to_cart: 'კალათაში დამატება',
    in_cart: 'დამატებულია',
    gel: 'ლარი',

    // Products
    product_ring_title: 'Velluto ოქროს ბეჭედი',
    product_ring_desc: 'ხელით გრავირებული 18k ყვითელი ოქროს ბეჭედი სუფთა გეომეტრიული ფასეტებით.',
    product_bracelet_title: 'ოქროს კლასიკური სამაჯური',
    product_bracelet_desc:
      'პრიალა მყარი ოქროს გადაჯაჭვული რგოლები, შექმნილი სინათლის იდეალურად ასარეკლად.',
    product_earrings_title: 'ბრილიანტის საყურეები',
    product_earrings_desc: 'ბრწყინვალე ჭრის VS1 ბრილიანტები, ჩასმული 18k თეთრ ოქროში.',

    // Shop the Look
    shop_look_title: 'სტილის ყიდვა',
    shop_look_subtitle:
      'მიიტანეთ კურსორი ოქროს წერტილებთან სტილის დეტალების დასათვალიერებლად და შესაძენად',
    spot_ring: 'Velluto ოქროს ბეჭედი — 2,400 ₾',
    spot_bracelet: 'ოქროს კლასიკური სამაჯური — 3,800 ₾',
    spot_earrings: 'ბრილიანტის საყურეები — 1,950 ₾',

    // Instagram
    insta_title: 'სარედაქციო გალერეა',
    insta_subtitle: 'თვალი ადევნეთ ჩვენს ყოველდღიურობასა და შთაგონებებს ინსტაგრამზე @velluto_____',

    // Location
    visit_us_title: 'ეწვიეთ ჩვენს ბუტიკს',
    visit_us_desc:
      'ჩვენი შოურუმი მდებარეობს თბილისის ისტორიულ უბანში. ეწვიეთ კოლექციების პირადად დასათვალიერებლად, მიიღეთ ზომის კონსულტაცია და ექსკლუზიურად ნახეთ ახალი მოდელები.',
    address_label: 'მისამართი',
    address_value: 'ვარდისუბანი, თბილისი, საქართველო',
    phone_label: 'ტელეფონი',
    hours_label: 'სამუშაო საათები',
    hours_value: 'ღიაა 24/7 · ორშ - კვირას (რეკომენდებულია წინასწარ ჩაწერა)',
    open_maps: 'რუკაზე ნახვა',

    // Footer
    footer_desc:
      'ექსკლუზიური ხელნაკეთი სამოსი და პრემიუმ აქსესუარები, რომლებიც შექმნილია თქვენი ინდივიდუალური სტილისთვის.',
    footer_copyright: 'ყველა უფლება დაცულია.',

    // Mini Cart
    cart_title: 'თქვენი არჩევანი',
    cart_empty: 'კალათა ცარიელია',
    cart_subtotal: 'ჯამი',
    cart_checkout: 'შეკვეთის გაფორმება',

    // Checkout
    checkout_title: 'უსაფრთხო შეკვეთა',
    checkout_subtitle: 'დაასრულეთ თქვენი შესყიდვა და გააფორმეთ შეკვეთა WhatsApp-ის საშუალებით',
    billing_details: 'მიწოდების დეტალები',
    full_name: 'სახელი და გვარი',
    phone_number: 'ტელეფონის ნომერი',
    order_notes: 'სპეციალური მოთხოვნები / ზომის შენიშვნა',
    notes_placeholder: 'მაგ: კაბის/პიჯაკის ზომის კორექტირება, მორგების დეტალები...',
    summary: 'შეკვეთის ჯამი',
    items_total: 'სამკაულების ჯამი',
    delivery: 'მიწოდება',
    free: 'უფასო',
    total_due: 'სულ გადასახდელი',
    complete_whatsapp: 'შეკვეთა WhatsApp-ით',
    whatsapp_error: 'გთხოვთ მიუთითოთ სახელი და ტელეფონის ნომერი.',
    back_to_shop: 'მაღაზიაში დაბრუნება',
  },
  RU: {
    // Navigation
    collections: 'Коллекции',
    our_story: 'Наша история',
    shop_the_look: 'Образ',
    visit_us: 'Контакты',
    call_us: 'Позвонить',
    shopping_cart: 'Корзина',

    // Hero
    handcrafted_luxury: 'Роскошь ручной работы',
    hero_title: 'VELLUTO',
    hero_subtitle: 'Искусство тонкого мастерства',
    hero_desc:
      'Откройте для себя коллекции изысканной одежды и премиальной моды, созданных подчеркнуть вашу элегантность.',
    explore_collection: 'Смотреть коллекцию',
    shop_look: 'Купить образ',

    // Editorial Intro
    heritage_title: 'НАСЛЕДИЕ',
    heritage_subtitle: 'Скульптурные традиции, современная эстетика',
    heritage_desc1:
      'Происходя из династии грузинских мастеров портного искусства, Velluto сочетает традиционные методы пошива с геометрией высокой моды. Каждое изделие создается вручную в нашей тбилисской мастерской из премиальных тканей.',
    heritage_desc2:
      'Мы верим, что одежда — это не просто аксессуар, а физическое продолжение вашего характера. Безмолвный диалог между формой, материалом и дизайном.',
    stats_years: '12+',
    stats_years_label: 'Лет мастерства',
    stats_items: '5,000+',
    stats_items_label: 'Уникальных изделий',

    // Editorial Strip
    strip_title: 'Эстетический манифест',
    strip_subtitle: '"Красота начинается в тот момент, когда вы решаете быть собой."',
    strip_collection: 'Фирменная коллекция',

    // New Arrivals
    new_arrivals: 'Новинки',
    arrivals_subtitle: 'Особые знаковые модели из последнего выпуска нашей мастерской',
    add_to_cart: 'Добавить в корзину',
    in_cart: 'Добавлено',
    gel: 'GEL',

    // Products
    product_ring_title: 'Золотое кольцо-печатка Velluto',
    product_ring_desc:
      'Выгравированное вручную кольцо из желтого золота 18k с чистыми геометрическими гранями.',
    product_bracelet_title: 'Фактурный золотой браслет',
    product_bracelet_desc:
      'Полированные звенья из цельного золота, созданные улавливать свет под любым углом.',
    product_earrings_title: 'Серьги-пусеты с бриллиантами',
    product_earrings_desc: 'Бриллианты круглой огранки VS1 в оправе из белого золота 18k.',

    // Shop the Look
    shop_look_title: 'Купить образ',
    shop_look_subtitle: 'Наведите курсор на золотые точки, чтобы рассмотреть детали образа',
    spot_ring: 'Золотое кольцо-печатка Velluto — 2,400 GEL',
    spot_bracelet: 'Фактурный золотой браслет — 3,800 GEL',
    spot_earrings: 'Серьги-пусеты с бриллиантами — 1,950 GEL',

    // Instagram
    insta_title: 'Галерея образов',
    insta_subtitle: 'Следите за нашими новостями и вдохновением в Instagram @velluto_____',

    // Location
    visit_us_title: 'Посетите наш бутик',
    visit_us_desc:
      'Наш шоурум расположен в историческом районе Тбилиси. Оцените коллекции лично, получите консультацию по подбору размера и ознакомьтесь с новинками.',
    address_label: 'Адрес',
    address_value: 'Вардисубани, Тбилиси, Грузия',
    phone_label: 'Телефон',
    hours_label: 'Часы работы',
    hours_value: 'Открыто 24/7 · Пн - Вс (рекомендуется предварительная запись)',
    open_maps: 'Открыть на картах',

    // Footer
    footer_desc:
      'Эксклюзивная одежда ручной работы и премиальные аксессуары, созданные для выражения вашего стиля.',
    footer_copyright: 'Все права защищены.',

    // Mini Cart
    cart_title: 'Ваш выбор',
    cart_empty: 'Ваша корзина пуста',
    cart_subtotal: 'Итого',
    cart_checkout: 'Оформить заказ',

    // Checkout
    checkout_title: 'Оформление заказа',
    checkout_subtitle: 'Подтвердите свой выбор и завершите оформление заказа в WhatsApp',
    billing_details: 'Детали доставки бутика',
    full_name: 'Имя и фамилия',
    phone_number: 'Номер телефона',
    order_notes: 'Особые пожелания / Размер кольца',
    notes_placeholder: 'Например, регулировка размера платья/костюма, особенности кроя...',
    summary: 'Сводка заказа',
    items_total: 'Стоимость изделий',
    delivery: 'Доставка',
    free: 'Бесплатно',
    total_due: 'Итого к оплате',
    complete_whatsapp: 'Завершить заказ в WhatsApp',
    whatsapp_error: 'Пожалуйста, заполните имя и телефон.',
    back_to_shop: 'Вернуться в магазин',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('velluto_language');
    if (savedLang && (savedLang === 'EN' || savedLang === 'GE' || savedLang === 'RU')) {
      setLanguageState(savedLang as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('velluto_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
