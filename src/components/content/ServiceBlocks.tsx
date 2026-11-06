import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMPARISON, type Service } from "@/data/services";
import { CONTACTS } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import styles from "./ServiceBlocks.module.css";

/** DTF чи вишивка — дві картки зі шкалами замість таблиці */
export function Compare() {
  return (
    <div className={styles.compare}>
      {COMPARISON.map((c, i) => (
        <article key={c.slug} className={styles.cCard}>
          <header className={styles.cHead}>
            <span className={styles.cTag}>Варіант {i + 1}</span>
            <h3>{c.title}</h3>
            <p>
              <strong>Найкраще для:</strong> {c.best}
            </p>
          </header>
          <div className={styles.pc}>
            <p className={styles.pcTitle}>Переваги</p>
            <ul role="list" className={styles.pros}>
              {c.pros.map((t) => (
                <li key={t}>
                  <span className={styles.pcIcon} aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.pc}>
            <p className={styles.pcTitle}>Варто знати</p>
            <ul role="list" className={styles.cons}>
              {c.cons.map((t) => (
                <li key={t}>
                  <span className={styles.pcIcon} aria-hidden="true">
                    −
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <dl className={styles.cFacts}>
            {c.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <Link href={`/services/${c.slug}`} className={styles.cLink}>
            {c.more} <Icon name="arrow" size={18} />
          </Link>
        </article>
      ))}
      <span className={styles.vs} aria-hidden="true">
        vs
      </span>
    </div>
  );
}

/** Ліва колонка біля форми заявки: що надіслати + швидкі контакти */
export function RequestAside({ extra }: { extra?: ReactNode }) {
  const items = [
    { icon: "upload" as const, title: "Логотип або макет", text: "Будь-який формат — підкажемо, якщо потрібно доопрацювати" },
    { icon: "box" as const, title: "Виріб і кількість", text: "Що саме й скільки — можна приблизно" },
    { icon: "clock" as const, title: "Бажані терміни", text: "Якщо горить — скажіть, спробуємо пришвидшити" },
  ];
  return (
    <div className={styles.aside}>
      <ul role="list" className={styles.checklist}>
        {items.map((it) => (
          <li key={it.title}>
            <span className={styles.checkIcon}>
              <Icon name={it.icon} size={22} />
            </span>
            <span>
              <strong>{it.title}</strong>
              <span>{it.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.quick}>
        <p>Швидше голосом?</p>
        <a href={CONTACTS.phoneHref}>
          <Icon name="phone" size={18} /> {CONTACTS.phone}
        </a>
        {/* ДЕМО: посилання на Telegram — уточнити */}
        <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
          <Icon name="telegram" size={18} /> Telegram
        </a>
      </div>
      {extra}
    </div>
  );
}

/** «Про технологію»: велика теза + цифри + як це працює */
export function AboutTech({ service }: { service: Service }) {
  return (
    <div className={styles.about}>
      <div className={styles.aboutText}>
        <p className={styles.thesis}>{service.about[0]}</p>
        {service.about[1] && <p className={styles.aboutMore}>{service.about[1]}</p>}
        <dl className={styles.stats}>
          {service.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.how}>
        <p className={styles.howTitle}>Як це працює</p>
        <ol role="list" className={styles.howSteps}>
          {service.howItWorks.map((h, i) => (
            <li key={h.title}>
              <span className={styles.howNum}>{i + 1}</span>
              <div>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** «Можливості»: бенто з великими значеннями + фото */
export function Capabilities({ service }: { service: Service }) {
  return (
    <ul role="list" className={styles.caps}>
      <li className={styles.capPhoto}>
        <Image src={service.works[0]?.src ?? service.image} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" />
      </li>
      {service.capabilities.map((c, i) => (
        <li key={c.title} className={styles.cap} data-accent={i === 0 || undefined}>
          <span className={styles.capValue}>{c.value}</span>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
        </li>
      ))}
    </ul>
  );
}
