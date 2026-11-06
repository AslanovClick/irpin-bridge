import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTISTS, COLLECTIONS, getArtist } from "@/data/art";
import { getProducts } from "@/lib/catalog";
import { plural } from "@/lib/plural";
import { CollectionCard, ProductGrid } from "@/components/art/ArtBlocks";
import { ArtistStory } from "@/components/art/ArtStory";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "../../art.module.css";

export async function generateStaticParams() {
  return ARTISTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/art/artists/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtist(slug);
  if (!a) return {};
  return {
    title: `${a.name} — ${a.role.toLowerCase()}, арт-мерч`,
    description: a.short,
    alternates: { canonical: `/art/artists/${a.slug}` },
    ...(a.photo ? { openGraph: { images: [{ url: a.photo, alt: a.name }] } } : {}),
  };
}

export default async function Page({ params }: PageProps<"/art/artists/[slug]">) {
  const { slug } = await params;
  const a = getArtist(slug);
  if (!a) notFound();
  const all = await getProducts();
  const products = all.filter((p) => p.artist === a.slug);
  const collections = COLLECTIONS.filter((c) => c.artist === a.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": a.slug === "art-maisternia" ? "Organization" : "Person",
    name: a.name,
    description: a.short,
    ...(a.links.length ? { sameAs: a.links.map((l) => l.href) } : {}),
  };

  return (
    <>
      <PageHero
        theme="purple"
        crumbs={[{ label: "Арт-мерч", href: "/art" }, { label: a.name }]}
        title={a.name}
        lead={a.short}
        facts={[
          [a.role, a.city],
          [String(collections.length), plural(collections.length, ["колекція", "колекції", "колекцій"])],
          [String(products.length), `${plural(products.length, ["річ", "речі", "речей"])} у магазині`],
        ]}
        actions={
          a.links.length > 0 ? (
            <>
              {a.links.map((l, i) => (
                <Button key={l.href + l.label} href={l.href} target="_blank" rel="noopener noreferrer" variant={i === 0 ? "primary" : "link"} arrow={i === 0}>
                  {l.label}
                </Button>
              ))}
            </>
          ) : undefined
        }
        image={a.photo ? { src: a.photo, alt: a.name, position: a.photoPosition } : undefined}
      />

      <section className="theme-light section" aria-labelledby="bio-title">
        <div className="container">
          <SectionHead id="bio-title" title="Про автора" />
          <ArtistStory artist={a} collections={collections.length} />
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </section>

      {collections.length > 0 && (
        <section className="theme-light section" aria-labelledby="a-collections-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead id="a-collections-title" title="Колекції" />
            <ul role="list" className={`${styles.grid3} ${styles.slider}`}>
              {collections.map((c) => (
                <li key={c.slug}>
                  <CollectionCard collection={c} count={all.filter((p) => p.collection === c.slug).length} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="theme-light section" aria-labelledby="a-products-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead id="a-products-title" title="Усі речі автора" />
            <ProductGrid products={products} />
          </div>
        </section>
      )}

      <section className="theme-sand section" aria-labelledby="a-cta-title">
        <div className="container">
          <SectionHead
            id="a-cta-title"
            title="Хочете власну колекцію?"
            lead="Шукаємо митців для нових колаборацій — від однієї роботи до цілої серії."
            action={
              <Button href="/art#collab" size="lg" arrow>
                Запропонувати співпрацю
              </Button>
            }
          />
        </div>
      </section>
    </>
  );
}
