'use client';

import React, { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

// ─── Georgian Phone Number Regex ───
// Matches exactly 9 digits, grouped as: XXX XXX XXX
const GE_PHONE_REGEX = /^[0-9]{3}\s[0-9]{3}\s[0-9]{3}$/;

/**
 * Strips all non-digits, enforces max 9 digits,
 * and applies the mask: XXX XXX XXX
 */
function formatGeorgianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  // Remove leading 995 if user pasted the full number
  let local = digits;
  if (local.startsWith('995') && local.length > 9) {
    local = local.slice(3);
  }

  // Cap at 9 digits
  local = local.slice(0, 9);

  // Build formatted string
  let formatted = '';
  if (local.length > 0) formatted += local.slice(0, 3);
  if (local.length > 3) formatted += ' ' + local.slice(3, 6);
  if (local.length > 6) formatted += ' ' + local.slice(6, 9);

  return formatted;
}

// ─── Delivery Date Generation ───
interface DateOption {
  value: string; // ISO YYYY-MM-DD
  label: string; // e.g. "Today, Jun 10"
}

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const MONTH_SHORT_GE = ['იან','თებ','მარ','აპრ','მაი','ივნ','ივლ','აგვ','სექ','ოქტ','ნოე','დეკ'];
const DAY_NAMES_GE = ['კვირა','ორშაბათი','სამშაბათი','ოთხშაბათი','ხუთშაბათი','პარასკევი','შაბათი'];

const MONTH_SHORT_RU = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
const DAY_NAMES_RU = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];

