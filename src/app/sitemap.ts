import type { MetadataRoute } from "next";
import { ARTISTS, COLLECTIONS } from "@/data/art";
import { LEGAL } from "@/data/legal";
import { SERVICES } from "@/data/services";
import { SITE_URL } from "@/data/site";
import { getCategories, getProducts } from "@/lib/catalog";

/** sitemap.xml: усі публічні сторінки. Службові (кошик, оформлення, результати) не включаємо */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" | "yearly" = "weekly") => ({
    url: url(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "daily"),
    page("/catalog", 0.9, "daily"),
    ...categories.map((c) => page(`/catalog/${c.slug}`, 0.8, "daily")),
    ...products.map((p) => ({
      url: url(`/product/${p.slug}`),
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(p.images[0] ? { images: [url(p.images[0].src)] } : {}),
    })),
    page("/customize", 0.8),
    page("/services", 0.8),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.7)),
    page("/business", 0.8),
    page("/art", 0.7),
    ...COLLECTIONS.map((c) => page(`/art/collections/${c.slug}`, 0.6)),
    ...ARTISTS.map((a) => page(`/art/artists/${a.slug}`, 0.5, "monthly")),
    page("/about", 0.6, "monthly"),
    page("/contacts", 0.6, "monthly"),
    ...LEGAL.map((d) => page(`/info/${d.slug}`, 0.3, "yearly")),
  ];
}
