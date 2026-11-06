"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CART_OPEN_EVENT, useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { CartLine, MissionNote, Totals } from "./CartParts";
import styles from "./Cart.module.css";

/** Міні-кошик: виїжджає праворуч після «Додати в кошик» або кліку по іконці в шапці */
export function CartDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const items = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const open = () => ref.current?.showModal();
    window.addEventListener(CART_OPEN_EVENT, open);
    return () => window.removeEventListener(CART_OPEN_EVENT, open);
  }, []);

  // Перехід на іншу сторінку — закриваємо
  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-labelledby="mini-cart-title"
      onClick={(e) => e.target === ref.current && close()}
    >
      <div className={styles.drawerInner}>
        <div className={styles.drawerHead}>
          <h2 id="mini-cart-title">
            Кошик {items.length > 0 && <span>{items.reduce((n, i) => n + i.qty, 0)}</span>}
          </h2>
          <button type="button" className={styles.close} onClick={close} aria-label="Закрити кошик">
            <Icon name="close" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.drawerEmpty}>
            <Logo variant="mark" title="" className={styles.emptyMark} />
            <p className={styles.emptyTitle}>Кошик порожній</p>
            <p>Подивіться хіти каталогу або створіть річ зі своїм дизайном.</p>
            <Button href="/catalog" arrow block>
              До каталогу
            </Button>
            <Button href="/customize" variant="link">
              Створити свій мерч
            </Button>
          </div>
        ) : (
          <>
            <ul role="list" className={styles.drawerList}>
              {items.map((i) => (
                <CartLine key={`${i.productId}|${i.color}|${i.size}`} item={i} compact onNavigate={close} />
              ))}
            </ul>
            <div className={styles.drawerFoot}>
              <Totals deliveryNote={false} />
              <Button href="/checkout" size="lg" arrow block>
                Оформити замовлення
              </Button>
              <Button href="/cart" variant="outline" block>
                Переглянути кошик
              </Button>
              <MissionNote />
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
