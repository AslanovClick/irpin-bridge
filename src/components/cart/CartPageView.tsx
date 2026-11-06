"use client";

import type { Product } from "@/data/types";
import { itemKey, useCart, useHydrated } from "@/lib/cart";
import { productsWord } from "@/lib/plural";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { CartLine, MissionNote, PromoForm, Totals } from "./CartParts";
import styles from "./Cart.module.css";
import gridStyles from "@/components/search/SearchPage.module.css";

export function CartPageView({ popular }: { popular: Product[] }) {
  const items = useCart();
  const hydrated = useHydrated();
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <>
      <h1 className={styles.title}>
        Кошик{hydrated && count > 0 && <span>{productsWord(count)}</span>}
      </h1>

      {!hydrated ? (
        <div className={styles.skeleton} aria-hidden="true" />
      ) : items.length === 0 ? (
        <>
          <div className={styles.empty}>
            <p>У кошику поки нічого немає. Оберіть готову річ або створіть свою — від однієї штуки.</p>
            <div className="actions">
              <Button href="/catalog" size="lg" arrow>
                До каталогу
              </Button>
              <Button href="/customize" variant="link">
                Створити свій мерч
              </Button>
            </div>
          </div>
          <h2 className={gridStyles.subtitle}>Популярне</h2>
          <ul role="list" className={gridStyles.grid}>
            {popular.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.layout}>
          <div>
            <ul role="list" className={styles.list}>
              {items.map((i) => (
                <CartLine key={itemKey(i)} item={i} />
              ))}
            </ul>
            <div className={styles.continue}>
              <Button href="/catalog" variant="link" arrow>
                Продовжити покупки
              </Button>
            </div>
          </div>

          <aside className={styles.summary} aria-label="Підсумок замовлення">
            <h2 className={styles.summaryTitle}>Разом</h2>
            <Totals />
            <PromoForm />
            <Button href="/checkout" size="lg" arrow block>
              Оформити замовлення
            </Button>
            <div className={styles.pay} aria-label="Способи оплати">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Apple Pay</span>
              <span>Google Pay</span>
            </div>
            <MissionNote />
          </aside>
        </div>
      )}
    </>
  );
}
