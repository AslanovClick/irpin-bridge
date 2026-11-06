/*
 * Фільтри каталогу. Стан живе в URL (?size=M,L&color=black&sort=price-asc),
 * щоб посиланням можна було поділитися, а сторінки — індексувати.
 */
import type { ColorOption, Product } from "@/data/types";
import { isInStock } from "./catalog";

export const SORTS = [
  { key: "popular", label: "Популярні" },
  { key: "new", label: "Новинки" },
  { key: "price-asc", label: "Ціна: від низької" },
  { key: "price-desc", label: "Ціна: від високої" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

export const FLAGS = [
  { key: "stock", label: "Тільки в наявності" },
  { key: "custom", label: "Можна кастомізувати" },
  { key: "art", label: "Арт-мерч" },
  { key: "sale", label: "Зі знижкою" },
] as const;

export type FlagKey = (typeof FLAGS)[number]["key"];

export type FilterState = {
  sizes: string[];
  colors: string[];
  min?: number;
  max?: number;
  flags: FlagKey[];
  sort: SortKey;
};

type ParamsLike = { get(name: string): string | null };

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const num = (v: string | null) => {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function parseFilters(params: ParamsLike): FilterState {
  const sort = params.get("sort");
  return {
    sizes: list(params.get("size")),
    colors: list(params.get("color")),
    min: num(params.get("min")),
    max: num(params.get("max")),
    flags: FLAGS.map((f) => f.key).filter((k) => params.get(k) === "1"),
    sort: SORTS.some((s) => s.key === sort) ? (sort as SortKey) : "popular",
  };
}

export function serializeFilters(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.sizes.length) p.set("size", f.sizes.join(","));
  if (f.colors.length) p.set("color", f.colors.join(","));
  if (f.min !== undefined) p.set("min", String(f.min));
  if (f.max !== undefined) p.set("max", String(f.max));
  f.flags.forEach((k) => p.set(k, "1"));
  if (f.sort !== "popular") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function activeCount(f: FilterState) {
  return f.sizes.length + f.colors.length + f.flags.length + (f.min !== undefined || f.max !== undefined ? 1 : 0);
}

export function applyFilters(products: Product[], f: FilterState): Product[] {
  const out = products.filter((p) => {
    if (f.sizes.length && !p.variants.some((v) => f.sizes.includes(v.size) && v.stock > 0)) return false;
    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c.key))) return false;
    if (f.min !== undefined && p.price < f.min) return false;
    if (f.max !== undefined && p.price > f.max) return false;
    if (f.flags.includes("stock") && !isInStock(p)) return false;
    if (f.flags.includes("custom") && !p.customizable) return false;
    if (f.flags.includes("art") && !p.badges.includes("art")) return false;
    if (f.flags.includes("sale") && !p.oldPrice) return false;
    return true;
  });

  const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
    popular: (a, b) => b.popularity - a.popularity,
    new: (a, b) => b.createdAt.localeCompare(a.createdAt),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };
  return out.sort(sorters[f.sort]);
}

/* Групи розмірів: буквені й числові не змішуємо */
const SIZE_GROUPS = [
  { label: "Одяг", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { label: "Дитячий одяг, зріст", sizes: ["110", "122", "134", "146"] },
  { label: "Шкарпетки", sizes: ["36–40", "41–45"] },
];

export type SizeGroup = { label: string; sizes: string[] };

/** Значення для панелі фільтрів — лише ті, що є серед товарів поточної категорії */
export function facets(products: Product[]) {
  const present = new Set(products.flatMap((p) => p.sizes));
  const sizeGroups: SizeGroup[] = SIZE_GROUPS.map((g) => ({ label: g.label, sizes: g.sizes.filter((s) => present.has(s)) })).filter(
    (g) => g.sizes.length > 0,
  );
  const colorMap = new Map<string, ColorOption>();
  products.forEach((p) => p.colors.forEach((c) => colorMap.set(c.key, c)));
  const prices = products.map((p) => p.price);
  return {
    sizeGroups,
    colors: [...colorMap.values()],
    priceMin: prices.length ? Math.floor(Math.min(...prices) / 10) * 10 : 0,
    priceMax: prices.length ? Math.ceil(Math.max(...prices) / 10) * 10 : 0,
  };
}

export type Facets = ReturnType<typeof facets>;
