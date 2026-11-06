import Link from "next/link";
import { colorName, type Artist, type Collection } from "@/data/art";
import { plural } from "@/lib/plural";
import { Icon } from "@/components/ui/Icon";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./ArtStory.module.css";

/** Світлий колір — темний текст підпису */
function isLight(hex: string) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

/** Фіолетова картка автора: цитата (або короткий опис) + фото + посилання */
function AuthorCard({ artist, link = true, wide = false }: { artist: Artist; link?: boolean; wide?: boolean }) {
  if (wide) return <AuthorWide artist={artist} />;
  return (
    <figure className={styles.quote}>
      {artist.quote && (
        <span className={styles.qMark} aria-hidden="true">
          «
        </span>
      )}
      <blockquote>
        <p>{artist.quote ?? artist.short}</p>
      </blockquote>
      <figcaption className={styles.qBy}>
        {artist.photo && (
          <span className={styles.qPhoto}>
            <ShapeImage src={artist.photo} alt="" shape="br" ratio="1 / 1" notch={[30, 30]} objectPosition={artist.photoPosition} sizes="64px" />
          </span>
        )}
        <span className={styles.qName}>
          <strong>{artist.name}</strong>
          <span>
            {artist.role} · {artist.city}
          </span>
        </span>
        {link && (
          <Link href={`/art/artists/${artist.slug}`} className={styles.qLink}>
            Про автора <Icon name="arrow" size={18} />
          </Link>
        )}
      </figcaption>
    </figure>
  );
}

/** Компактна картка автора в бенто колекції: фото + цитата + підпис */
function AuthorWide({ artist }: { artist: Artist }) {
  return (
    <figure className={`${styles.quote} ${styles.wide}`}>
      {artist.quote && (
        <span className={styles.qMark} aria-hidden="true">
          «
        </span>
      )}
      {artist.photo && (
        <div className={styles.wPhoto}>
          <ShapeImage
            src={artist.photo}
            alt={artist.name}
            shape="br"
            ratio="4 / 5"
            notch={[30, 22]}
            objectPosition={artist.photoPosition}
            sizes="(max-width: 640px) 120px, 160px"
          />
        </div>
      )}
      <div className={styles.wBody}>
        <p className={styles.wKicker}>
          <span>04</span> {artist.quote ? "Слово автора" : "Автор"}
        </p>
        <blockquote>
          <p>{artist.quote ?? artist.short}</p>
        </blockquote>
        <figcaption className={styles.wBy}>
          <span className={styles.qName}>
            <strong>{artist.name}</strong>
            <span>
              {artist.role} · {artist.city}
            </span>
          </span>
          <Link href={`/art/artists/${artist.slug}`} className={styles.qLink}>
            Про автора <Icon name="arrow" size={18} />
          </Link>
        </figcaption>
      </div>
    </figure>
  );
}

/** «Про колекцію»: ідея, процес, палітра й автор — бенто замість суцільного тексту */
export function CollectionStory({ collection: c, artist, count }: { collection: Collection; artist?: Artist; count: number }) {
  return (
    <div className={styles.story}>
      <div className={`${styles.card} ${styles.idea}`}>
        <p className={styles.label}>
          <span>01</span> Ідея
        </p>
        <p className={styles.thesis}>{c.concept[0]}</p>
      </div>

      <div className={`${styles.card} ${styles.palette}`}>
        <p className={styles.label}>
          <span>03</span> Палітра
        </p>
        <ul role="list">
          {c.palette.map((hex) => (
            <li key={hex} style={{ background: hex }} data-light={isLight(hex) || undefined}>
              <span>{colorName(hex)}</span>
              <span>{hex}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.card} ${styles.process}`}>
        <p className={styles.label}>
          <span>02</span> {c.status === "soon" ? "Що буде" : "Як створювали"}
        </p>
        {c.concept.slice(1).map((p) => (
          <p key={p} className={styles.text}>
            {p}
          </p>
        ))}
        <dl className={styles.mini}>
          <div>
            <dt>Сезон</dt>
            <dd>{c.season}</dd>
          </div>
          <div>
            <dt>У колекції</dt>
            <dd>{count > 0 ? `${count} ${plural(count, ["річ", "речі", "речей"])}` : "готуємо"}</dd>
          </div>
          <div>
            <dt>Виготовлення</dt>
            <dd>Студія в Ірпені</dd>
          </div>
        </dl>
      </div>

      {artist && (
        <div className={styles.author}>
          <AuthorCard artist={artist} wide />
        </div>
      )}
    </div>
  );
}

/** «Про автора»: історія, цитата, факти й техніки */
export function ArtistStory({ artist: a, collections }: { artist: Artist; collections: number }) {
  return (
    <div className={styles.story}>
      <div className={`${styles.card} ${styles.idea}`}>
        <p className={styles.label}>
          <span>01</span> Історія
        </p>
        <p className={styles.thesis}>{a.bio[0]}</p>
        {a.bio.slice(1).map((p) => (
          <p key={p} className={styles.text}>
            {p}
          </p>
        ))}
      </div>

      <div className={styles.side}>
        <AuthorCard artist={a} link={false} />
      </div>

      <div className={`${styles.card} ${styles.facts}`}>
        <dl className={styles.factRow}>
          <div>
            <dt>Напрям</dt>
            <dd>{a.role}</dd>
          </div>
          <div>
            <dt>Місто</dt>
            <dd>{a.city}</dd>
          </div>
          <div>
            <dt>З IRPIN BRIDGE</dt>
            <dd>з {a.since} року</dd>
          </div>
          <div>
            <dt>Колекції</dt>
            <dd>{collections}</dd>
          </div>
        </dl>
        <div className={styles.tech}>
          <p className={styles.label}>
            <span>02</span> Техніки
          </p>
          <ul role="list">
            {a.techniques.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
