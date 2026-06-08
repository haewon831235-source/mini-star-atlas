"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "msa.cart";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const save = useCallback((next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const add = useCallback(
    (product: Product, qty = 1) => {
      setItems((prev) => {
        const found = prev.find((i) => i.product.id === product.id);
        const next = found
          ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i))
          : [...prev, { product, quantity: qty }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const remove = useCallback(
    (productId: string) => save(items.filter((i) => i.product.id !== productId)),
    [items, save],
  );

  const setQty = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) return save(items.filter((i) => i.product.id !== productId));
      save(items.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i)));
    },
    [items, save],
  );

  const clear = useCallback(() => save([]), [save]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.product.price, 0);

  const value = useMemo<CartContextValue>(
    () => ({ items, count, total, add, remove, setQty, clear }),
    [items, count, total, add, remove, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
