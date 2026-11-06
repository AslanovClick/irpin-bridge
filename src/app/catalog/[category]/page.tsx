import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getCategories, getCategory, getProducts } from "@/lib/catalog";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalog/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} — купити онлайн`,
    description: `${category.intro} Власне виробництво в Ірпені, доставка Новою поштою.`,
    alternates: { canonical: `/catalog/${category.slug}` },
  };
}

export default async function Page({ params }: PageProps<"/catalog/[category]">) {
  const { category: slug } = await params;
  const [category, categories, products, all] = await Promise.all([
    getCategory(slug),
    getCategories(),
    getProducts(slug),
    getProducts(),
  ]);
  if (!category) notFound();

  return <CatalogPage categories={categories} products={products} allProducts={all} category={category} />;
}
