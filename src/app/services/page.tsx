import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { Faq, Process } from "@/components/content/Blocks";
import { Compare, RequestAside } from "@/components/content/ServiceBlocks";
import { QuickRequestForm } from "@/components/forms/QuickRequestForm";
import { Works } from "@/components/home/Works";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Послуги: DTF-друк, вишивка, кастомізація",
  description:
    "DTF-друк і машинна вишивка на власному обладнанні в Ірпені. Кастомізація готових виробів від 1 шт., корпоративні тиражі.",
  alternates: { canonical: "/services" },
};

const STEPS = [
  { title: "Заявка", text: "Надсилаєте макет або ідею — через форму, Telegram чи телефон." },
  { title: "Макет і ціна", text: "Перевіряємо файл, показуємо розміщення й називаємо точну вартість." },
  { title: "Виготовлення", text: "Друкуємо чи вишиваємо в студії, контролюємо кожен виріб." },
  { title: "Доставка", text: "Відправляємо Новою поштою або видаємо в студії в Ірпені." },
];

const FAQ = [
  { q: "Яку технологію обрати?", a: "Для фото й яскравих ілюстрацій — DTF. Для логотипів і преміального вигляду — вишивка. Не впевнені — підкажемо за макетом." },
  { q: "Чи працюєте з малими тиражами?", a: "Так, від 1 виробу. Для тиражів від 10 шт. діють ціни для бізнесу." },
  { q: "Можна принести свою річ?", a: "Так — у студію в Ірпені або Новою поштою. Перевіримо тканину й підберемо технологію." },
];

export default function Page() {
  return (
    <>
      <PageHero
        theme="pine"
        crumbs={[{ label: "Послуги" }]}
        title="Друк, вишивка, кастомізація"
        lead="Власне обладнання в Ірпені: робимо швидко, контролюємо якість на кожному етапі. Від однієї речі до великих тиражів."
        facts={[
          ["від 1 шт.", "без мінімального тиражу"],
          ["від 2 днів", "термін виготовлення"],
          ["Макет", "погоджуємо до запуску"],
        ]}
        image={{ src: "/placeholders/hoodie.jpg", alt: "Худі з DTF-друком" }}
      />

      <section className="theme-light section" aria-labelledby="list-title">
        <div className="container">
          <SectionHead id="list-title" title="Що ми робимо" />
          <ul role="list" className={styles.cards}>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={styles.card}>
                  <span className={styles.cardMedia}>
                    <Image src={s.image} alt="" fill sizes="(max-width: 1000px) 100vw, 33vw" />
                  </span>
                  <span className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <span className={styles.cardText}>{s.short}</span>
                    <span className={styles.cardFoot}>
                      {s.priceFrom}
                      <Icon name="arrow" size={22} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-pine section" aria-labelledby="compare-title">
        <div className="container">
          <SectionHead id="compare-title" title="DTF чи вишивка?" lead="Коротке порівняння, щоб обрати технологію під ваше завдання." />
          <Compare />
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="process-title">
        <div className="container">
          <SectionHead id="process-title" title="Як ми працюємо" />
          <Process steps={STEPS} />
        </div>
      </section>

      <div id="works">
        <Works />
      </div>

      <section className="theme-light section" aria-labelledby="faq-title">
        <div className="container split">
          <SectionHead
            flush
            id="faq-title"
            title="Питання й відповіді"
            lead="Не знайшли відповіді — напишіть нам, підкажемо за кілька хвилин."
            action={
              <Button href="/contacts" variant="link" arrow>
                Контакти
              </Button>
            }
          />
          <Faq items={FAQ} />
        </div>
      </section>

      <section id="request" className="theme-lime section" aria-labelledby="req-title">
        <div className="container split">
          <div className="stack">
            <SectionHead
              flush
              id="req-title"
              title="Розрахуємо вартість"
              lead="Опишіть задачу або надішліть макет — менеджер відповість протягом робочого дня."
            />
            <RequestAside />
          </div>
          <QuickRequestForm topic="Послуги студії" />
        </div>
      </section>
    </>
  );
}
