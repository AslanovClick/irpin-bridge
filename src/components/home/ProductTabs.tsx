"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { Product } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./ProductTabs.module.css";

type Tab = { key: string; label: string; products: Product[] };

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  return (
    <section className="theme-light section" aria-labelledby={`${uid}-title`}>
      <div className="container">
        <SectionHead
          id={`${uid}-title`}
          title="Хіти та новинки"
          action={
            <div className={styles.controls}>
              <div role="tablist" aria-label="Добірки товарів" className={styles.tabs}>
                {tabs.map((t, i) => (
                  <button
                    key={t.key}
                    id={`${uid}-tab-${i}`}
                    role="tab"
                    type="button"
                    aria-selected={i === active}
                    aria-controls={`${uid}-panel`}
                    tabIndex={i === active ? 0 : -1}
                    className={styles.tab}
                    onClick={() => setActive(i)}
                    onKeyDown={onKey}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <Button href="/catalog" variant="link" arrow>
                Весь каталог
              </Button>
            </div>
          }
        />

        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className={styles.panel}>
          <ul role="list" className={styles.grid} key={tabs[active].key}>
            {tabs[active].products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
