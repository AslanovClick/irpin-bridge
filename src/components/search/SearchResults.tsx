"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { track } from "@/lib/analytics";
import type { Product } from "@/data/types";
import { searchProducts } from "@/lib/catalog";
import { productsWord } from "@/lib/plural";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/ui/ProductCard";
import styles from "./SearchPage.module.css";

/** Результати пошуку за ?q=. Обгортати в <Suspense> (useSearchParams). */
export function SearchResults({
  products,
  popular,
}: {
  products: Product[];
  popular: Product[];
}) {
  const q = useSearchParams().get("q")?.trim() ?? "";
  return <SearchResultsView q={q} products={products} popular={popular} />;
}

export function SearchResultsView({
  q,
  products,
  popular,
}: {
  q: string;
  products: Product[];
  popular: Product[];
}) {
  useEffect(() => {
    if (q) track({ name: "search", search_term: q });
  }, [q]);
  const results = useMemo(() => searchProducts(products, q), [products, q]);

  return (
    <>
      <form action="/search" role="search" className={styles.form}>
        <label htmlFor="search-q" className="visually-hidden">
          Пошук товарів
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Що шукаєте?"
          key={q}
        />
        <button type="submit" aria-label="Шукати">
          <Icon name="search" size={24} />
        </button>
      </form>

      {q.length >= 2 && (
        <p className={styles.summary} aria-live="polite">
          {results.length > 0 ? (
            <>
              За запитом «<strong>{q}</strong>» — {productsWord(results.length)}
            </>
          ) : (
            <>
              За запитом «<strong>{q}</strong>» нічого не знайшли
            </>
          )}
        </p>
      )}

      {results.length > 0 ? (
        <>
          <h2 className="visually-hidden">Знайдені товари</h2>
          <ul role="list" className={styles.grid}>
            {results.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          {q.length >= 2 && (
            <div className={styles.nothing}>
              <p>
                Спробуйте інше слово або перегляньте весь каталог. Не знайшли
                потрібного — зробимо під замовлення.
              </p>
              <div className="actions">
                <Button href="/catalog" arrow>
                  До каталогу
                </Button>
                <Button href="/customize" variant="link">
                  Створити свій мерч
                </Button>
              </div>
            </div>
          )}
          <h2 className={styles.subtitle}>Популярне</h2>
          <ul role="list" className={styles.grid}>
            {popular.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
