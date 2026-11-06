"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { formatPrice } from "@/lib/catalog";
import {
  applyPromo,
  itemKey,
  removeItem,
  removePromo,
  setQty,
  totalsOf,
  useCartState,
  type CartItem,
} from "@/lib/cart";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "./Cart.module.css";

/* ── Мініатюра товару ── */
export function CartThumb({ item, size = 88 }: { item: CartItem; size?: number }) {
  return (
    <span
      className={styles.thumb}
      style={{ width: size, ...(item.image ? {} : { background: item.placeholder?.bg ?? "var(--c-gray-100)", color: item.placeholder?.fg }) }}
    >
      {item.image ? (
        <Image src={item.image} alt="" fill sizes={`${size}px`} />
      ) : (
        <Logo variant="mark" title="" className={styles.thumbMark} />
      )}
    </span>
  );
}

/* ── Лічильник кількості ── */
export function QtyStepper({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const key = itemKey(item);
  const max = item.max ?? 99;
  return (
    <div className={[styles.qty, compact && styles.qtyCompact].filter(Boolean).join(" ")} role="group" aria-label={`Кількість: ${item.name}`}>
      <button type="button" onClick={() => setQty(key, item.qty - 1)} disabled={item.qty <= 1} aria-label="Менше">
        −
      </button>
      <output aria-live="polite">{item.qty}</output>
      <button type="button" onClick={() => setQty(key, item.qty + 1)} disabled={item.qty >= max} aria-label="Більше">
        +
      </button>
    </div>
  );
}

/* ── Рядок кошика ── */
export function CartLine({ item, compact = false, onNavigate }: { item: CartItem; compact?: boolean; onNavigate?: () => void }) {
  const key = itemKey(item);
  const meta = [item.color, item.size !== "One size" ? `розмір ${item.size}` : null].filter(Boolean).join(" · ");
  return (
    <li className={[styles.line, compact && styles.lineCompact].filter(Boolean).join(" ")}>
      <Link href={`/product/${item.slug}`} onClick={onNavigate} tabIndex={-1} aria-hidden="true">
        <CartThumb item={item} size={compact ? 72 : 104} />
      </Link>
      <div className={styles.lineBody}>
        <div className={styles.lineTop}>
          <div>
            <Link href={`/product/${item.slug}`} className={styles.lineName} onClick={onNavigate}>
              {item.name}
            </Link>
            <p className={styles.lineMeta}>{meta}</p>
          </div>
          <button type="button" className={styles.remove} onClick={() => removeItem(key)} aria-label={`Видалити ${item.name}`}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className={styles.lineBottom}>
          <QtyStepper item={item} compact={compact} />
          <p className={styles.linePrice}>
            {formatPrice(item.price * item.qty)}
            {/* Рядок «за шт.» завжди в розмітці — інакше рядок «стрибає» при зміні кількості */}
            <span style={{ visibility: item.qty > 1 ? "visible" : "hidden" }}>{formatPrice(item.price)} / шт.</span>
          </p>
        </div>
      </div>
    </li>
  );
}

/* ── Промокод ── */
export function PromoForm() {
  const { promo } = useCartState();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  if (promo) {
    return (
      <div className={styles.promoApplied}>
        <span>
          <Icon name="check" size={16} /> <strong>{promo.code}</strong> · {promo.label}
        </span>
        <button type="button" className={styles.textBtn} onClick={removePromo}>
          Прибрати
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className={styles.promoToggle} onClick={() => setOpen(true)}>
        <Icon name="plus" size={16} /> Маю промокод
      </button>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(applyPromo(code));
  };

  return (
    <form className={styles.promo} onSubmit={submit} noValidate>
      <label htmlFor="promo-code" className="visually-hidden">
        Промокод
      </label>
      <div className={styles.promoRow}>
        <input
          id="promo-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          placeholder="Промокод"
          autoCapitalize="characters"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "promo-error" : undefined}
          autoFocus
        />
        <button type="submit">Застосувати</button>
      </div>
      {error && (
        <p id="promo-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

/* ── Підсумки ── */
export function Totals({ deliveryNote = true }: { deliveryNote?: boolean }) {
  const s = useCartState();
  const t = totalsOf(s);
  return (
    <dl className={styles.totals}>
      <div>
        <dt>Товари ({t.count})</dt>
        <dd>{formatPrice(t.subtotal)}</dd>
      </div>
      {t.discount > 0 && (
        <div className={styles.discount}>
          <dt>Знижка {s.promo?.code}</dt>
          <dd>−{formatPrice(t.discount)}</dd>
        </div>
      )}
      {deliveryNote && (
        <div>
          <dt>Доставка</dt>
          <dd className={styles.muted}>за тарифами Нової пошти</dd>
        </div>
      )}
      <div className={styles.grand}>
        <dt>До сплати</dt>
        <dd>{formatPrice(t.total)}</dd>
      </div>
    </dl>
  );
}

export function MissionNote() {
  return (
    <p className={styles.mission}>
      <Logo variant="mark" title="" className={styles.missionMark} />
      <span>Частина прибутку з вашого замовлення піде на соціальні проєкти Ірпінської громади.</span>
    </p>
  );
}
