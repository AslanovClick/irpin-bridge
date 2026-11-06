"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatPhone, phoneDigits } from "@/lib/order";
import { submitRequest, type RequestType } from "@/lib/requests";
import { Button } from "@/components/ui/Button";
import { Check, Chips, Field, FileUpload, type UploadFile } from "./Fields";
import styles from "./Forms.module.css";
import q from "./QuickRequestForm.module.css";

const INTENTS = [
  { value: "calc", label: "Розрахувати вартість" },
  { value: "layout", label: "Надіслати макет" },
  { value: "order", label: "Зробити замовлення" },
] as const;

type Intent = (typeof INTENTS)[number]["value"];

/** Коротка заявка (одна сторінка): послуги, загальний прорахунок */
export function QuickRequestForm({
  topic,
  type = "service",
  defaultIntent = "calc",
}: {
  /** Напр. «DTF-друк» — потрапляє в заявку */
  topic: string;
  type?: RequestType;
  defaultIntent?: Intent;
}) {
  const router = useRouter();
  const [intent, setIntent] = useState<Intent[]>([defaultIntent]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+380");
  const [qty, setQty] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (name.trim().length < 2) err.name = "Вкажіть ім'я";
    if (phoneDigits(phone).length !== 12) err.phone = "Телефон у форматі +380 XX XXX XX XX";
    if (intent[0] === "layout" && files.length === 0) err.files = "Додайте файл макета";
    if (!consent) err.consent = "Потрібна згода на обробку даних";
    setErrors(err);
    if (Object.keys(err).length) return;

    setSending(true);
    const rec = await submitRequest({
      type,
      contact: { name: name.trim(), phone },
      summary: [
        ["Послуга", topic],
        ["Запит", INTENTS.find((i) => i.value === intent[0])?.label ?? ""],
        ...(qty ? ([["Кількість", `${qty} шт.`]] as [string, string][]) : []),
        ...(comment.trim() ? ([["Коментар", comment.trim()]] as [string, string][]) : []),
      ],
      files: files.map((f) => ({ name: f.file.name, size: f.file.size })),
    });
    router.push(`/request/success?id=${rec.id}`);
  };

  return (
    <form className={q.form} onSubmit={submit} noValidate>
      <div className={q.intents}>
        <Chips label="Що потрібно" options={INTENTS} value={intent} onChange={(v) => setIntent(v.length ? v : intent)} />
      </div>
      <div className={styles.grid2}>
        <Field label="Ім'я" htmlFor="q-name" error={errors.name}>
          <input id="q-name" placeholder="Як до вас звертатися" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Телефон" htmlFor="q-phone" error={errors.phone}>
          <input
            id="q-phone" placeholder="+380 XX XXX XX XX"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
          />
        </Field>
        <Field label="Кількість виробів" htmlFor="q-qty" optional>
          <input id="q-qty" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))} placeholder="Напр. 20" />
        </Field>
        <Field label="Коментар" htmlFor="q-comment" optional>
          <input id="q-comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Виріб, розмір принта, терміни" />
        </Field>
      </div>
      <Field label="Макет" optional={intent[0] !== "layout"} error={errors.files}>
        <FileUpload files={files} onChange={setFiles} />
      </Field>
      <Check checked={consent} onChange={setConsent} invalid={Boolean(errors.consent)}>
        Погоджуюсь з <Link href="/info/privacy">політикою конфіденційності</Link>
      </Check>
      {errors.consent && <p className={styles.error}>{errors.consent}</p>}
      <div className={q.foot}>
        <Button type="submit" size="lg" arrow disabled={sending}>
          {sending ? "Надсилаємо…" : INTENTS.find((i) => i.value === intent[0])?.label}
        </Button>
        <p className={styles.hint}>Менеджер відповість протягом робочого дня.</p>
      </div>
    </form>
  );
}
