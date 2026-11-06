"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CONTACTS } from "@/data/site";
import { formatPhone, phoneDigits } from "@/lib/order";
import { MODAL_EVENT, openRequestModal, submitRequest, type ModalKind } from "@/lib/requests";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Check, Chips, Field, FileUpload, type UploadFile } from "./Fields";
import styles from "./Forms.module.css";
import m from "./RequestModal.module.css";

const TIMES = [
  { value: "now", label: "Якнайшвидше" },
  { value: "morning", label: "До 12:00" },
  { value: "day", label: "12:00–15:00" },
  { value: "evening", label: "Після 15:00" },
] as const;

/** Глобальні модальні форми: «Передзвоніть мені» і «Співпраця з митцями». Монтується один раз у шапці. */
export function RequestModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<ModalKind | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setKind((e as CustomEvent<ModalKind>).detail);
      setDoneId(null);
      ref.current?.showModal();
    };
    window.addEventListener(MODAL_EVENT, onOpen);
    return () => window.removeEventListener(MODAL_EVENT, onOpen);
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className={m.dialog}
      aria-labelledby="rm-title"
      onClick={(e) => e.target === ref.current && close()}
      onClose={() => setKind(null)}
    >
      <div className={m.inner}>
        <button type="button" className={m.close} onClick={close} aria-label="Закрити">
          <Icon name="close" />
        </button>
        {doneId ? (
          <Done kind={kind} id={doneId} onClose={close} />
        ) : kind === "callback" ? (
          <CallbackForm onDone={setDoneId} />
        ) : kind === "artist" ? (
          <ArtistForm onDone={setDoneId} />
        ) : null}
      </div>
    </dialog>
  );
}

function Head({ title, lead, inline }: { title: string; lead: string; inline?: boolean }) {
  // У вбудованій формі заголовок дає сама секція сторінки
  if (inline) return null;
  return (
    <div className={m.head}>
      <h2 id={inline ? undefined : "rm-title"}>{title}</h2>
      <p>{lead}</p>
    </div>
  );
}

function CallbackForm({ onDone, inline }: { onDone: (id: string) => void; inline?: boolean }) {
  const px = inline ? "in-" : "";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+380");
  const [time, setTime] = useState<string[]>(["now"]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (name.trim().length < 2) err.name = "Вкажіть ім'я";
    if (phoneDigits(phone).length !== 12) err.phone = "Телефон у форматі +380 XX XXX XX XX";
    if (!consent) err.consent = "Потрібна згода на обробку даних";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSending(true);
    const rec = await submitRequest({
      type: "callback",
      contact: { name: name.trim(), phone },
      summary: [["Коли зателефонувати", TIMES.find((t) => t.value === time[0])?.label ?? ""]],
      files: [],
    });
    onDone(rec.id);
  };

  return (
    <form className={m.form} onSubmit={submit} noValidate>
      <Head inline={inline} title="Передзвоніть мені" lead="Залиште номер — менеджер зателефонує в робочий час і відповість на питання." />
      <Field label="Ім'я" htmlFor={`${px}cb-name`} error={errors.name}>
        <input id={`${px}cb-name`} placeholder="Як до вас звертатися" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} autoFocus={!inline} />
      </Field>
      <Field label="Телефон" htmlFor={`${px}cb-phone`} error={errors.phone}>
        <input id={`${px}cb-phone`} placeholder="+380 XX XXX XX XX" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
      </Field>
      <Field label="Коли зручно">
        <Chips label="Час дзвінка" options={TIMES} value={time} onChange={setTime} />
      </Field>
      <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      <Button type="submit" size="lg" arrow block disabled={sending}>
        {sending ? "Надсилаємо…" : "Чекаю дзвінка"}
      </Button>
      <p className={styles.hint}>{CONTACTS.hours}</p>
    </form>
  );
}

