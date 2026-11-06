import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTIONS, getArtist, getCollection } from "@/data/art";
import { CONTACTS, SOCIALS } from "@/data/site";
import { getCollectionProducts, getProducts } from "@/lib/catalog";
import { CollectionCard, ProcessGallery, ProductGrid } from "@/components/art/ArtBlocks";
import { CollectionStory } from "@/components/art/ArtStory";
import { Share } from "@/components/product/Share";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "../../art.module.css";

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/art/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  const artist = getArtist(c.artist);
  return {
    title: `Колекція «${c.title}» — ${artist?.name ?? "арт-мерч"}`,
    description: c.lead,
    alternates: { canonical: `/art/collections/${c.slug}` },
    openGraph: { images: [{ url: c.cover, alt: c.title }] },
  };
}

export default async function Page({ params }: PageProps<"/art/collections/[slug]">) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const artist = getArtist(c.artist);
  const products = await getCollectionProducts(c.slug);
  const all = await getProducts();
  const others = COLLECTIONS.filter((x) => x.slug !== c.slug).slice(0, 3);
  const artInsta = SOCIALS.find((s) => s.handle.includes("art"));

  return (
    <>
      <PageHero
        theme="purple"
        crumbs={[{ label: "Арт-мерч", href: "/art" }, { label: c.title }]}
        title={c.title}
        lead={c.lead}
        facts={c.facts}
        actions={
          <>
            <Button href="#products" size="lg" arrow>
              {c.status === "soon" ? "Коли старт" : "Товари колекції"}
            </Button>
            {artist && (
              <Button href={`/art/artists/${artist.slug}`} variant="link">
                {artist.name}
              </Button>
            )}
          </>
        }
        image={{ src: c.cover, alt: `Колекція «${c.title}»`, position: c.coverPosition }}
      />

      <section className="theme-light section" aria-labelledby="concept-title">
        <div className="container">
          <SectionHead id="concept-title" title="Про колекцію" action={<Share title={`Колекція «${c.title}» — IRPIN BRIDGE`} />} />
          <CollectionStory collection={c} artist={artist} count={products.length} />
        </div>
      </section>

      <section id="products" className="theme-light section" aria-labelledby="products-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead id="products-title" title={c.status === "soon" ? "Колекція готується" : "Товари колекції"} />
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className={styles.soon}>
              <p>
                <strong>Старт — {c.season.toLowerCase()}</strong>
                Анонсуємо в Instagram {artInsta?.handle}. Хочете дізнатися першими — підпишіться або напишіть нам.
              </p>
              <div className="actions">
                {artInsta && (
                  <Button href={artInsta.href} target="_blank" rel="noopener noreferrer" arrow>
                    Instagram
                  </Button>
                )}
                <Button href={CONTACTS.phoneHref} variant="outline">
                  {CONTACTS.phone}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="theme-purple section" aria-labelledby="process-title">
        <div className="container">
          <SectionHead id="process-title" title={c.status === "soon" ? "Робота над колекцією" : "Як створювали"} />
          <ProcessGallery items={c.gallery} />
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="others-title">
        <div className="container">
          <SectionHead
            id="others-title"
            title="Інші колекції"
            action={
              <Button href="/art" variant="link" arrow>
                Весь арт-мерч
              </Button>
            }
          />
          <ul role="list" className={`${styles.grid3} ${styles.slider}`}>
            {others.map((o) => (
              <li key={o.slug}>
                <CollectionCard collection={o} count={all.filter((p) => p.collection === o.slug).length} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
