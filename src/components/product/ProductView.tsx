"use client";

import Link from "next/link";
import { artistName } from "@/data/art";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductBadge, SizeChart } from "@/data/types";
import { addToCart, openCartDrawer } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { availableSizes, formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Gallery } from "./Gallery";
import { Share } from "./Share";
import styles from "./Product.module.css";

const BADGE_LABEL: Partial<Record<ProductBadge, string>> = {
  new: "Новинка",
  hit: "Хіт",
  art: "Арт-мерч",
  sale: "Знижка",
};

type Props = { product: Product; sizeChart?: SizeChart; categoryName: string };

export function ProductView({ product, sizeChart, categoryName }: Props) {
  useEffect(() => {
    track({
      name: "view_item",
      value: product.price,
      items: [{ item_id: product.slug, item_name: product.name, item_category: categoryName, price: product.price, quantity: 1 }],
    });
  }, [product.slug, product.name, product.price, categoryName]);

  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const single = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(single ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const chartRef = useRef<HTMLDialogElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const images = useMemo(() => {
    const byColor = product.images.filter((i) => i.color === color);
    return byColor.length ? byColor : product.images.filter((i) => !i.color);
  }, [product.images, color]);

  const inColor = availableSizes(product, color);
  const sizeOk = size !== null && inColor.includes(size);
  const inStock = inColor.length > 0;
  const badges = product.badges.filter((b) => BADGE_LABEL[b]);

  // Липка кнопка на мобільному — коли основна кнопка пішла за екран
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = () => {
    if (!sizeOk) {
      setError(true);
      buyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      color,
      size: size!,
      qty,
      max: product.variants.find((v) => v.color === color && v.size === size)?.stock,
      image: images[0]?.src,
      placeholder: product.placeholder,
    });
    openCartDrawer();
  };

  return (
    <div className={styles.layout}>
      <Gallery product={product} images={images} />

      <div className={styles.info}>
        {badges.length > 0 && (
          <ul role="list" className={styles.badges}>
            {badges.map((b) => (
              <li key={b} className={`${styles.badge} ${styles[`badge-${b}`] ?? ""}`}>
                {BADGE_LABEL[b]}
              </li>
            ))}
          </ul>
        )}

        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.meta}>
          {categoryName} · Артикул {product.sku}
        </p>
        {product.artist && (
          <p className={styles.meta}>
            Автор: <Link href={`/art/artists/${product.artist}`}><strong>{artistName(product.artist)}</strong></Link>
          </p>
        )}

        <p className={styles.price}>
          <span className="visually-hidden">Ціна: </span>
          {formatPrice(product.price)}
          {product.oldPrice && (
            <s>
              <span className="visually-hidden">Стара ціна: </span>
              {formatPrice(product.oldPrice)}
            </s>
          )}
        </p>

        {/* Колір */}
        <fieldset className={styles.option}>
          <legend className={styles.optionTitle}>
            Колір: <span>{color}</span>
          </legend>
          <div className={styles.swatches}>
            {product.colors.map((c) => (
              <label key={c.key} className={styles.swatch} title={c.name}>
                <input
                  type="radio"
                  name="color"
                  value={c.name}
                  checked={color === c.name}
                  onChange={() => {
                    setColor(c.name);
                    setError(false);
                  }}
                />
                <span style={{ background: c.hex }} aria-hidden="true" />
                <span className="visually-hidden">{c.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Розмір */}
        {!single && (
          <fieldset className={styles.option} aria-describedby={error ? "size-error" : undefined}>
            <legend className={styles.optionTitle}>
              Розмір{size && sizeOk ? <span>: {size}</span> : null}
              {sizeChart && (
                <button type="button" className={styles.chartLink} onClick={() => chartRef.current?.showModal()}>
                  Таблиця розмірів
                </button>
              )}
            </legend>
            <div className={styles.sizes}>
              {product.sizes.map((s) => {
                const available = inColor.includes(s);
                return (
                  <label key={s} className={styles.size} data-disabled={!available || undefined}>
                    <input
                      type="radio"
                      name="size"
                      value={s}
                      disabled={!available}
                      checked={size === s}
                      onChange={() => {
                        setSize(s);
                        setError(false);
                      }}
                    />
                    <span>
                      {s}
                      {!available && <span className="visually-hidden"> — немає в наявності</span>}
                    </span>
                  </label>
                );
              })}
            </div>
            {error && (
              <p id="size-error" className={styles.error} role="alert">
                Оберіть розмір
              </p>
            )}
          </fieldset>
        )}

        <p className={styles.stock}>
          <span className={inStock ? styles.dotOk : styles.dotNo} aria-hidden="true" />
          {inStock ? "В наявності — відправимо за 1–2 робочі дні" : "Немає в наявності в цьому кольорі"}
        </p>

        {/* Кількість і дії */}
        <div ref={buyRef} className={styles.buy}>
          <div className={styles.qty} role="group" aria-label="Кількість">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Менше" disabled={qty <= 1}>
              −
            </button>
            <output aria-live="polite">{qty}</output>
            <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Більше">
              +
            </button>
          </div>
          <Button size="lg" arrow onClick={add} disabled={!inStock} className={styles.addBtn}>
            Додати в кошик
          </Button>
        </div>

        {product.customizable && (
          <Link href={`/customize?product=${product.slug}`} className={styles.customize}>
            <span className={styles.customizeIcon}>
              <Icon name="upload" size={20} />
            </span>
            <span>
              <strong>Додати свій дизайн</strong>
              <span>Принт, вишивка чи напис на цьому виробі — від однієї речі</span>
            </span>
            <Icon name="arrow" size={20} />
          </Link>
        )}

        <ul role="list" className={styles.facts}>
          <li>
            <Icon name="truck" size={22} />
            <span>
              <strong>Нова пошта</strong> 1–3 дні
            </span>
          </li>
          <li>
            <Icon name="return" size={22} />
            <span>
              <strong>Обмін</strong> 14 днів
            </span>
          </li>
          <li>
            <Logo variant="mark" title="" className={styles.factMark} />
            <span>
              <strong>Власне</strong> виробництво
            </span>
          </li>
        </ul>

        <p className={styles.mission}>
          <Logo variant="mark" title="" className={styles.missionMark} />
          <span>
            Ваша покупка підтримує соціальні проєкти Ірпінської громади.{" "}
            <Link href="/about#mission">Як це працює</Link>
          </span>
        </p>

        {/* Деталі */}
        <div className={styles.details}>
          <details name="product-details" open>
            <summary>Опис</summary>
            <p>{product.description}</p>
          </details>
          <details name="product-details">
            <summary>Матеріал і догляд</summary>
            <p>{product.material}</p>
            <ul>
              {product.care.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </details>
          <details name="product-details">
            <summary>Доставка й оплата</summary>
            <ul>
              <li>Нова пошта: у відділення, поштомат або кур&apos;єром, 1–3 дні</li>
              <li>Оплата онлайн карткою, Apple Pay або Google Pay</li>
              <li>Самовивіз зі студії в Ірпені — за домовленістю</li>
            </ul>
            <Link href="/info/payment-delivery">Детальніше про доставку</Link>
          </details>
          <details name="product-details">
            <summary>Обмін і повернення</summary>
            <p>Протягом 14 днів, якщо річ не носили й збережено вигляд. Кастомізовані вироби обміну не підлягають.</p>
            <Link href="/info/returns">Умови обміну</Link>
          </details>
        </div>

        <Share title={product.name} />
      </div>

      {/* Таблиця розмірів */}
      {sizeChart && (
        <dialog
          ref={chartRef}
          className={styles.chart}
          aria-labelledby="chart-title"
          onClick={(e) => e.target === chartRef.current && chartRef.current?.close()}
        >
          <div className={styles.chartInner}>
            <div className={styles.chartHead}>
              <h2 id="chart-title">Таблиця розмірів · {sizeChart.title}</h2>
              <button type="button" onClick={() => chartRef.current?.close()} aria-label="Закрити">
                <Icon name="close" />
              </button>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Розмір</th>
                    {sizeChart.columns.map((c) => (
                      <th key={c} scope="col">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.rows.map((r) => (
                    <tr key={r.size} aria-current={r.size === size || undefined}>
                      <th scope="row">{r.size}</th>
                      {r.values.map((v, i) => (
                        <td key={i}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.chartNote}>{sizeChart.note}</p>
          </div>
        </dialog>
      )}

      {/* Липка панель покупки на мобільному */}
      <div className={styles.sticky} data-visible={showSticky} aria-hidden={!showSticky}>
        <div>
          <p className={styles.stickyName}>{product.name}</p>
          <p className={styles.stickyPrice}>{formatPrice(product.price)}</p>
        </div>
        <Button onClick={add} disabled={!inStock} tabIndex={showSticky ? 0 : -1}>
          {sizeOk ? "У кошик" : "Обрати розмір"}
        </Button>
      </div>

    </div>
  );
}
