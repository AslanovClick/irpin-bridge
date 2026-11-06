import type { Metadata } from "next";
import { Suspense } from "react";
import { getPopularProducts, getProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SearchResults, SearchResultsView } from "@/components/search/SearchResults";
import styles from "@/components/search/SearchPage.module.css";

export const metadata: Metadata = {
  title: "Пошук",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const [products, popular] = await Promise.all([getProducts(), getPopularProducts()]);

  return (
    <section className="theme-light">
      <div className={`container ${styles.wrap}`}>
        <Breadcrumbs items={[{ label: "Пошук" }]} />
        <h1 className={styles.title}>Пошук</h1>
        <Suspense fallback={<SearchResultsView q="" products={products} popular={popular} />}>
          <SearchResults products={products} popular={popular} />
        </Suspense>
      </div>
    </section>
  );
}
