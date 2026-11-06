import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог — одяг і мерч власного виробництва",
  description:
    "Футболки, худі, світшоти, шопери й аксесуари IRPIN BRIDGE. Власне виробництво в Ірпені, DTF-друк і вишивка, можна додати свій дизайн.",
  alternates: { canonical: "/catalog" },
};

export default async function Page() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return <CatalogPage categories={categories} products={products} allProducts={products} />;
}
