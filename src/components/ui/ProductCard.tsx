import Image from "next/image";
import { artistName } from "@/data/art";
import Link from "next/link";
import type { Product, ProductBadge } from "@/data/types";
import { availableSizes, formatPrice, isInStock } from "@/lib/catalog";
import { Logo } from "./Logo";
import styles from "./ProductCard.module.css";

const BADGE_LABEL: Record<ProductBadge, string> = {
  new: "Новинка",
  hit: "Хіт",
  art: "Арт-мерч",
  custom: "Можна кастомізувати",
  sale: "Знижка",
};

/** На фото — лише одна, найважливіша мітка */
const BADGE_PRIORITY: ProductBadge[] = ["sale", "new", "hit", "art"];

function sizeRange(sizes: string[]) {
  if (sizes.length === 0) return null;
  if (sizes.length === 1) return sizes[0];
  return `${sizes[0]}–${sizes[sizes.length - 1]}`;
}

type Props = {
  product: Product;
  sizes?: string;
  /** Компактна картка на кольоровому фоні (колаборації) */
  tone?: "default" | "onColor";
};

export function ProductCard({ product, sizes = "(max-width: 600px) 75vw, (max-width: 1100px) 40vw, 25vw", tone = "default" }: Props) {
  const [main, hover] = product.images;
  const inStock = isInStock(product);
  const avail = availableSizes(product);
  const badge = BADGE_PRIORITY.find((b) => product.badges.includes(b));

  return (
    <article className={[styles.card, tone === "onColor" && styles.onColor].filter(Boolean).join(" ")}>
      <Link href={`/product/${product.slug}`} className={styles.media} aria-label={product.name}>
        {main ? (
          <>
            <Image src={main.src} alt={main.alt} fill sizes={sizes} className={styles.img} />
            {hover && <Image src={hover.src} alt="" fill sizes={sizes} className={`${styles.img} ${styles.imgHover}`} />}
          </>
        ) : (
          <div
            className={styles.placeholder}
            style={{ background: product.placeholder?.bg ?? "var(--c-gray-100)", color: product.placeholder?.fg ?? "var(--c-black)" }}
          >
            <Logo variant="mark" className={styles.placeholderMark} title="" />
            <span className={styles.placeholderNote}>Фото незабаром</span>
          </div>
        )}

        {badge && <span className={`${styles.badge} ${styles[`badge-${badge}`]}`}>{BADGE_LABEL[badge]}</span>}
      </Link>

      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        {product.artist && <p className={styles.meta}>Автор: {artistName(product.artist)}</p>}

        <div className={styles.row}>
          <p className={styles.price}>
            <span className="visually-hidden">Ціна: </span>
            {formatPrice(product.price)}
            {product.oldPrice && (
              <s className={styles.oldPrice}>
                <span className="visually-hidden">Стара ціна: </span>
                {formatPrice(product.oldPrice)}
              </s>
            )}
          </p>
          <ul role="list" className={styles.swatches} aria-label="Кольори">
            {product.colors.map((c) => (
              <li key={c.name} className={styles.swatch} style={{ background: c.hex }} title={c.name}>
                <span className="visually-hidden">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.meta}>
          {inStock ? (
            <>
              <span className={styles.dot} aria-hidden="true" /> В наявності · {sizeRange(avail)}
            </>
          ) : (
            "Немає в наявності"
          )}
        </p>
        {product.customizable && <p className={styles.custom}>+ можна додати свій дизайн</p>}
      </div>
    </article>
  );
}
