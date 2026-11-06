import Image from "next/image";
import Link from "next/link";
import { getArtist, STATUS_LABEL, type Artist, type Collection } from "@/data/art";
import type { Product } from "@/data/types";
import { plural } from "@/lib/plural";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/ui/ProductCard";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./Art.module.css";

/** Смужка кольорів колекції */
export function Palette({ colors, label = "Палітра колекції" }: { colors: string[]; label?: string }) {
  return (
    <div className={styles.palette}>
      <p className={styles.paletteLabel}>{label}</p>
      <ul role="list" aria-label={label}>
        {colors.map((c) => (
          <li key={c} style={{ background: c }} title={c} />
        ))}
      </ul>
    </div>
  );
}

export function StatusBadge({ status }: { status: Collection["status"] }) {
  return (
    <span className={styles.status} data-status={status}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Картка колекції: обкладинка, статус, назва, автор, кількість речей */
export function CollectionCard({ collection, count }: { collection: Collection; count: number }) {
  const artist = getArtist(collection.artist);
  return (
    <Link href={`/art/collections/${collection.slug}`} className={styles.cCard}>
      <span className={styles.cMedia}>
        <Image
          src={collection.cover}
          alt=""
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1100px) 45vw, 25vw"
          style={collection.coverPosition ? { objectPosition: collection.coverPosition } : undefined}
        />
        <StatusBadge status={collection.status} />
        <span className={styles.cPalette} aria-hidden="true">
          {collection.palette.map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </span>
      </span>
      <span className={styles.cBody}>
        <span className={styles.cSeason}>{collection.season}</span>
        <span className={styles.cTitle}>{collection.title}</span>
        <span className={styles.cMeta}>
          {artist?.name}
          {count > 0 && ` · ${count} ${plural(count, ["річ", "речі", "речей"])}`}
        </span>
      </span>
    </Link>
  );
}

/** Картка митця */
export function ArtistCard({ artist, collections }: { artist: Artist; collections: number }) {
  return (
    <Link href={`/art/artists/${artist.slug}`} className={styles.aCard}>
      {artist.photo ? (
        <ShapeImage
          src={artist.photo}
          alt=""
          shape="br"
          ratio="1 / 1"
          notch={[26, 26]}
          objectPosition={artist.photoPosition}
          sizes="(max-width: 640px) 70vw, (max-width: 1100px) 40vw, 22vw"
        />
      ) : (
        <span className={styles.aInitials}>{artist.name.charAt(0)}</span>
      )}
      <span className={styles.aBody}>
        <span className={styles.aRole}>
          {artist.role} · {artist.city}
        </span>
        <span className={styles.aName}>
          {artist.name} <Icon name="arrow" size={20} />
        </span>
        <span className={styles.aShort}>{artist.short}</span>
        <span className={styles.aCount}>
          {collections} {plural(collections, ["колекція", "колекції", "колекцій"])}
        </span>
      </span>
    </Link>
  );
}

/** Сітка товарів: 4 колонки, на мобільному — 2 */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul role="list" className={styles.products}>
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} sizes="(max-width: 640px) 46vw, (max-width: 1100px) 30vw, 22vw" />
        </li>
      ))}
    </ul>
  );
}

/** Галерея процесу: перше фото велике, решта поруч */
export function ProcessGallery({ items }: { items: Collection["gallery"] }) {
  return (
    <ul role="list" className={styles.gallery} data-count={items.length}>
      {items.map((g) => (
        <li key={g.src + g.caption}>
          <figure>
            <span className={styles.gMedia}>
              <Image src={g.src} alt={g.alt} fill sizes="(max-width: 900px) 90vw, 45vw" />
            </span>
            <figcaption>{g.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/** Цитата митця */
export function ArtistQuote({ artist }: { artist: Artist }) {
  if (!artist.quote) return null;
  return (
    <figure className={styles.quote}>
      <blockquote>
        <p>{artist.quote}</p>
      </blockquote>
      <figcaption>
        — {artist.name}, {artist.role.toLowerCase()}
      </figcaption>
    </figure>
  );
}
