"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Works.module.css";

type Tag = "dtf" | "embroidery" | "b2b" | "art";

const FILTERS: { key: Tag | "all"; label: string }[] = [
  { key: "all", label: "Усі" },
  { key: "dtf", label: "DTF-друк" },
  { key: "embroidery", label: "Вишивка" },
  { key: "b2b", label: "Бізнес" },
  { key: "art", label: "Арт" },
];

/* ДЕМО: замість реальних кейсів — мокапи з бренд-буку */
const WORKS: { src: string; title: string; meta: string; tags: Tag[] }[] = [
  { src: "/placeholders/tee-back.jpg", title: "Футболки «Місце, що єднає»", meta: "DTF-друк · 120 шт.", tags: ["dtf", "b2b"] },
  { src: "/placeholders/posters-wall.jpg", title: "Айдентика виставки «Фарби життя»", meta: "Арт-проєкт", tags: ["art"] },
  { src: "/placeholders/hoodie.jpg", title: "Худі для команди волонтерів", meta: "DTF-друк · 40 шт.", tags: ["dtf", "b2b"] },
  { src: "/placeholders/tee-front.jpg", title: "Міні-лого на грудях", meta: "Машинна вишивка", tags: ["embroidery", "b2b"] },
  { src: "/placeholders/stickers.jpg", title: "Стікерпак до колекції", meta: "Арт-мерч", tags: ["art"] },
  { src: "/placeholders/tote-lime.jpg", title: "Шопери для фестивалю", meta: "DTF-друк · 300 шт.", tags: ["dtf", "b2b"] },
];

export function Works() {
  const [filter, setFilter] = useState<Tag | "all">("all");
  const items = filter === "all" ? WORKS : WORKS.filter((w) => w.tags.includes(filter));

  return (
    <section className="theme-light section" aria-labelledby="works-title">
      <div className="container">
        <SectionHead
          id="works-title"
          title="Приклади робіт"
          action={
          <div className={styles.filters} role="group" aria-label="Фільтр робіт">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={styles.chip}
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          }
        />

        <ul role="list" className={styles.grid} aria-live="polite">
          {items.map((w, i) => (
            <li key={w.src} className={[styles.item, i === 0 && styles.feature].filter(Boolean).join(" ")}>
              <figure>
                <div className={styles.media}>
                  <Image src={w.src} alt={w.title} fill sizes="(max-width: 700px) 100vw, 40vw" className={styles.img} />
                </div>
                <figcaption className={styles.caption}>
                  <span className={styles.capTitle}>{w.title}</span>
                  <span className={styles.capMeta}>{w.meta}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className={styles.foot}>
          <Button href="/services#works" variant="link" arrow>
            Більше робіт
          </Button>
        </div>
      </div>
    </section>
  );
}