function generateDeliveryDates(lang: string): DateOption[] {
  const options: DateOption[] = [];
  const now = new Date();

  const months = lang === 'GE' ? MONTH_SHORT_GE : lang === 'RU' ? MONTH_SHORT_RU : MONTH_SHORT;
  const days = lang === 'GE' ? DAY_NAMES_GE : lang === 'RU' ? DAY_NAMES_RU : DAY_NAMES;
  const todayLabel = lang === 'GE' ? 'დღეს' : lang === 'RU' ? 'Сегодня' : 'Today';
  const tomorrowLabel = lang === 'GE' ? 'ხვალ' : lang === 'RU' ? 'Завтра' : 'Tomorrow';

  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const isoValue = `${yyyy}-${mm}-${dd}`;

    const monthName = months[d.getMonth()];
    const dayNum = d.getDate();

    let label: string;
    if (i === 0) {
      label = `${todayLabel}, ${monthName} ${dayNum}`;
    } else if (i === 1) {
      label = `${tomorrowLabel}, ${monthName} ${dayNum}`;
    } else {
      label = `${days[d.getDay()]}, ${monthName} ${dayNum}`;
    }

    options.push({ value: isoValue, label });
  }

  return options;
}

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
    payment: 'Cash',
  });
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Memoize delivery date options — regenerated only when language changes
  const deliveryDates = useMemo(() => generateDeliveryDates(language), [language]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ─── Controlled phone input handler ───
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatGeorgianPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });

    // Live validation feedback
    if (formatted.length > 4 && !GE_PHONE_REGEX.test(formatted)) {
      setPhoneError(
        language === 'GE'
          ? 'ფორმატი: 5XX XXX XXX'
          : language === 'RU'
            ? 'Формат: 5XX XXX XXX'
            : 'Format: 5XX XXX XXX'
      );
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert(t('cart_empty'));
      return;
    }

    // Validate phone
    if (!GE_PHONE_REGEX.test(formData.phone)) {
      setPhoneError(
        language === 'GE'
          ? 'გთხოვთ შეიყვანოთ სწორი ნომერი: 5XX XXX XXX'
          : language === 'RU'
            ? 'Введите корректный номер: 5XX XXX XXX'
            : 'Please enter a valid Georgian number: 5XX XXX XXX'
      );
      return;
    }

    // Compile items text
    let itemsText = '';
    cart.forEach((item, index) => {
      const itemName = language === 'GE' && item.nameKa ? item.nameKa : item.name;
      const variantDesc =
        item.size || item.color
          ? ` (${[item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(' / ')})`
          : '';
      itemsText += `${index + 1}. ${itemName}${variantDesc} x${item.qty} - ${item.price * item.qty} GEL\n`;
    });

    // Find the label for the selected date
    const selectedDateLabel =
      deliveryDates.find((d) => d.value === formData.date)?.label || formData.date;

    const tHeader =
      language === 'GE'
        ? '🌸 *ახალი შეკვეთა Velluto-დან* 🌸'
        : language === 'RU'
          ? '🌸 *Новый заказ из Velluto* 🌸'
          : '🌸 *New Order from Velluto* 🌸';
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
      `📞 *${tPhone}:* +995 ${formData.phone}\n` +
      `📍 *${tAddress}:* ${formData.address}\n` +
      `📅 *${tDate}:* ${selectedDateLabel}\n` +
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
          phone: `+995 ${formData.phone}`,
          address: formData.address,
          deliveryDate: formData.date,
          deliveryTime: formData.time,
          paymentMethod: formData.payment,
          notes: formData.message,
          items: cart,
          total: cartTotal,
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
    const successTitle =
      language === 'GE'
        ? 'შეკვეთა წარმატებით გაიგზავნა!'
        : language === 'RU'
          ? 'Заказ успешно отправлен!'
          : 'Order Placed Successfully!';
    const successDesc =
      language === 'GE'
        ? 'თქვენი შეკვეთა დაფიქსირდა. გთხოვთ გააგრძელოთ WhatsApp ჩატში შეკვეთის დასადასტურებლად.'
        : language === 'RU'
          ? 'Ваш заказ оформлен. Пожалуйста, продолжите в чате WhatsApp для подтверждения заказа.'
          : 'Your order has been recorded. Please continue in the WhatsApp chat to confirm your order.';
    const goHome =
      language === 'GE' ? 'მთავარ გვერდზე' : language === 'RU' ? 'На главную' : 'Go to Home';

    return (
      <div className="text-center p-8 bg-neutral-50 rounded-3xl border border-neutral-100 space-y-6 max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <h3 className="font-display text-2xl font-bold text-neutral-900">{successTitle}</h3>
        <p className="text-sm font-light text-neutral-500 leading-relaxed">{successDesc}</p>
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
        {/* ── Full Name ── */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2"
          >
            {language === 'GE'
              ? 'სახელი და გვარი *'
              : language === 'RU'
                ? 'Имя и фамилия *'
                : 'Full Name *'}
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

        {/* ── Georgian Phone Input ── */}
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2"
          >
            {language === 'GE'
              ? 'ტელეფონის ნომერი *'
              : language === 'RU'
                ? 'Номер телефона *'
                : 'Phone Number *'}
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none select-none">
              <span className="text-base leading-none">🇬🇪</span>
              <span className="text-sm font-medium text-neutral-500">+995</span>
              <div className="w-px h-4 bg-neutral-200 ml-1"></div>
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="5XX XXX XXX"
              maxLength={11}
              className={`w-full border rounded-xl pl-20 pr-4 py-3 text-sm focus:outline-none transition-colors ${
                phoneError
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-neutral-200 focus:border-neutral-950'
              }`}
            />
          </div>
          {phoneError && (
            <p className="text-[11px] text-red-500 mt-1.5 font-medium">{phoneError}</p>
          )}
        </div>

        {/* ── Delivery Address ── */}
        <div>
          <label
            htmlFor="address"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2"
          >
            {language === 'GE'
              ? 'მიწოდების მისამართი *'
              : language === 'RU'
                ? 'Адрес доставки *'
                : 'Delivery Address *'}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder={
              language === 'GE'
                ? 'თბილისი, ქუჩა, სახლი, ბინა'
                : language === 'RU'
                  ? 'Тбилиси, улица, дом, кв.'
                  : 'Tbilisi, Street, House, Apt'
            }
            className="w-full border border-neutral-200 focus:border-neutral-950 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          />
        </div>

        {/* ── Date & Time Row ── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Delivery Date Dropdown */}
          <div>
            <label
              htmlFor="date"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2"
            >
              {language === 'GE'
                ? 'მიწოდების თარიღი *'
                : language === 'RU'
                  ? 'Дата доставки *'
                  : 'Delivery Date *'}
            </label>
            <select
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-neutral-200 focus:border-neutral-950 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
              }}
            >
              <option value="" disabled>
                {language === 'GE'
                  ? 'აირჩიეთ თარიღი'
                  : language === 'RU'
                    ? 'Выберите дату'
                    : 'Select date'}
              </option>
              {deliveryDates.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Time */}
          <div>
            <label
              htmlFor="time"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2"
            >
              {language === 'GE'
                ? 'მიწოდების დრო *'
                : language === 'RU'
                  ? 'Время доставки *'
                  : 'Delivery Time *'}
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

        {/* ── Order Notes ── */}
        <div>
          <label
            htmlFor="message"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2"
          >
            {t('order_notes')} ({language === 'GE' ? 'არასავალდებულო' : language === 'RU' ? 'Необязательно' : 'Optional'})
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

        {/* ── Payment Method ── */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-3">
            {language === 'GE'
              ? 'გადახდის მეთოდი *'
              : language === 'RU'
                ? 'Метод оплаты *'
                : 'Payment Method *'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Cash', 'Card', 'Bank'].map((method) => {
              const methodLabel =
                method === 'Cash'
                  ? language === 'GE'
                    ? 'ნაღდი'
                    : language === 'RU'
                      ? 'Наличные'
                      : 'Cash'
                  : method === 'Card'
                    ? language === 'GE'
                      ? 'ბარათი'
                      : language === 'RU'
                        ? 'Карта'
                        : 'Card'
                    : language === 'GE'
                      ? 'ბანკი'
                      : language === 'RU'
                        ? 'Банк'
                        : 'Bank';

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
