import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./Blocks.module.css";

/** Часті питання — нативні <details>, працюють без JS */
export function Faq({ items, id = "faq" }: { items: { q: string; a: string }[]; id?: string }) {
  return (
    <div className={styles.faq}>
      {items.map((f, i) => (
        <details key={f.q} name={id} open={i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Процес роботи — кроки в ряд з номерами */
export function Process({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol role="list" className={styles.process} style={{ "--n": steps.length } as CSSProperties}>
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className={styles.num}>0{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Сітка робіт з підписами */
export function WorksGrid({ works }: { works: { src: string; title: string }[] }) {
  return (
    <ul role="list" className={styles.works}>
      {works.map((w) => (
        <li key={w.src + w.title}>
          <figure>
            <div className={styles.workMedia}>
              <Image src={w.src} alt={w.title} fill sizes="(max-width: 700px) 80vw, 33vw" />
            </div>
            <figcaption>{w.title}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/** Список з квадратними маркерами */
export function Bullets({ items }: { items: string[] }) {
  return (
    <ul role="list" className={styles.bullets}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/** Таймлайн процесу: лінія з вузлами, номер, тривалість кроку */
export function Timeline({ steps }: { steps: { title: string; text: string; time?: string }[] }) {
  return (
    <ol role="list" className={styles.timeline} style={{ "--n": steps.length } as CSSProperties}>
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className={styles.node} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          {s.time && <span className={styles.time}>{s.time}</span>}
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
