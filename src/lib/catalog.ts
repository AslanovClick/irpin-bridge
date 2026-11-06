/*
 * Шар доступу до даних. Зараз читає моки; коли з'явиться бекенд —
 * міняємо реалізацію тут, компоненти не чіпаємо.
 */
import { artistName } from "@/data/art";
import { CATEGORIES, SIZE_CHARTS } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import type { Category, Product, SizeChart } from "@/data/types";

const bySlug = (slugs: string[]) =>
  slugs.map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));

/* ── Каталог ── */

export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return CATEGORIES.find((c) => c.slug === slug);
}

export async function getProducts(category?: string): Promise<Product[]> {
  return category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.slug === slug);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return PRODUCTS.map((p) => p.slug);
}

export async function getSizeChart(product: Product): Promise<SizeChart | undefined> {
  const key = CATEGORIES.find((c) => c.slug === product.category)?.sizeChart;
  return key ? SIZE_CHARTS[key] : undefined;
}

/** Схожі товари: та сама колекція → та сама категорія → популярні */
export async function getRelated(product: Product, limit = 4): Promise<Product[]> {
  const others = PRODUCTS.filter((p) => p.id !== product.id);
  const score = (p: Product) =>
    (product.collection && p.collection === product.collection ? 100 : 0) +
    (p.category === product.category ? 50 : 0) +
    p.popularity / 10;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/* ── Добірки для головної ── */

export async function getPopularProducts(): Promise<Product[]> {
  return bySlug([
    "futbolka-mistse-shcho-iednaie",
    "khudi-mistse-shcho-iednaie",
    "shoper-znak-laim",
    "futbolka-bazova-mini-logo",
  ]);
}

export async function getNewProducts(): Promise<Product[]> {
  return bySlug(["khudi-zip-pine", "svitshot-kolory-irpenia", "khudi-mistse-shcho-iednaie", "shoper-znak-synii"]);
}

export async function getCollectionProducts(collection: string): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.collection === collection);
}

/* ── Утиліти (можна використовувати і на клієнті) ── */

export function isInStock(p: Product) {
  return p.variants.some((v) => v.stock > 0);
}

export function availableSizes(p: Product, color?: string) {
  return p.sizes.filter((s) => p.variants.some((v) => v.size === s && v.stock > 0 && (!color || v.color === color)));
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("uk-UA").format(value)} ₴`;
}

/** Пошук без урахування регістру й апострофів: назва, категорія, артикул, автор */
export function searchProducts(products: Product[], query: string, categories: Category[] = CATEGORIES) {
  const norm = (s: string) => s.toLowerCase().replace(/[’'ʼ«»"]/g, "").trim();
  const q = norm(query);
  if (q.length < 2) return [];
  const words = q.split(/\s+/);
  return products.filter((p) => {
    const cat = categories.find((c) => c.slug === p.category)?.name ?? "";
    const hay = norm(`${p.name} ${cat} ${p.sku} ${artistName(p.artist) ?? ""} ${p.colors.map((c) => c.name).join(" ")}`);
    return words.every((w) => hay.includes(w));
  });
}
