'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function CheckoutForm() {
  const { cart, cartTotal, clearCart } = useCart();
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    message: '',
    payment: 'Cash'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert(t('cart_empty'));
      return;
    }

    // Compile items text
    let itemsText = '';
    cart.forEach((item, index) => {
      const itemName = language === 'GE' && item.nameKa ? item.nameKa : item.name;
      const variantDesc = (item.size || item.color)
        ? ` (${[item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(' / ')})`
        : '';
      itemsText += `${index + 1}. ${itemName}${variantDesc} x${item.qty} - ${item.price * item.qty} GEL\n`;
    });

    const tHeader = language === 'GE' ? '🌸 *ახალი შეკვეთა Velluto-დან* 🌸' : language === 'RU' ? '🌸 *Новый заказ из Velluto* 🌸' : '🌸 *New Order from Velluto* 🌸';
    const tName = language === 'GE' ? 'სახელი' : language === 'RU' ? 'Имя' : 'Name';
    const tPhone = language === 'GE' ? 'ტელეფონი' : language === 'RU' ? 'Телефон' : 'Phone';
    const tAddress = language === 'GE' ? 'მისამართი' : language === 'RU' ? 'Адрес' : 'Address';
    const tDate = language === 'GE' ? 'თარიღი' : language === 'RU' ? 'Дата' : 'Date';
    const tTime = language === 'GE' ? 'დრო' : language === 'RU' ? 'Время' : 'Time';
    const tPayment = language === 'GE' ? 'გადახდა' : language === 'RU' ? 'Оплата' : 'Payment';
    const tMsg = language === 'GE' ? 'ბარათი' : language === 'RU' ? 'Открытка' : 'Card Note';
    const tItems = language === 'GE' ? 'პროდუქტები' : language === 'RU' ? 'Товары' : 'Items';
    const tTotal = language === 'GE' ? 'სულ ჯამი' : language === 'RU' ? 'Итого' : 'Total';

    // Compile Message
    const messageText = 
      `${tHeader}\n\n` +
      `👤 *${tName}:* ${formData.name}\n` +
      `📞 *${tPhone}:* ${formData.phone}\n` +
      `📍 *${tAddress}:* ${formData.address}\n` +
      `📅 *${tDate}:* ${formData.date}\n` +
      `🕐 *${tTime}:* ${formData.time}\n` +
      `💳 *${tPayment}:* ${formData.payment}\n` +
      `✉️ *${tMsg}:* ${formData.message ? formData.message : '—'}\n\n` +
      `🧾 *${tItems}:*\n${itemsText}\n` +
      `💰 *${tTotal}:* ${cartTotal} GEL`;

    // WhatsApp URL (Georgia shop phone code +995 599 12 34 56)
    const encodedMsg = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/995599123456?text=${encodedMsg}`;

    // Save order in localStorage
    if (typeof window !== 'undefined') {
      try {
        const existingOrdersStr = localStorage.getItem('velluto_orders');
        const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
        const newOrder = {
          id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          dateCreated: new Date().toISOString(),
          customerName: formData.name,
          phone: formData.phone,
          address: formData.address,
          deliveryDate: formData.date,
          deliveryTime: formData.time,
          paymentMethod: formData.payment,
          notes: formData.message,
          items: cart,
          total: cartTotal
        };
        localStorage.setItem('velluto_orders', JSON.stringify([newOrder, ...existingOrders]));
      } catch (err) {
        console.error('Error saving order to localStorage', err);
      }
    }

    // Clear cart and show success modal
    clearCart();
    setIsSubmitted(true);

    // Open WhatsApp link in new tab
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isSubmitted) {
    const successTitle = language === 'GE' ? 'შეკვეთა წარმატებით გაიგზავნა!' : language === 'RU' ? 'Заказ успешно отправлен!' : 'Order Placed Successfully!';
    const successDesc = language === 'GE' ? 'თქვენი შეკვეთა დაფიქსირდა. გთხოვთ გააგრძელოთ WhatsApp ჩატში შეკვეთის დასადასტურებლად.' : language === 'RU' ? 'Ваш заказ оформлен. Пожалуйста, продолжите в чате WhatsApp для подтверждения заказа.' : 'Your order has been recorded. Please continue in the WhatsApp chat to confirm your order.';
    const goHome = language === 'GE' ? 'მთავარ გვერდზე' : language === 'RU' ? 'На главную' : 'Go to Home';

    return (
      <div className="text-center p-8 bg-neutral-50 rounded-3xl border border-neutral-100 space-y-6 max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <h3 className="font-display text-2xl font-bold text-neutral-900">{successTitle}</h3>
        <p className="text-sm font-light text-neutral-500 leading-relaxed">
          {successDesc}
        </p>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }}
          className="inline-flex items-center justify-center gap-2 bg-neutral-950 text-white font-semibold px-8 py-3 rounded-full hover:bg-neutral-900 transition-colors uppercase text-xs tracking-wider"
        >
          <Icon name="HomeIcon" size={14} />
          {goHome}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
            {language === 'GE' ? 'სახელი და გვარი *' : language === 'RU' ? 'Имя и фамилия *' : 'Full Name *'}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border border-neutral-200 focus:border-neutral-950 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
            {language === 'GE' ? 'ტელეფონის ნომერი *' : language === 'RU' ? 'Номер телефона *' : 'Phone Number *'}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+995 5XX XX XX XX"
            className="w-full border border-neutral-200 focus:border-neutral-950 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
            {language === 'GE' ? 'მიწოდების მისამართი *' : language === 'RU' ? 'Адрес доставки *' : 'Delivery Address *'}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Tbilisi, Street, House, Apt"
            className="w-full border border-neutral-200 focus:border-neutral-950 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
              {language === 'GE' ? 'მიწოდების თარიღი *' : language === 'RU' ? 'Дата доставки *' : 'Delivery Date *'}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-neutral-200 focus:border-neutral-950 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
              {language === 'GE' ? 'მიწოდების დრო *' : language === 'RU' ? 'Время доставки *' : 'Delivery Time *'}
            </label>
            <input
              type="time"
              id="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-neutral-200 focus:border-neutral-950 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
            {t('order_notes')} (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t('notes_placeholder')}
            rows={3}
            className="w-full border border-neutral-200 focus:border-neutral-950 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-3">
            {language === 'GE' ? 'გადახდის მეთოდი *' : language === 'RU' ? 'Метод оплаты *' : 'Payment Method *'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Cash', 'Card', 'Bank'].map((method) => {
              const methodLabel = method === 'Cash' 
                ? (language === 'GE' ? 'ნაღდი' : language === 'RU' ? 'Наличные' : 'Cash')
                : method === 'Card'
                ? (language === 'GE' ? 'ბარათი' : language === 'RU' ? 'Карта' : 'Card')
                : (language === 'GE' ? 'ბანკი' : language === 'RU' ? 'Банк' : 'Bank');

              return (
                <label
                  key={method}
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-center transition-all ${
                    formData.payment === method
                      ? 'border-neutral-950 bg-neutral-50 font-semibold text-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={formData.payment === method}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-xs uppercase tracking-wider">{methodLabel}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={cart.length === 0}
        className="w-full bg-neutral-950 hover:bg-neutral-900 disabled:bg-neutral-300 text-white font-semibold py-4 rounded-xl transition-all duration-200 tracking-wide uppercase text-xs"
      >
        {t('complete_whatsapp')}
      </button>
    </form>
  );
}
