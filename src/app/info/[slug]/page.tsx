import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLegal, LEGAL } from "@/data/legal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { CookieSettingsLink } from "@/components/layout/CookieConsent";
import styles from "./info.module.css";

export async function generateStaticParams() {
  return LEGAL.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/info/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getLegal(slug);
  if (!d) return {};
  return { title: d.title, description: d.intro, alternates: { canonical: `/info/${d.slug}` } };
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

export default async function Page({ params }: PageProps<"/info/[slug]">) {
  const { slug } = await params;
  const d = getLegal(slug);
  if (!d) notFound();
  const others = LEGAL.filter((x) => x.slug !== d.slug);

  return (
    <article className="theme-light">
      <header className={styles.head}>
        <div className="container">
          <Breadcrumbs items={[{ label: "Покупцям" }, { label: d.title }]} />
          <h1 className={styles.title}>{d.title}</h1>
          <p className={styles.updated}>
            Оновлено: <time dateTime={d.updated}>{fmt(d.updated)}</time>
          </p>
        </div>
      </header>

      <div className={`container ${styles.layout}`}>
        <nav className={styles.toc} aria-label="Зміст">
          <details open>
            <summary>Зміст</summary>
            <ol role="list">
              {d.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ol>
          </details>
        </nav>

        <div className={styles.content}>
          <p className={styles.intro}>{d.intro}</p>
          {d.sections.map((s) => (
            <section key={s.id} id={s.id} className={styles.section} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>{s.title}</h2>
              {s.list && (
                <ul role="list" className={styles.list}>
                  {s.list.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              {s.rows && (
                <dl className={styles.rows}>
                  {s.rows.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {s.text?.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </section>
          ))}
          {d.slug === "cookies" && (
            <p className={styles.cookieCta}>
              <CookieSettingsLink>Змінити налаштування cookies</CookieSettingsLink>
            </p>
          )}

          <aside className={styles.others} aria-label="Інші документи">
            <p className={styles.othersTitle}>Інші документи</p>
            <ul role="list">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/info/${o.slug}`}>
                    <span>
                      <strong>{o.title}</strong>
                      <span>{o.short}</span>
                    </span>
                    <Icon name="arrow" size={20} />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </article>
  );
}
