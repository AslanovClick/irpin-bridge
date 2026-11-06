import { Business } from "@/components/home/Business";
import { Collab } from "@/components/home/Collab";
import { Customization } from "@/components/home/Customization";
import { Directions } from "@/components/home/Directions";
import { Hero } from "@/components/home/Hero";
import { Instagram } from "@/components/home/Instagram";
import { ProductTabs } from "@/components/home/ProductTabs";
import { RequestCta } from "@/components/home/RequestCta";
import { Services } from "@/components/home/Services";
import { Social } from "@/components/home/Social";
import { Works } from "@/components/home/Works";
import type { Metadata } from "next";
import { CONTACTS, SITE_URL, SOCIALS } from "@/data/site";
import { getCollectionProducts, getNewProducts, getPopularProducts } from "@/lib/catalog";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** schema.org: організація (логотип, контакти, соцмережі) і пошук по сайту */
const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IRPIN BRIDGE",
    alternateName: "IRPIN BRIDGE Art Center",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/irpin-bridge-logo-black.svg`,
    email: CONTACTS.email,
    telephone: CONTACTS.phone,
    address: { "@type": "PostalAddress", streetAddress: "вул. Мечникова, 109А", addressLocality: "Ірпінь", addressCountry: "UA" },
    parentOrganization: { "@type": "NGO", name: "БФ «Єдність світу»" },
    sameAs: SOCIALS.map((s) => s.href),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "IRPIN BRIDGE",
    url: SITE_URL,
    inLanguage: "uk-UA",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

export default async function HomePage() {
  const [popular, fresh, collection] = await Promise.all([
    getPopularProducts(),
    getNewProducts(),
    getCollectionProducts("kolory-irpenia"),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
      <Hero />
      <Directions />
      <ProductTabs
        tabs={[
          { key: "popular", label: "Популярне", products: popular },
          { key: "new", label: "Новинки", products: fresh },
        ]}
      />
      <Customization />
      <Services />
      <Business />
      <Works />
      <Collab products={collection} />
      <Social />
      <Instagram />
      <RequestCta />
    </>
  );
}
