import Link from "next/link";
import { Suspense } from "react";
import type { Category, Product } from "@/data/types";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogShell, CatalogView } from "./CatalogView";
import styles from "./CatalogPage.module.css";

type Props = {
  categories: Category[];
  products: Product[];
  /** Усі товари — для лічильників у навігації категорій */
  allProducts: Product[];
  category?: Category;
};

export function CatalogPage({ categories, products, allProducts, category }: Props) {
  const countIn = (slug?: string) => (slug ? allProducts.filter((p) => p.category === slug).length : allProducts.length);

  return (
    <section className="theme-light">
      <div className={`container ${styles.wrap}`}>
        <Breadcrumbs
          items={category ? [{ label: "Каталог", href: "/catalog" }, { label: category.name }] : [{ label: "Каталог" }]}
        />

        <header className={styles.head}>
          <h1 className={styles.title}>{category?.name ?? "Каталог"}</h1>
          <p className={styles.intro}>
            {category?.intro ??
              "Одяг і аксесуари власного виробництва. Більшість моделей можна кастомізувати."}
          </p>
        </header>

        <nav aria-label="Категорії" className={styles.cats}>
          <ul role="list">
            <li>
              <Link href="/catalog" className={styles.cat} aria-current={!category ? "page" : undefined}>
                Усі <span>{countIn()}</span>
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalog/${c.slug}`}
                  className={styles.cat}
                  aria-current={category?.slug === c.slug ? "page" : undefined}
                >
                  {c.name} <span>{countIn(c.slug)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Suspense fallback={<CatalogShell products={products} />}>
          <CatalogView products={products} />
        </Suspense>

        {category?.seo && (
          <div className={styles.seo}>
            <h2>{category.name} від IRPIN BRIDGE</h2>
            <p>{category.seo}</p>
          </div>
        )}
      </div>
    </section>
  );
}
