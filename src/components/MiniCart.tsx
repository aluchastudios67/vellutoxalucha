'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function MiniCart() {
  const { cart, isCartOpen, setIsCartOpen, changeQty, removeItem, cartTotal } = useCart();
  const { language, t } = useLanguage();
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

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
    <>
      {/* Drawer Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Cart Drawer Container */}
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-neutral-900">{t('cart_title')}</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-colors"
            aria-label="Close"
          >
            <Icon name="XIcon" size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-4">
              <Icon name="ShoppingBagIcon" size={48} className="text-neutral-300" />
              <p className="font-medium">{t('cart_empty')}</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider text-neutral-900 hover:underline"
              >
                {t('back_to_shop')}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
                {/* Product Image */}
                <div className="w-20 h-24 bg-neutral-50 rounded-lg overflow-hidden relative flex-shrink-0">
                  <img
                    src={item.img}
                    alt={getItemName(item)}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-neutral-900 text-sm">{getItemName(item)}</h4>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-200 rounded-full py-1 px-3">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="text-neutral-500 hover:text-neutral-950 font-bold px-1"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium mx-3 text-neutral-900">{item.qty}</span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="text-neutral-500 hover:text-neutral-950 font-bold px-1"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-neutral-900">
                        {item.price * item.qty} {t('gel')}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-4">
            <div className="flex items-center justify-between text-neutral-900">
              <span className="text-sm font-medium">{t('cart_subtotal')}:</span>
              <strong className="text-lg font-bold">{cartTotal} {t('gel')}</strong>
            </div>
            
            <button
              onClick={handleCheckoutClick}
              className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-neutral-950/10 tracking-wide uppercase text-sm"
            >
              {t('cart_checkout')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
