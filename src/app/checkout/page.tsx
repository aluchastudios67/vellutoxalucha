'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CheckoutForm from './components/CheckoutForm';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const { language, t } = useLanguage();

  const getItemName = (item: any) => {
    if (language === 'GE' && item.nameKa) return item.nameKa;
    if (language === 'RU') {
      if (item.id === 'velluto-1') return 'Золотое кольцо Аура';
      if (item.id === 'velluto-2') return 'Бриллиантовое колье Элегантность';
      if (item.id === 'velluto-3') return 'Золотой браслет Velluto';
      if (item.id === 'velluto-4') return 'Бриллиантовые серьги Сияние';
      if (item.id === 'velluto-5') return 'Кольцо с бриллиантом Солитер';
      if (item.id === 'velluto-6') return 'Классическое обручальное кольцо';
    }
    return item.name;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* Small top header */}
      <header className="border-b border-neutral-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors">
            <Icon name="ArrowLeftIcon" size={14} />
            {t('back_to_shop')}
          </Link>
          <span className="font-display text-xl font-bold tracking-tight text-neutral-900 uppercase">
            Velluto
          </span>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                {t('billing_details')}
              </h1>
              <p className="text-sm font-light text-neutral-500 mt-2">
                {t('checkout_subtitle')}
              </p>
            </div>

            <CheckoutForm />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-neutral-50 rounded-3xl p-8 border border-neutral-100 h-fit space-y-6">
            <h3 className="font-display text-lg font-bold text-neutral-900">{t('summary')}</h3>
            
            {cart.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-sm space-y-4">
                <Icon name="ShoppingBagIcon" size={36} className="text-neutral-300 mx-auto" />
                <p>{t('cart_empty')}</p>
                <Link href="/" className="inline-block text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors">
                  {t('back_to_shop')}
                </Link>
              </div>
            ) : (
              <>
                <div className="divide-y divide-neutral-200/60 overflow-y-auto max-h-[350px] pr-2 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                      <div className="w-16 h-20 bg-white rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-100">
                        <img src={item.img} alt={getItemName(item)} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-800">{getItemName(item)}</h4>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Qty: {item.qty}</p>
                        </div>
                        <span className="text-xs font-bold text-neutral-900">{item.price * item.qty} {t('gel')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-neutral-200/60 space-y-3 text-sm">
                  <div className="flex justify-between text-neutral-500">
                    <span>{t('delivery')}:</span>
                    <span className="text-green-600 font-semibold uppercase text-xs">{t('free')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-900 pt-3 border-t border-neutral-200/60">
                    <span className="font-semibold">{t('total_due')}:</span>
                    <strong className="text-lg font-bold">{cartTotal} {t('gel')}</strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
