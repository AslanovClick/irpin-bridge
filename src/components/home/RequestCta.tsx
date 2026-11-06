"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CONTACTS } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";
import { submitRequest } from "@/lib/requests";
import styles from "./RequestCta.module.css";

const TOPICS = ["Кастомізація одягу", "Бізнес-мерч", "DTF-друк", "Машинна вишивка", "Інше"];

type Errors = Partial<Record<"name" | "contact", string>>;

export function RequestCta() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const next: Errors = {};
    if (name.length < 2) next.name = "Вкажіть ім'я";
    if (!/^(\+?[\d\s()-]{9,}|@?[a-zA-Z0-9_]{5,})$/.test(contact)) next.contact = "Вкажіть телефон або нік у Telegram";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    const topic = String(data.get("topic") ?? "");
    const comment = String(data.get("comment") ?? "").trim();
    await submitRequest({
      type: "quick",
      contact: { name, phone: contact },
      summary: [["Що потрібно", topic], ...(comment ? ([["Коментар", comment]] as [string, string][]) : [])],
      files: [],
    });
    setStatus("sent");
  };

  return (
    <section id="request" className="theme-lime section" aria-labelledby="request-title">
      <div className={`container split ${styles.grid}`}>
        <div className="stack">
          <SectionHead
            flush
            id="request-title"
            title="Маєте ідею? Розрахуємо вартість"
            lead="Залиште контакт — менеджер зв'яжеться протягом робочого дня, уточнить деталі й надішле прорахунок."
          />

          <ul role="list" className={styles.alts}>
            <li>
              <Link href="/catalog">
                Купити готове <Icon name="arrow" size={20} />
              </Link>
            </li>
            <li>
              <Link href="/customize">
                Створити свій мерч <Icon name="arrow" size={20} />
              </Link>
            </li>
            <li>
              <Link href="/business#request">
                Замовити для компанії <Icon name="arrow" size={20} />
              </Link>
            </li>
          </ul>

          <p className={styles.direct}>
            Або напишіть напряму:{" "}
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>{" "}
            · <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
          </p>
        </div>

        <div className={styles.formWrap}>
          {status === "sent" ? (
            <div className={styles.success} role="status">
              <span className={styles.successIcon}>
                <Icon name="check" size={32} />
              </span>
              <h3>Дякуємо, заявку отримали!</h3>
              <p>Менеджер зв&apos;яжеться з вами протягом робочого дня.</p>
              <Button variant="outline" onClick={() => setStatus("idle")}>
                Надіслати ще одну
              </Button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="rq-name">Ім&apos;я</label>
                <input
                  id="rq-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Як до вас звертатися"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "rq-name-err" : undefined}
                />
                {errors.name && (
                  <p id="rq-name-err" className={styles.error}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="rq-contact">Телефон або Telegram</label>
                <input
                  id="rq-contact"
                  name="contact"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+380 або @nickname"
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby={errors.contact ? "rq-contact-err" : undefined}
                />
                {errors.contact && (
                  <p id="rq-contact-err" className={styles.error}>
                    {errors.contact}
                  </p>
                )}
              </div>

              <fieldset className={styles.field}>
                <legend>Що потрібно</legend>
                <div className={styles.topics}>
                  {TOPICS.map((t, i) => (
                    <label key={t} className={styles.topic}>
                      <input type="radio" name="topic" value={t} defaultChecked={i === 0} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={styles.field}>
                <label htmlFor="rq-comment">
                  Коментар <span className={styles.optional}>необов&apos;язково</span>
                </label>
                <textarea id="rq-comment" name="comment" rows={3} placeholder="Виріб, кількість, терміни…" />
              </div>

              <Button type="submit" size="lg" block arrow disabled={status === "sending"}>
                {status === "sending" ? "Надсилаємо…" : "Надіслати заявку"}
              </Button>
              <p className={styles.consent}>
                Надсилаючи заявку, ви погоджуєтесь з{" "}
                <Link href="/info/privacy">політикою конфіденційності</Link>.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
