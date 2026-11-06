"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CONTACTS } from "@/data/site";
import { useHydrated } from "@/lib/cart";
import { formatSize, readRequest, REQUEST_LABEL, type RequestRecord, type RequestType } from "@/lib/requests";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "@/components/checkout/Order.module.css";

const NEXT: Record<RequestType, { title: string; text: string }[]> = {
  custom: [
    { title: "Перевіримо макет", text: "Менеджер подивиться файл і, за потреби, підкаже, як його покращити." },
    { title: "Покажемо й назвемо ціну", text: "Надішлемо візуалізацію розміщення та точну вартість." },
    { title: "Оплата й виготовлення", text: "Після погодження — посилання на оплату, далі 2–5 робочих днів." },
  ],
  business: [
    { title: "Комерційна пропозиція", text: "Протягом робочого дня — варіанти виробів, нанесення й ціни." },
    { title: "Зразок", text: "Після погодження виготовляємо тестовий виріб." },
    { title: "Тираж і доставка", text: "7–14 робочих днів, доставка Новою поштою в потрібні міста." },
  ],
  service: [
    { title: "Прорахунок", text: "Менеджер оцінить задачу й назве вартість і терміни." },
    { title: "Погодження макета", text: "Покажемо, як виглядатиме результат." },
    { title: "Виготовлення", text: "Від 2 робочих днів після погодження." },
  ],
  quick: [
    { title: "Зв'яжемося", text: "Менеджер уточнить деталі зручним для вас способом." },
    { title: "Прорахунок", text: "Назвемо вартість і терміни." },
    { title: "Виготовлення", text: "Після погодження макета й оплати." },
  ],
  callback: [
    { title: "Дзвінок", text: "Менеджер зателефонує в обраний час." },
    { title: "Консультація", text: "Підкажемо виріб, технологію й терміни." },
    { title: "Заявка", text: "За потреби оформимо її за вас." },
  ],
  artist: [
    { title: "Перегляд робіт", text: "Куратор подивиться портфоліо протягом кількох днів." },
    { title: "Зустріч", text: "Обговоримо ідею колекції й умови співпраці." },
    { title: "Колекція", text: "Разом розробимо дизайн і запустимо виробництво." },
  ],
};

/** Сторінка «Заявку прийнято». Обгортати в <Suspense> (useSearchParams). */
export function RequestSuccess() {
  const id = useSearchParams().get("id");
  const hydrated = useHydrated();
  const [rec, setRec] = useState<RequestRecord | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- читаємо sessionStorage лише на клієнті
    setRec(readRequest(id));
  }, [id]);

  if (!hydrated) return <div className={styles.skeleton} aria-hidden="true" />;
  const type: RequestType = rec?.type ?? "quick";

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.hero}>
          <div className={styles.badgeRow}>
            <span className={styles.icon}>
              <Icon name="check" size={28} />
            </span>
            {id && <span className={styles.number}>Заявка №{id}</span>}
          </div>
          <h1>Дякуємо! Заявку прийнято</h1>
          <p className={styles.lead}>
            {rec ? `${REQUEST_LABEL[type]} отримана. ` : ""}Менеджер зв&apos;яжеться з вами протягом робочого дня
            {rec?.contact.phone ? ` за номером ${rec.contact.phone}` : ""}.
          </p>
          <div className="actions">
            <Button href="/catalog" size="lg" arrow>
              До каталогу
            </Button>
            <Button href="/" variant="link">
              На головну
            </Button>
          </div>
        </div>

        <aside className={styles.card} aria-label="Деталі заявки">
          <h2 className={styles.cardTitle}>{rec ? REQUEST_LABEL[type] : "Деталі заявки"}</h2>
          {rec ? (
            <dl className={styles.facts}>
              {rec.summary.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              {rec.files.length > 0 && (
                <div>
                  <dt>Файли</dt>
                  <dd>
                    {rec.files.map((f) => (
                      <span key={f.name} style={{ display: "block" }}>
                        {f.name} · {formatSize(f.size)}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div className={styles.total}>
                <dt>Контакт</dt>
                <dd style={{ fontSize: "1rem" }}>
                  {rec.contact.name}
                  {rec.contact.phone && `, ${rec.contact.phone}`}
                </dd>
              </div>
            </dl>
          ) : (
            <p className={styles.muted}>
              Питання щодо заявки — <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>.
            </p>
          )}
        </aside>
      </div>

      <section aria-labelledby="next-title" className={styles.next}>
        <h2 id="next-title" className={styles.cardTitle}>
          Що далі
        </h2>
        <ol role="list" className={styles.steps}>
          {NEXT[type].map((s, i) => (
            <li key={s.title}>
              <span className={styles.stepNum}>{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className={styles.mission}>
        <Logo variant="mark" title="" className={styles.missionMark} />
        Кожне замовлення в IRPIN BRIDGE створює робочі місця й підтримує соціальні проєкти Ірпінської громади.
      </p>
    </div>
  );
}
