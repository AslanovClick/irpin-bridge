import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/data/services";
import { Bullets, Faq, WorksGrid } from "@/components/content/Blocks";
import { AboutTech, Capabilities, RequestAside } from "@/components/content/ServiceBlocks";
import { QuickRequestForm } from "@/components/forms/QuickRequestForm";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "../services.module.css";

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: `${s.title} в Ірпені — ${s.priceFrom}`,
    description: s.lead,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { images: [{ url: s.image, alt: s.title }] },
  };
}

export default async function Page({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();
  const primary = s.primaryHref ?? "#request";

  return (
    <>
      <PageHero
        theme="pine"
        crumbs={[{ label: "Послуги", href: "/services" }, { label: s.title }]}
        title={s.title}
        lead={s.lead}
        image={{ src: s.image, alt: s.title }}
        actions={
          <>
            <Button href={primary} size="lg" arrow>
              {s.primaryHref ? "Створити свій мерч" : "Розрахувати вартість"}
            </Button>
            <Button href="#requirements" variant="link">
              Вимоги до макетів
            </Button>
          </>
        }
      />

      <section className="theme-light section" aria-labelledby="about-title">
        <div className="container">
          <SectionHead id="about-title" title={s.primaryHref ? "Як це працює" : "Про технологію"} />
          <AboutTech service={s} />
        </div>
      </section>

      <section className="theme-pine section" aria-labelledby="caps-title">
        <div className="container">
          <SectionHead id="caps-title" title="Можливості" />
          <Capabilities service={s} />
        </div>
      </section>

      <section id="requirements" className="theme-light section" aria-labelledby="req-title">
        <div className="container split">
          <div className="stack">
            <SectionHead flush id="req-title" title="Вимоги до макетів" lead="Що підготувати, щоб результат був ідеальним." />
            <div className={styles.reqBox}>
              <Bullets items={s.requirements} />
              {/* ДЕМО: PDF-пам'ятка — підготувати разом із замовником */}
              <Button href="#" variant="outline" arrow>
                Завантажити пам&apos;ятку (PDF)
              </Button>
            </div>
          </div>
          <div className="stack">
            <SectionHead flush title="Вартість" lead={s.pricingNote} />
            <ul role="list" className={styles.price} style={{ width: "100%" }}>
              {s.pricing.map((p) => (
                <li key={p.label}>
                  <strong>{p.label}</strong>
                  <b>{p.price}</b>
                  {p.note && <span>{p.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="works-title-s" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            id="works-title-s"
            title="Приклади робіт"
            action={
              <Button href="/services#works" variant="link" arrow>
                Усі роботи
              </Button>
            }
          />
          <WorksGrid works={s.works} />
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
        <div className="container split">
          <SectionHead flush id="faq-title" title="Питання й відповіді" />
          <Faq items={s.faq} />
        </div>
      </section>

      <section id="request" className="theme-lime section" aria-labelledby="form-title">
        <div className="container split">
          <div className="stack">
            <SectionHead
              flush
              id="form-title"
              title={s.primaryHref ? "Є питання щодо кастомізації?" : `Замовити ${s.title.toLowerCase()}`}
              lead="Надішліть макет або опишіть задачу — назвемо вартість і терміни протягом робочого дня."
            />
            {s.primaryHref && (
              <Button href={s.primaryHref} size="lg" arrow>
                Покрокова заявка на кастомізацію
              </Button>
            )}
            <RequestAside />
          </div>
          <QuickRequestForm topic={s.title} />
        </div>
      </section>
    </>
  );
}
