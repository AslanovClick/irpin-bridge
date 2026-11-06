import type { ReactNode } from "react";
import type { Theme } from "@/data/types";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { ShapeImage } from "./ShapeImage";
import styles from "./PageHero.module.css";

type Props = {
  theme?: Theme;
  crumbs: Crumb[];
  title: ReactNode;
  lead?: ReactNode;
  /** Короткі факти під текстом: [значення, підпис] */
  facts?: [string, string][];
  actions?: ReactNode;
  image?: { src: string; alt: string; position?: string };
};

/** Шапка внутрішньої сторінки в кольорі розділу */
export function PageHero({ theme = "light", crumbs, title, lead, facts, actions, image }: Props) {
  return (
    <section className={`theme-${theme} ${styles.hero}`}>
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className={[styles.grid, image && styles.withImage].filter(Boolean).join(" ")}>
          <div className={styles.text}>
            <h1 className={styles.title}>{title}</h1>
            {lead && <p className={styles.lead}>{lead}</p>}
            {actions && <div className="actions">{actions}</div>}
            {facts && (
              <dl className={styles.facts}>
                {facts.map(([v, l]) => (
                  <div key={v + l}>
                    <dt>{v}</dt>
                    <dd>{l}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {image && (
            <div className={styles.media}>
              <span className={styles.block} aria-hidden="true" />
              <ShapeImage src={image.src} alt={image.alt} ratio="4 / 5" notch={[28, 16]} sizes="(max-width: 900px) 80vw, 34vw" eager objectPosition={image.position} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
