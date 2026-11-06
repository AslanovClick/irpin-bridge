import type { Metadata } from "next";
import { CONTACTS, SCHEDULE, SOCIALS } from "@/data/site";
import { MapEmbed, OpenNow, TodayMark } from "@/components/contacts/ContactsParts";
import { InlineRequest } from "@/components/forms/RequestModal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "@/components/contacts/Contacts.module.css";

export const metadata: Metadata = {
  title: "Контакти — студія в Ірпені",
  description: `IRPIN BRIDGE: ${CONTACTS.address}. Телефон, e-mail, години роботи, як дістатися з Києва. ${CONTACTS.hours}.`,
  alternates: { canonical: "/contacts" },
};

const ROUTE = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACTS.address)}`;

/* ДЕМО: месенджери й маршрути — уточнити */
const MESSENGERS = [
  { label: "Telegram", href: "https://t.me/", icon: "telegram" as const },
  { label: "Viber", href: "viber://chat?number=%2B380000000000", icon: "phone" as const },
];

const WAYS = [
  { icon: "truck" as const, title: "Автомобілем", text: "25–30 хв від Києва по Варшавській трасі. Безкоштовна парковка біля входу." },
  { icon: "clock" as const, title: "Електричкою", text: "З Київ-Пасажирського до станції Ірпінь — 35 хв, далі 10 хв пішки." },
  { icon: "pin" as const, title: "Маршруткою", text: "Від м. «Академмістечко» маршрутками на Ірпінь — зупинка «Мечникова»." },
];

const GROUPS = [
  { title: "Студія", note: "Новинки, замовлення, закулісся виробництва", match: (h: string) => h.includes("studio") || h.includes("irpinbridge") },
  { title: "Арт-мерч", note: "Колекції, митці, майстер-класи", match: (h: string) => h.includes(".art") },
  { title: "Фонд «Єдність світу»", note: "Соціальні проєкти громади", match: (h: string) => h.includes("ednist") },
];

export default function Page() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "IRPIN BRIDGE",
    address: { "@type": "PostalAddress", streetAddress: "вул. Мечникова, 109А", addressLocality: "Ірпінь", addressCountry: "UA" },
    telephone: CONTACTS.phone,
    email: CONTACTS.email,
    openingHours: ["Mo-Fr 10:00-19:00", "Sa 11:00-16:00"],
    sameAs: SOCIALS.map((s) => s.href),
  };

  return (
    <>
      <PageHero
        theme="light"
        crumbs={[{ label: "Контакти" }]}
        title="Контакти"
        lead="Приходьте в студію, телефонуйте або пишіть у месенджери — відповідаємо в робочий час протягом години."
      />

      <section className="theme-light section" aria-label="Як з нами зв'язатися" style={{ paddingTop: 0 }}>
        <div className={`container ${styles.main}`}>
          <div className={styles.cards}>
            <div className={styles.card} data-wide>
              <p className={styles.cardLabel}>
                <Icon name="pin" size={18} /> Адреса
              </p>
              <p className={styles.big}>{CONTACTS.address}</p>
              <p className={styles.muted}>Вхід з подвір&apos;я, табличка IRPIN BRIDGE на фасаді</p>
              <Button href={ROUTE} target="_blank" rel="noopener noreferrer" variant="link" arrow>
                Прокласти маршрут
              </Button>
            </div>

            <div className={styles.card}>
              <p className={styles.cardLabel}>
                <Icon name="phone" size={18} /> Телефон
              </p>
              <a href={CONTACTS.phoneHref} className={styles.big}>
                {CONTACTS.phone}
              </a>
              <div className={styles.chips}>
                {MESSENGERS.map((m) => (
                  <a key={m.label} href={m.href} target="_blank" rel="noopener noreferrer">
                    <Icon name={m.icon} size={16} /> {m.label}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <p className={styles.cardLabel}>
                <Icon name="upload" size={18} /> E-mail
              </p>
              <a href={`mailto:${CONTACTS.email}`} className={styles.big}>
                {CONTACTS.email}
              </a>
              <p className={styles.muted}>Для макетів, комерційних пропозицій і документів</p>
            </div>

            <div className={styles.card} data-wide>
              <div className={styles.hoursHead}>
                <p className={styles.cardLabel}>
                  <Icon name="clock" size={18} /> Години роботи
                </p>
                <OpenNow />
              </div>
              <dl className={styles.hours}>
                {SCHEDULE.map((s) => (
                  <div key={s.days}>
                    <dt>
                      {s.days} <TodayMark idx={s.idx} />
                    </dt>
                    <dd>{s.from ? `${s.from} – ${s.to}` : "вихідний"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <MapEmbed address={CONTACTS.address} />
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c") }} />
      </section>

      <section className="theme-light section" aria-labelledby="ways-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead id="ways-title" title="Як дістатися" />
          <ul role="list" className={styles.ways}>
            {WAYS.map((w) => (
              <li key={w.title}>
                <span className={styles.wayIcon}>
                  <Icon name={w.icon} size={24} />
                </span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-dark section" aria-labelledby="socials-title">
        <div className="container">
          <SectionHead id="socials-title" title="Ми в соцмережах" />
          <div className={styles.groups}>
            {GROUPS.map((g) => (
              <div key={g.title} className={styles.group}>
                <h3>{g.title}</h3>
                <p>{g.note}</p>
                <ul role="list">
                  {SOCIALS.filter((s) => g.match(s.handle)).map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer">
                        <Icon name={s.icon} size={20} />
                        <span>{s.handle}</span>
                        <Icon name="arrow" size={18} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="callback" className="theme-lime section" aria-labelledby="cb-title">
        <div className="container split">
          <div className="stack">
            <SectionHead
              flush
              id="cb-title"
              title="Передзвоніть мені"
              lead="Залиште номер — менеджер зателефонує в зручний час і відповість на питання про замовлення, кастомізацію чи співпрацю."
            />
            <ul role="list" className={styles.links}>
              <li>
                <Button href="/business#request" variant="link" arrow>
                  Мерч для компанії
                </Button>
              </li>
              <li>
                <Button href="/customize" variant="link" arrow>
                  Кастомізація одягу
                </Button>
              </li>
              <li>
                <Button href="/info/requisites" variant="link" arrow>
                  Реквізити для рахунку
                </Button>
              </li>
            </ul>
          </div>
          <InlineRequest kind="callback" />
        </div>
      </section>
    </>
  );
}
