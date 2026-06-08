'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  nameKa?: string;
  nameRu?: string;
  price: number;
  qty: number;
  img: string;
  size?: string;
  color?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  changeQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('velluto_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('velluto_cart', JSON.stringify(newCart));
  };

  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    const existingItem = cart.find((i) => i.id === item.id);
    let newCart;
    if (existingItem) {
      newCart = cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      newCart = [...cart, { ...item, qty: 1 }];
    }
    saveCart(newCart);
    setIsCartOpen(true); // Open drawer on addition
  };

  const changeQty = (id: string, delta: number) => {
    const existingItem = cart.find((i) => i.id === id);
    if (!existingItem) return;

    let newCart;
    if (existingItem.qty + delta <= 0) {
      newCart = cart.filter((i) => i.id !== id);
    } else {
      newCart = cart.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i));
    }
    saveCart(newCart);
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((i) => i.id !== id);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        changeQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
