"use client";

/*
 * Стор кошика: позиції, промокод, підсумки. Зберігається в localStorage.
 * Коли з'явиться бекенд — синхронізуємо з серверним кошиком, API компонентів не змінюється.
 */
import { useSyncExternalStore } from "react";
import { checkPromo, type Promo } from "@/data/promos";
import { cartItem, track } from "./analytics";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  color: string;
  size: string;
  qty: number;
  /** Максимум за залишком варіанта */
  max?: number;
  image?: string;
  placeholder?: { bg: string; fg: string };
};

type State = { items: CartItem[]; promo: Promo | null };

const KEY = "ib-cart-v2";
const EMPTY: State = { items: [], promo: null };
let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

export const itemKey = (i: Pick<CartItem, "productId" | "color" | "size">) => `${i.productId}|${i.color}|${i.size}`;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as State) };
  } catch {
    state = EMPTY;
  }
}

function commit(next: State) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* приватний режим — кошик живе лише в пам'яті */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => EMPTY;

/* ── Дії ── */

const clampQty = (qty: number, max = 99) => Math.max(1, Math.min(max, qty));

export function addToCart(item: CartItem) {
  load();
  track({ name: "add_to_cart", value: item.price * item.qty, items: [cartItem(item)] });
  const k = itemKey(item);
  const exists = state.items.some((i) => itemKey(i) === k);
  commit({
    ...state,
    items: exists
      ? state.items.map((i) => (itemKey(i) === k ? { ...i, qty: clampQty(i.qty + item.qty, i.max) } : i))
      : [...state.items, { ...item, qty: clampQty(item.qty, item.max) }],
  });
  // Кошик не відкриваємо — показуємо коротке сповіщення (CartToast)
  window.dispatchEvent(new CustomEvent<CartAddedDetail>(CART_ADDED_EVENT, { detail: { name: item.name, size: item.size, qty: item.qty } }));
}

export function setQty(key: string, qty: number) {
  load();
  commit({ ...state, items: state.items.map((i) => (itemKey(i) === key ? { ...i, qty: clampQty(qty, i.max) } : i)) });
}

export function removeItem(key: string) {
  load();
  const items = state.items.filter((i) => itemKey(i) !== key);
  commit({ items, promo: items.length ? state.promo : null });
}

export function clearCart() {
  load();
  commit(EMPTY);
}

/** Повертає текст помилки або null, якщо код застосовано */
export function applyPromo(code: string): string | null {
  load();
  const result = checkPromo(code, subtotalOf(state.items));
  if (typeof result === "string") return result;
  commit({ ...state, promo: result });
  return null;
}

export function removePromo() {
  load();
  commit({ ...state, promo: null });
}

/* ── Відкриття міні-кошика з будь-якого місця ── */

export const CART_OPEN_EVENT = "ib:cart-open";
export const CART_ADDED_EVENT = "ib:cart-added";
export type CartAddedDetail = { name: string; size: string; qty: number };
export const openCartDrawer = () => window.dispatchEvent(new Event(CART_OPEN_EVENT));

/* ── Хуки й підсумки ── */

export function useCartState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCart() {
  return useCartState().items;
}

export function useCartCount() {
  return useCart().reduce((n, i) => n + i.qty, 0);
}

const subtotalOf = (items: CartItem[]) => items.reduce((s, i) => s + i.price * i.qty, 0);

export function totalsOf({ items, promo }: State) {
  const subtotal = subtotalOf(items);
  const discount = promo ? Math.min(subtotal, promo.type === "percent" ? Math.round((subtotal * promo.value) / 100) : promo.value) : 0;
  return { subtotal, discount, total: subtotal - discount, count: items.reduce((n, i) => n + i.qty, 0) };
}

/** true лише після гідратації — щоб не блимати порожнім кошиком із серверного рендеру */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
