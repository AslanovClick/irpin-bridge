"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cartItem, trackOnce } from "@/lib/analytics";
import { CONTACTS } from "@/data/site";
import { clearCart, useHydrated } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { readOrder, type Order } from "@/lib/order";
import { CartThumb } from "@/components/cart/CartParts";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "./Order.module.css";

const NEXT_STEPS = [
  { title: "Підтвердимо замовлення", text: "Менеджер перевірить наявність і за потреби зателефонує." },
  { title: "Запакуємо й відправимо", text: "Зазвичай за 1–2 робочі дні зі студії в Ірпені." },
  { title: "Надішлемо номер ТТН", text: "У SMS, на e-mail і в Telegram-бот — стежте за посилкою." },
];

/** Сторінка результату. Обгортати в <Suspense> (useSearchParams). */
export function OrderResult({ kind }: { kind: "success" | "failed" }) {
  const id = useSearchParams().get("id");
  const hydrated = useHydrated();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const o = readOrder(id);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- читаємо sessionStorage лише на клієнті
    setOrder(o);
    if (kind === "success" && o) {
      clearCart();
      trackOnce(`purchase:${o.id}`, {
        name: "purchase",
        transaction_id: o.id,
        value: o.total,
        coupon: o.promo,
        items: o.items.map(cartItem),
      });
    }
  }, [id, kind]);

  if (!hydrated) return <div className={styles.skeleton} aria-hidden="true" />;

  if (kind === "failed") {
    return (
      <div className={styles.top}>
        <div className={`${styles.hero} ${styles.heroFail}`}>
          <div className={styles.badgeRow}>
            <span className={styles.icon}>
              <Icon name="close" size={28} />
            </span>
            {id && <span className={styles.number}>Замовлення №{id}</span>}
          </div>
          <h1>Оплата не пройшла</h1>
          <p className={styles.lead}>
            Замовлення збережене, але платіж не підтвердився. Гроші не списано — спробуйте ще раз або оберіть оплату під
            час отримання.
          </p>
          <div className="actions">
            <Button href="/checkout" size="lg" arrow>
              Спробувати ще раз
            </Button>
            <Button href="/cart" variant="link">
              Повернутися до кошика
            </Button>
          </div>
        </div>
        <aside className={styles.card} aria-labelledby="help-title">
          <h2 id="help-title" className={styles.cardTitle}>
            Потрібна допомога?
          </h2>
          <p className={styles.muted}>Менеджер допоможе завершити замовлення або підкаже інший спосіб оплати.</p>
          <ul role="list" className={styles.contacts}>
            <li>
              <Icon name="phone" size={20} />
              <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
            </li>
            <li>
              <Icon name="telegram" size={20} />
              {/* ДЕМО: посилання на Telegram — уточнити */}
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                Написати в Telegram
              </a>
            </li>
            <li>
              <Icon name="clock" size={20} />
              <span>{CONTACTS.hours}</span>
            </li>
          </ul>
        </aside>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.hero}>
          <div className={styles.badgeRow}>
            <span className={styles.icon}>
              <Icon name="check" size={28} />
            </span>
            {id && <span className={styles.number}>Замовлення №{id}</span>}
          </div>
          <h1>Дякуємо! Замовлення прийнято</h1>
          <p className={styles.lead}>
            {order
              ? `${order.customer.email ? `Підтвердження надіслали на ${order.customer.email}.` : `Підтвердження надішлемо в SMS на ${order.customer.phone}.`} ${order.payment === "online" ? "Оплату отримано." : "Оплата — під час отримання."}`
              : "Ми надішлемо підтвердження в SMS."}
          </p>
          <div className="actions">
            {/* ДЕМО: посилання на Telegram-бот — уточнити */}
            <Button href="https://t.me/" target="_blank" rel="noopener noreferrer" size="lg" arrow>
              Стежити в Telegram-боті
            </Button>
            <Button href="/catalog" variant="link">
              Продовжити покупки
            </Button>
          </div>
        </div>

        {order ? (
          <aside className={styles.card} aria-label="Деталі замовлення">
            <h2 className={styles.cardTitle}>Деталі замовлення</h2>
            <ul role="list" className={styles.items}>
              {order.items.map((i) => (
                <li key={`${i.productId}|${i.color}|${i.size}`}>
                  <CartThumb item={i} size={52} />
                  <span>
                    <strong>{i.name}</strong>
                    <span>
                      {i.color}
                      {i.size !== "One size" ? ` · ${i.size}` : ""} · {i.qty} шт.
                    </span>
                  </span>
                  <span className={styles.price}>{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className={styles.facts}>
              <div>
                <dt>Отримувач</dt>
                <dd>
                  {order.customer.firstName} {order.customer.lastName}
                  <br />
                  {order.customer.phone}
                </dd>
              </div>
              <div>
                <dt>Доставка</dt>
                <dd>{order.delivery.label}</dd>
              </div>
              <div>
                <dt>Оплата</dt>
                <dd>{order.payment === "online" ? "Онлайн карткою — сплачено" : "Під час отримання"}</dd>
              </div>
              {order.discount > 0 && (
                <div>
                  <dt>Знижка</dt>
                  <dd>
                    {order.promo} · −{formatPrice(order.discount)}
                  </dd>
                </div>
              )}
              <div className={styles.total}>
                <dt>Разом</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </aside>
        ) : (
          <aside className={styles.card}>
            <h2 className={styles.cardTitle}>Питання щодо замовлення?</h2>
            <p className={styles.muted}>
              Зателефонуйте <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a> і назвіть номер замовлення.
            </p>
          </aside>
        )}
      </div>

      <section aria-labelledby="next-title" className={styles.next}>
        <h2 id="next-title" className={styles.cardTitle}>
          Що далі
        </h2>
        <ol role="list" className={styles.steps}>
          {NEXT_STEPS.map((s, i) => (
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
        Частина прибутку з цього замовлення піде на соціальні проєкти БФ «Єдність світу». Дякуємо, що обираєте свідомо!
      </p>
    </div>
  );
}
