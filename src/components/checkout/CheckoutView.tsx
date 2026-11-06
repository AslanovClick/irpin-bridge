"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { cartItem, track } from "@/lib/analytics";
import { getPoints, NP_CITIES, pointLabel } from "@/data/novaposhta";
import { CONTACTS } from "@/data/site";
import { itemKey, totalsOf, useCartState, useHydrated } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { formatPhone, newOrderId, phoneDigits, saveOrder } from "@/lib/order";
import { CartThumb, MissionNote, PromoForm, Totals } from "@/components/cart/CartParts";
import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/Combobox";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Select } from "@/components/ui/Select";
import { Logo } from "@/components/ui/Logo";
import styles from "./Checkout.module.css";

type Delivery = "branch" | "locker" | "courier" | "pickup";
type Payment = "online" | "cod";

const DELIVERY: { key: Delivery; title: string; short: string; text: string; icon: IconName }[] = [
  { key: "branch", title: "Відділення Нової пошти", short: "Відділення", text: "1–3 дні · за тарифами НП", icon: "box" },
  { key: "locker", title: "Поштомат Нової пошти", short: "Поштомат", text: "1–3 дні · до 30 кг", icon: "locker" },
  { key: "courier", title: "Кур'єр Нової пошти", short: "Кур'єр", text: "1–3 дні · до дверей", icon: "truck" },
  { key: "pickup", title: "Самовивіз зі студії", short: "Самовивіз", text: "Ірпінь · безкоштовно", icon: "pin" },
];

/** Орієнтовна дата доставки: відправка 1–2 робочі дні + 1–3 дні в дорозі */
function etaLabel(delivery: Delivery) {
  const add = (d: Date, n: number) => {
    const x = new Date(d);
    let left = n;
    while (left > 0) {
      x.setDate(x.getDate() + 1);
      if (x.getDay() !== 0) left--; // неділя — не рахуємо
    }
    return x;
  };
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long" });
  if (delivery === "pickup") return `Можна забрати з ${fmt.format(add(now, 1))}`;
  const from = add(now, 2);
  const to = add(now, 4);
  return `Орієнтовно ${fmt.format(from)} – ${fmt.format(to)}`;
}

/* ДЕМО: накладений платіж — уточнити, чи потрібен */
const PAYMENT: { key: Payment; title: string; text: string }[] = [
  { key: "online", title: "Онлайн карткою", text: "Visa, Mastercard, Apple Pay, Google Pay" },
  { key: "cod", title: "Під час отримання", text: "Накладений платіж Нової пошти (+ комісія перевізника)" },
];

type Errors = Partial<Record<"firstName" | "lastName" | "phone" | "email" | "city" | "point" | "street" | "house" | "consent", string>>;

