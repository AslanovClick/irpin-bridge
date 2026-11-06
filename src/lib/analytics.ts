/*
 * Аналітика: GA4 і Meta Pixel. Скрипти завантажуються лише після згоди (компонент <Analytics />),
 * події надсилаються лише в ті системи, на які є згода. ID задаються змінними середовища:
 * NEXT_PUBLIC_GA_ID (G-XXXXXXX) і NEXT_PUBLIC_META_PIXEL_ID. Без ID — події лише в консоль у dev.
 */
import type { CartItem } from "./cart";
import { getConsent } from "./consent";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

type Item = { item_id: string; item_name: string; item_category?: string; item_variant?: string; price: number; quantity: number };

export type AnalyticsEvent =
  | { name: "view_item"; value: number; items: Item[] }
  | { name: "add_to_cart"; value: number; items: Item[] }
  | { name: "begin_checkout"; value: number; items: Item[] }
  | { name: "purchase"; transaction_id: string; value: number; items: Item[]; coupon?: string }
  | { name: "generate_lead"; lead_type: string }
  | { name: "search"; search_term: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/* Відповідність подій GA4 стандартним подіям Meta */
const META_EVENT: Record<AnalyticsEvent["name"], string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  generate_lead: "Lead",
  search: "Search",
};

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const { name, ...params } = event;
  const consent = getConsent();
  const withCurrency = "value" in params ? { currency: "UAH", ...params } : params;

  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", name, withCurrency);

  if (consent?.analytics && window.gtag) window.gtag("event", name, withCurrency);

  if (consent?.marketing && window.fbq) {
    const meta: Record<string, unknown> = {};
    if ("value" in params) Object.assign(meta, { value: params.value, currency: "UAH" });
    if ("items" in params) Object.assign(meta, { content_ids: params.items.map((i) => i.item_id), content_type: "product", num_items: params.items.length });
    if ("search_term" in params) meta.search_string = params.search_term;
    if ("lead_type" in params) meta.content_category = params.lead_type;
    window.fbq("track", META_EVENT[name], meta);
  }
}

/** Позиція кошика → товар для GA4 */
export const cartItem = (i: CartItem): Item => ({
  item_id: i.slug,
  item_name: i.name,
  item_variant: [i.color, i.size].filter(Boolean).join(" / "),
  price: i.price,
  quantity: i.qty,
});

/** Подія лише один раз за сесію для ключа (оновлення сторінки «Дякуємо» не дублює покупку) */
export function trackOnce(key: string, event: AnalyticsEvent) {
  try {
    const k = `ib-tracked:${key}`;
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, "1");
  } catch {
    /* без сховища — просто надсилаємо */
  }
  track(event);
}
