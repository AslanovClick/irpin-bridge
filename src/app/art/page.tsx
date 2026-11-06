import type { Metadata } from "next";
import Link from "next/link";
import { ARTISTS, COLLECTIONS, getArtist } from "@/data/art";
import { getProducts } from "@/lib/catalog";
import { ArtistCard, CollectionCard, Palette, ProductGrid, StatusBadge } from "@/components/art/ArtBlocks";
import { Timeline } from "@/components/content/Blocks";
import { InlineRequest } from "@/components/forms/RequestModal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./art.module.css";

export const metadata: Metadata = {
  title: "Арт-мерч: колаборації з митцями",
  description:
    "Колекції одягу, створені разом з українськими митцями. Обмежені тиражі, ім'я автора на кожній речі, виготовлення в студії IRPIN BRIDGE в Ірпені.",
  alternates: { canonical: "/art" },
};

const STEPS = [
  { title: "Знайомство", text: "Дивимося портфоліо, говоримо про ідею й настрій колекції.", time: "1 зустріч" },
  { title: "Ескізи й вироби", text: "Разом обираємо роботи, речі й технологію — друк чи вишивку.", time: "1–2 тижні" },
  { title: "Тестовий зразок", text: "Шиємо пробні вироби, митець погоджує кольори й розміщення.", time: "5–7 днів" },
  { title: "Запуск", text: "Фотосесія, сторінка автора на сайті, анонс у наших соцмережах.", time: "Старт продажів" },
];

// ДЕМО: умови співпраці — уточнити з замовником
const PERKS = [
  { value: "15%", title: "Роялті з кожної речі", text: "Виплачуємо щомісяця за проданими виробами" },
  { value: "0 ₴", title: "Без вкладень", text: "Матеріали, виробництво й фото — за студією" },
  { value: "Ім'я", title: "На бирці й на сайті", text: "Власна сторінка автора й підпис на кожному виробі" },
];

export default async function Page() {
  const products = await getProducts();
  const byCollection = (slug: string) => products.filter((p) => p.collection === slug);
  const current = COLLECTIONS.find((c) => c.status === "current") ?? COLLECTIONS[0];
  const currentArtist = getArtist(current.artist);
  const currentProducts = byCollection(current.slug);

  return (
    <>
      <PageHero
        theme="purple"
        crumbs={[{ label: "Арт-мерч" }]}
        title="Колаборації з митцями"
        lead="Митці створюють образи — ми виготовляємо одяг у своїй студії в Ірпені. Обмежені тиражі й ім'я автора на кожній речі."
        facts={[
          [String(COLLECTIONS.length), "колекції"],
          [String(ARTISTS.length), "автори"],
          ["до 200 шт.", "тираж кожної речі"],
        ]}
        actions={
          <>
            <Button href="#current" size="lg" arrow>
              Актуальна колекція
            </Button>
            <Button href="#collab" variant="link">
              Ви митець?
            </Button>
          </>
        }
        image={{ src: "/placeholders/stickers.jpg", alt: "Наліпки IRPIN BRIDGE «Створюємо мистецтво разом»", position: "38% 50%" }}
      />

      {/* Актуальна колекція — крупно */}
      <section id="current" className="theme-light section" aria-labelledby="current-title">
        <div className="container">
          <div className={styles.feature}>
            <div className={styles.featureMedia}>
              <ShapeImage
                src={current.cover}
                alt={`Колекція «${current.title}»`}
                shape="bl"
                ratio="4 / 5"
                notch={[26, 16]}
                objectPosition={current.coverPosition}
                sizes="(max-width: 900px) 90vw, 40vw"
              />
              <StatusBadge status={current.status} />
            </div>
            <div className={styles.featureText}>
              <p className={styles.kicker}>{current.season}</p>
              <h2 id="current-title" className={styles.featureTitle}>
                {current.title}
              </h2>
              {currentArtist && (
                <Link href={`/art/artists/${currentArtist.slug}`} className={styles.by}>
                  <span>Автор</span>
                  <strong>{currentArtist.name}</strong>
                  <Icon name="arrow" size={18} />
                </Link>
              )}
              <p className={styles.featureLead}>{current.lead}</p>
              <dl className={styles.facts}>
                {current.facts.map(([v, l]) => (
                  <div key={l}>
                    <dt>{l}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <Palette colors={current.palette} />
              <div className="actions">
                <Button href={`/art/collections/${current.slug}`} size="lg" arrow>
                  Дивитися колекцію
                </Button>
              </div>
            </div>
          </div>

          {currentProducts.length > 0 && (
            <div className={styles.featureProducts}>
              <ProductGrid products={currentProducts.slice(0, 4)} />
            </div>
          )}
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="collections-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead id="collections-title" title="Усі колекції" lead="Актуальні, архівні й ті, що готуємо зараз." />
          <ul role="list" className={`${styles.grid4} ${styles.slider}`}>
            {COLLECTIONS.map((c) => (
              <li key={c.slug}>
                <CollectionCard collection={c} count={byCollection(c.slug).length} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-purple section" aria-labelledby="artists-title">
        <div className="container">
          <SectionHead id="artists-title" title="Митці" lead="Ілюстратори, живописці, флористи — і учні нашої дитячої майстерні." />
          <ul role="list" className={styles.grid4}>
            {ARTISTS.map((a) => (
              <li key={a.slug}>
                <ArtistCard artist={a} collections={COLLECTIONS.filter((c) => c.artist === a.slug).length} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="how-title">
        <div className="container">
          <SectionHead id="how-title" title="Як народжується колекція" lead="Від першої розмови до старту продажів — у середньому 4–6 тижнів." />
          <Timeline steps={STEPS} />
          <ul role="list" className={styles.perks}>
            {PERKS.map((p) => (
              <li key={p.title}>
                <span className={styles.perkValue}>{p.value}</span>
                <span>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="collab" className="theme-purple section" aria-labelledby="collab-title">
        <div className="container split">
          <div className="stack">
            <SectionHead
              flush
              id="collab-title"
              title="Ви митець? Створімо колекцію разом"
              lead="Покажіть роботи й розкажіть ідею — куратор відповість протягом кількох днів. Досвід роботи з одягом не потрібен."
            />
            <ul role="list" className={styles.checks}>
              <li>Ілюстрація, живопис, графіка, фото, леттеринг</li>
              <li>Одна робота або ціла серія</li>
              <li>Митці з будь-якого міста — працюємо й онлайн</li>
            </ul>
          </div>
          <InlineRequest kind="artist" />
        </div>
      </section>
    </>
  );
}