export function CheckoutView() {
  const cart = useCartState();
  const hydrated = useHydrated();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const t = totalsOf(cart);
  const started = useRef(false);
  useEffect(() => {
    if (!hydrated || started.current || cart.items.length === 0) return;
    started.current = true;
    track({ name: "begin_checkout", value: t.total, items: cart.items.map(cartItem) });
  }, [hydrated, cart.items, t.total]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+380");
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("branch");
  const [city, setCity] = useState<string | null>(null);
  const [point, setPoint] = useState<string | null>(null);
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [flat, setFlat] = useState("");
  const [payment, setPayment] = useState<Payment>("online");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "paying">("idle");

  const cityOptions = useMemo(() => NP_CITIES.map((c) => ({ value: c.ref, label: c.name, hint: c.region })), []);
  const points = useMemo(
    () => (city && (delivery === "branch" || delivery === "locker") ? getPoints(city, delivery) : []),
    [city, delivery],
  );
  const selectedPoint = points.find((p) => p.ref === point);
  const pointOptions = useMemo(() => points.map((p) => ({ value: p.ref, label: pointLabel(p), hint: p.note })), [points]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (firstName.trim().length < 2) e.firstName = "Вкажіть ім'я";
    if (lastName.trim().length < 2) e.lastName = "Вкажіть прізвище — потрібне для Нової пошти";
    if (phoneDigits(phone).length !== 12) e.phone = "Телефон у форматі +380 XX XXX XX XX";
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Перевірте e-mail";
    if (delivery !== "pickup" && !city) e.city = "Оберіть місто";
    if ((delivery === "branch" || delivery === "locker") && !point)
      e.point = delivery === "branch" ? "Оберіть відділення" : "Оберіть поштомат";
    if (delivery === "courier" && street.trim().length < 3) e.street = "Вкажіть вулицю";
    if (delivery === "courier" && !house.trim()) e.house = "Вкажіть будинок";
    if (!consent) e.consent = "Потрібна ваша згода з умовами";
    return e;
  };

  const deliveryLabel = () => {
    const cityName = NP_CITIES.find((c) => c.ref === city)?.name;
    if (delivery === "pickup") return `Самовивіз: ${CONTACTS.address}`;
    if (delivery === "courier") return `Кур'єр НП: ${cityName}, ${street}, ${house}${flat ? `, кв. ${flat}` : ""}`;
    const p = points.find((x) => x.ref === point);
    return `${cityName}, ${p ? pointLabel(p) : ""}`;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      // Фокус на перше поле з помилкою
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }

    const id = newOrderId();
    saveOrder({
      id,
      createdAt: new Date().toISOString(),
      items: cart.items,
      subtotal: t.subtotal,
      discount: t.discount,
      total: t.total,
      promo: cart.promo?.code,
      customer: { firstName: firstName.trim(), lastName: lastName.trim(), phone, email: email.trim() },
      delivery: { method: delivery, label: deliveryLabel() },
      payment,
      comment: comment.trim() || undefined,
    });

    // ДЕМО: тут буде редірект на сторінку платіжного провайдера
    if (payment === "online") {
      setStatus("paying");
      await new Promise((r) => setTimeout(r, 1400));
    }
    const fail = new URLSearchParams(window.location.search).get("demo") === "fail";
    router.push(`/order/${fail ? "failed" : "success"}?id=${id}`);
  };

  if (!hydrated) return <div className={styles.skeleton} aria-hidden="true" />;

  if (cart.items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <p>У кошику немає товарів — додайте щось, щоб оформити замовлення.</p>
        <Button href="/catalog" size="lg" arrow>
          До каталогу
        </Button>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`err-${k}`} className={styles.error}>
        {errors[k]}
      </p>
    ) : null;
  const invalid = (k: keyof Errors) => ({
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? `err-${k}` : undefined,
  });
  const clear = (k: keyof Errors) => errors[k] && setErrors((x) => ({ ...x, [k]: undefined }));

  return (
    <div className={styles.layout}>
      <form id="checkout-form" ref={formRef} className={styles.form} onSubmit={submit} noValidate>
        {/* 1. Контакти */}
        <Step n={1} title="Контактні дані">
          <div className={styles.grid2}>
            <Field label="Ім'я" id="firstName" error={err("firstName")}>
              <input
                id="firstName" placeholder="Олена"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => (setFirstName(e.target.value), clear("firstName"))}
                {...invalid("firstName")}
              />
            </Field>
            <Field label="Прізвище" id="lastName" error={err("lastName")}>
              <input
                id="lastName" placeholder="Коваленко"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => (setLastName(e.target.value), clear("lastName"))}
                {...invalid("lastName")}
              />
            </Field>
            <Field label="Телефон" id="phone" error={err("phone")}>
              <input
                id="phone" placeholder="+380 XX XXX XX XX"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => (setPhone(formatPhone(e.target.value)), clear("phone"))}
                {...invalid("phone")}
              />
            </Field>
            <Field label="E-mail" id="email" optional error={err("email")} hint="Надішлемо підтвердження й номер ТТН">
              <input
                id="email" placeholder="name@example.com"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => (setEmail(e.target.value), clear("email"))}
                {...invalid("email")}
              />
            </Field>
          </div>
        </Step>

        {/* 2. Доставка */}
        <Step n={2} title="Доставка">
          {/* Десктоп — плитки, мобільний — випадний список */}
          <fieldset className={styles.methods}>
            <legend className="visually-hidden">Спосіб доставки</legend>
            {/* Явно групуємо: три способи — це Нова пошта, самовивіз — окремо */}
            <div className={styles.methodGroup}>
              <p className={styles.methodGroupTitle}>
                <span className={styles.np}>НП</span>
                Доставка Новою поштою
              </p>
              <div className={styles.methodRow}>
                {DELIVERY.filter((d) => d.key !== "pickup").map((d) => (
                  <MethodTile key={d.key} d={d} checked={delivery === d.key} onSelect={() => (setDelivery(d.key), setPoint(null))} />
                ))}
              </div>
            </div>
            <div className={styles.methodGroup}>
              <p className={styles.methodGroupTitle}>
                <Logo variant="mark" title="" className={styles.groupMark} />
                Без доставки
              </p>
              <div className={styles.methodRow}>
                {DELIVERY.filter((d) => d.key === "pickup").map((d) => (
                  <MethodTile key={d.key} d={d} checked={delivery === d.key} onSelect={() => (setDelivery(d.key), setPoint(null))} />
                ))}
              </div>
            </div>
          </fieldset>
          <Select<Delivery>
            className={styles.methodSelect}
            label="Спосіб доставки"
            value={delivery}
            options={DELIVERY.map((d) => ({ value: d.key, label: d.title, hint: d.text }))}
            onChange={(v) => {
              setDelivery(v);
              setPoint(null);
            }}
          />

          <div className={styles.deliveryPanel}>
            {delivery === "pickup" ? (
              <div className={styles.pickup}>
                <Logo variant="mark" title="" className={styles.pickupMark} />
                <div>
                  <p className={styles.pickupTitle}>Студія IRPIN BRIDGE</p>
                  <p>{CONTACTS.address}</p>
                  <p className={styles.muted}>{CONTACTS.hours}</p>
                  <p className={styles.muted}>Менеджер напише, коли замовлення буде готове до видачі.</p>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.grid2}>
                  <Combobox
                    label="Місто"
                    placeholder="Почніть вводити назву"
                    options={cityOptions}
                    value={city}
                    onChange={(v) => {
                      setCity(v);
                      setPoint(null);
                      clear("city");
                    }}
                    error={errors.city}
                  />
                  {delivery === "courier" ? (
                    <Field label="Вулиця" id="street" error={err("street")}>
                      <input
                        id="street" placeholder="Напр., вул. Соборна"
                        autoComplete="address-line1"
                        value={street}
                        onChange={(e) => (setStreet(e.target.value), clear("street"))}
                        {...invalid("street")}
                      />
                    </Field>
                  ) : (
                    <Combobox
                      key={`${city}-${delivery}`}
                      label={delivery === "branch" ? "Відділення" : "Поштомат"}
                      placeholder={city ? "Номер або вулиця" : "Спочатку оберіть місто"}
                      options={pointOptions}
                      value={point}
                      disabled={!city}
                      onChange={(v) => (setPoint(v), clear("point"))}
                      error={errors.point}
                      limit={12}
                    />
                  )}
                  {delivery === "courier" && (
                    <>
                      <Field label="Будинок" id="house" error={err("house")}>
                        <input id="house" placeholder="12А" value={house} onChange={(e) => (setHouse(e.target.value), clear("house"))} {...invalid("house")} />
                      </Field>
                      <Field label="Квартира" id="flat" optional>
                        <input id="flat" placeholder="45" value={flat} onChange={(e) => setFlat(e.target.value)} />
                      </Field>
                    </>
                  )}
                </div>

                {selectedPoint && (
                  <p className={styles.chosen}>
                    <Icon name="pin" size={20} />
                    <span>
                      <strong>{pointLabel(selectedPoint)}</strong>
                      <span>
                        {NP_CITIES.find((c) => c.ref === city)?.name} · {selectedPoint.note}
                      </span>
                    </span>
                  </p>
                )}
              </>
            )}

            <p className={styles.eta}>
              <Icon name="clock" size={18} />
              {etaLabel(delivery)}
              {delivery !== "pickup" && <span> · вартість — за тарифами Нової пошти, оплачується при отриманні</span>}
            </p>
          </div>
        </Step>

        {/* 3. Оплата */}
        <Step n={3} title="Оплата">
          <fieldset className={styles.options}>
            <legend className="visually-hidden">Спосіб оплати</legend>
            {PAYMENT.map((p) => (
              <label key={p.key} className={styles.option}>
                <input type="radio" name="payment" checked={payment === p.key} onChange={() => setPayment(p.key)} />
                <span className={styles.radio} aria-hidden="true" />
                <span className={styles.optionText}>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </Step>

        {/* 4. Коментар і згода */}
        <Step n={4} title="Коментар">
          <Field label="Коментар до замовлення" id="comment" optional>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Побажання щодо пакування, зручний час дзвінка…"
            />
          </Field>
        </Step>

        <div className={styles.consentBlock}>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => (setConsent(e.target.checked), clear("consent"))}
              {...invalid("consent")}
            />
            <span className={styles.box} aria-hidden="true">
              <Icon name="check" size={14} />
            </span>
            <span>
              Я ознайомлений(-а) з <Link href="/info/oferta">публічною офертою</Link>,{" "}
              <Link href="/info/privacy">політикою конфіденційності</Link> та{" "}
              <Link href="/info/returns">умовами обміну й повернення</Link>
            </span>
          </label>
          {err("consent")}
        </div>

        <Button type="submit" size="lg" arrow block className={styles.submitMobile} disabled={status === "paying"}>
          {payment === "online" ? `Оплатити ${formatPrice(t.total)}` : "Підтвердити замовлення"}
        </Button>
      </form>

      {/* Підсумок */}
      <aside className={styles.summary} aria-label="Ваше замовлення">
        <div className={styles.summaryHead}>
          <h2>Ваше замовлення</h2>
          <Link href="/cart">Змінити</Link>
        </div>
        <ul role="list" className={styles.items}>
          {cart.items.map((i) => (
            <li key={itemKey(i)}>
              <CartThumb item={i} size={56} />
              <span className={styles.itemText}>
                <strong>{i.name}</strong>
                <span>
                  {i.color}
                  {i.size !== "One size" ? ` · ${i.size}` : ""} · {i.qty} шт.
                </span>
              </span>
              <span className={styles.itemPrice}>{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <PromoForm />
        <Totals />
        <Button type="submit" form="checkout-form" size="lg" arrow block className={styles.submitDesktop} disabled={status === "paying"}>
          {payment === "online" ? `Оплатити ${formatPrice(t.total)}` : "Підтвердити замовлення"}
        </Button>
        <p className={styles.secure}>
          <Icon name="check" size={16} /> Безпечна оплата через сертифікованого провайдера
        </p>
        <MissionNote />
      </aside>

      {status === "paying" && (
        <div className={styles.paying} role="status" aria-live="assertive">
          <Logo variant="mark" title="" className={styles.payingMark} />
          <p>Переходимо до оплати…</p>
        </div>
      )}
    </div>
  );
}

function MethodTile({ d, checked, onSelect }: { d: (typeof DELIVERY)[number]; checked: boolean; onSelect: () => void }) {
  return (
    <label className={styles.method}>
      <input type="radio" name="delivery" checked={checked} onChange={onSelect} aria-label={d.title} />
      <Icon name={d.icon} size={26} className={styles.methodIcon} />
      <strong>{d.short}</strong>
      <span>{d.text}</span>
    </label>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className={styles.step} aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className={styles.stepTitle}>
        <span>{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  id,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  id: string;
  error?: ReactNode;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label} {optional && <span className={styles.optional}>необов&apos;язково</span>}
      </label>
      {children}
      {error ?? (hint && <p className={styles.hint}>{hint}</p>)}
    </div>
  );
}