function ArtistForm({ onDone, inline }: { onDone: (id: string) => void; inline?: boolean }) {
  const px = inline ? "in-" : "";
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [idea, setIdea] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (name.trim().length < 2) err.name = "Вкажіть ім'я";
    if (contact.trim().length < 5) err.contact = "Вкажіть e-mail, телефон або нік у Telegram";
    if (!portfolio.trim() && files.length === 0) err.portfolio = "Додайте посилання на портфоліо або кілька робіт";
    if (!consent) err.consent = "Потрібна згода на обробку даних";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSending(true);
    const rec = await submitRequest({
      type: "artist",
      contact: { name: name.trim(), email: contact.trim() },
      summary: [
        ["Портфоліо", portfolio.trim() || "файли в заявці"],
        ...(idea.trim() ? ([["Ідея", idea.trim()]] as [string, string][]) : []),
      ],
      files: files.map((f) => ({ name: f.file.name, size: f.file.size })),
    });
    onDone(rec.id);
  };

  return (
    <form className={m.form} onSubmit={submit} noValidate>
      <Head
        inline={inline}
        title="Створімо колекцію разом"
        lead="Шукаємо митців для спільних колекцій: ваш стиль — наше виробництво. Розкажіть про себе й покажіть роботи."
      />
      <div className={styles.grid2}>
        <Field label="Ім'я або псевдонім" htmlFor={`${px}ar-name`} error={errors.name}>
          <input id={`${px}ar-name`} placeholder="Напр., Олена Коваль" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} autoFocus={!inline} />
        </Field>
        <Field label="Як з вами зв'язатися" htmlFor={`${px}ar-contact`} error={errors.contact}>
          <input id={`${px}ar-contact`} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="E-mail, телефон або @telegram" />
        </Field>
      </div>
      <Field label="Портфоліо" htmlFor={`${px}ar-portfolio`} error={errors.portfolio} hint="Instagram, Behance, сайт — або додайте роботи нижче">
        <input id={`${px}ar-portfolio`} type="url" inputMode="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://" />
      </Field>
      <Field label="Ідея колекції" htmlFor={`${px}ar-idea`} optional>
        <textarea id={`${px}ar-idea`} rows={3} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Тема, настрій, на яких речах бачите свої роботи" />
      </Field>
      <Field label="Приклади робіт" optional>
        <FileUpload files={files} onChange={setFiles} hint="PNG, JPG, PDF — до 50 МБ кожен" />
      </Field>
      <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      <Button type="submit" size="lg" arrow block disabled={sending}>
        {sending ? "Надсилаємо…" : "Запропонувати співпрацю"}
      </Button>
    </form>
  );
}

function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div>
      <Check checked={checked} onChange={onChange} invalid={Boolean(error)}>
        Погоджуюсь з <Link href="/info/privacy">політикою конфіденційності</Link>
      </Check>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function Done({ kind, id, onClose, inline }: { kind: ModalKind | null; id: string; onClose: () => void; inline?: boolean }) {
  return (
    <div className={m.done} role="status">
      <span className={m.doneIcon}>
        <Icon name="check" size={28} />
      </span>
      <p className={m.doneNum}>Заявка №{id}</p>
      <h2 id={inline ? undefined : "rm-title"}>{kind === "artist" ? "Дякуємо за інтерес до співпраці!" : "Дякуємо, передзвонимо!"}</h2>
      <p>
        {kind === "artist"
          ? "Куратор подивиться роботи й відповість протягом кількох днів."
          : "Менеджер зателефонує в обраний час протягом робочого дня."}
      </p>
      <Button onClick={onClose} variant="outline">
        {inline ? "Надіслати ще одну" : "Закрити"}
      </Button>
    </div>
  );
}

/** Кнопка, що відкриває модальну форму. Працює і в серверних компонентах. */
export function ModalTrigger({ kind, children, ...rest }: { kind: ModalKind; children: ReactNode } & Omit<ButtonProps, "href" | "children" | "onClick">) {
  return (
    <Button {...(rest as object)} onClick={() => openRequestModal(kind)}>
      {children}
    </Button>
  );
}

/** Та сама форма, вбудована в сторінку (Контакти, Арт-мерч) — без модального вікна */
export function InlineRequest({ kind }: { kind: ModalKind }) {
  const [doneId, setDoneId] = useState<string | null>(null);
  return (
    <div className={m.inline}>
      {doneId ? (
        <Done kind={kind} id={doneId} inline onClose={() => setDoneId(null)} />
      ) : kind === "callback" ? (
        <CallbackForm inline onDone={setDoneId} />
      ) : (
        <ArtistForm inline onDone={setDoneId} />
      )}
    </div>
  );
}
