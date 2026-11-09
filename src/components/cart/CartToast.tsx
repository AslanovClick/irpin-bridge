"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CART_ADDED_EVENT, type CartAddedDetail, openCartDrawer } from "@/lib/cart";
import { Icon } from "@/components/ui/Icon";
import styles from "./CartToast.module.css";

const HIDE_AFTER = 4500;

/** Коротке сповіщення «Додано в кошик» замість автоматичного відкриття кошика */
export function CartToast() {
  const [shown, setShown] = useState<(CartAddedDetail & { path: string }) | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    const onAdded = (e: Event) => {
      setShown({ ...(e as CustomEvent<CartAddedDetail>).detail, path: window.location.pathname });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShown(null), HIDE_AFTER);
    };
    window.addEventListener(CART_ADDED_EVENT, onAdded);
    return () => {
      window.removeEventListener(CART_ADDED_EVENT, onAdded);
      window.clearTimeout(timer.current);
    };
  }, []);

  // На іншій сторінці сповіщення вже не актуальне
  const item = shown && shown.path === pathname ? shown : null;
  const setItem = setShown;

  const pause = () => window.clearTimeout(timer.current);
  const resume = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setItem(null), HIDE_AFTER);
  };

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {item && (
        <div className={styles.toast} onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}>
          <span className={styles.icon} aria-hidden="true">
            <Icon name="check" size={18} />
          </span>
          <p className={styles.text}>
            <strong>Додано в кошик</strong>
            <span>
              {item.name} · {item.size}
              {item.qty > 1 && ` · ${item.qty} шт.`}
            </span>
          </p>
          <button
            type="button"
            className={styles.open}
            onClick={() => {
              setItem(null);
              openCartDrawer();
            }}
          >
            Відкрити кошик
          </button>
          <button type="button" className={styles.close} onClick={() => setItem(null)} aria-label="Закрити сповіщення">
            <Icon name="close" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
