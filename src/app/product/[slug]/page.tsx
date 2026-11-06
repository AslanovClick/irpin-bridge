import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/data/site";
import { getArtist, getCollection } from "@/data/art";
import {
  getAllProductSlugs,
  getCategory,
  getProduct,
  getRelated,
  getSizeChart,
  isInStock,
} from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { ShapeImage } from "@/components/ui/ShapeImage";
import { ProductView } from "@/components/product/ProductView";
import styles from "./page.module.css";

const SITE = SITE_URL;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const image = product.images[0]?.src;
  return {
    title: `${product.name} — ${product.price} ₴`,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/product/${product.slug}`,
      ...(image ? { images: [{ url: image, width: 1100, height: 1375, alt: product.name }] } : {}),
    },
  };
}

export default async function Page({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const artist = getArtist(product.artist);
  const collection = getCollection(product.collection);

  const [category, sizeChart, related] = await Promise.all([
    getCategory(product.category),
    getSizeChart(product),
    getRelated(product),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    brand: { "@type": "Brand", name: "IRPIN BRIDGE" },
    ...(product.images.length ? { image: product.images.map((i) => `${SITE}${i.src}`) } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE}/product/${product.slug}`,
      priceCurrency: "UAH",
      price: product.price,
      availability: isInStock(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <section className="theme-light">
        <div className={`container ${styles.wrap}`}>
          <Breadcrumbs
            items={[
              { label: "Каталог", href: "/catalog" },
              ...(category ? [{ label: category.name, href: `/catalog/${category.slug}` }] : []),
              { label: product.name },
            ]}
          />
          <ProductView product={product} sizeChart={sizeChart} categoryName={category?.name ?? "Каталог"} />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </section>

      {artist && collection && (
        <section className="theme-purple section" aria-labelledby="artist-title">
          <div className={`container ${styles.artist}`}>
            <div className={styles.artistPhoto}>
              <ShapeImage
                src={artist.photo ?? collection.cover}
                alt={artist.name}
                shape="br"
                ratio="4 / 5"
                notch={[24, 14]}
                objectPosition={artist.photoPosition}
                sizes="(max-width: 900px) 60vw, 26vw"
              />
            </div>
            <div className="stack">
              <SectionHead
                flush
                id="artist-title"
                title={`Колаборація з ${artist.nameWith}`}
                lead={`Колекція «${collection.title}»: ${collection.lead.charAt(0).toLowerCase()}${collection.lead.slice(1)} Кожна річ виготовлена обмеженим тиражем у нашій студії.`}
              />
              <div className="actions">
                <Button href={`/art/collections/${product.collection}`} size="lg" arrow>
                  Уся колекція
                </Button>
                <Button href={`/art/artists/${artist.slug}`} variant="link">
                  Про автора
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="theme-light section" aria-labelledby="related-title">
        <div className="container">
          <SectionHead
            id="related-title"
            title="Вам також сподобається"
            action={
              <Button href={category ? `/catalog/${category.slug}` : "/catalog"} variant="link" arrow>
                {category ? `Усі ${category.name.toLowerCase()}` : "Весь каталог"}
              </Button>
            }
          />
          <ul role="list" className={styles.related}>
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
