"use client";

/*
 * ДЕМО: замовлення зберігається в sessionStorage, щоб показати його на сторінці результату.
 * З бекендом: POST /api/orders → CRM (KeyCRM), відповідь — номер замовлення й посилання на оплату.
 */
import type { CartItem } from "./cart";

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  promo?: string;
  customer: { firstName: string; lastName: string; phone: string; email: string };
  delivery: { method: string; label: string };
  payment: "online" | "cod";
  comment?: string;
};

const KEY = "ib-last-order";

export function saveOrder(order: Order) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* без сховища сторінка результату покаже лише номер */
  }
}

export function readOrder(id: string | null): Order | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Order;
    return !id || o.id === id ? o : null;
  } catch {
    return null;
  }
}

export const newOrderId = () => `IB-${String(Date.now()).slice(-6)}`;

/** +380 XX XXX XX XX */
export function formatPhone(input: string) {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("0")) d = `38${d}`;
  if (!d.startsWith("380")) d = `380${d.replace(/^3?8?0?/, "")}`;
  d = d.slice(0, 12);
  const p = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)].filter(Boolean);
  return `+${p.join(" ")}`;
}

export const phoneDigits = (v: string) => v.replace(/\D/g, "");
