"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPhone, phoneDigits } from "@/lib/order";
import { submitRequest, useDraft } from "@/lib/requests";
import { Logo } from "@/components/ui/Logo";
import { Check, ChoiceCards, Chips, Field, FileUpload, Qty, type UploadFile } from "./Fields";
import { Wizard } from "./Wizard";
import styles from "./Forms.module.css";
import b from "./BusinessForm.module.css";

/* ДЕМО: перелік типів продукції — погодити з асортиментом замовника */
export const B2B_TYPES = [
  { value: "tees", label: "Футболки" },
  { value: "hoodies", label: "Худі" },
  { value: "sweatshirts", label: "Світшоти" },
  { value: "totes", label: "Шопери" },
  { value: "caps", label: "Кепки" },
  { value: "other", label: "Інший текстиль" },
] as const;

const TECH = [
  { value: "dtf", title: "DTF-друк", text: "Яскраві повноколірні логотипи" },
  { value: "embroidery", title: "Вишивка", text: "Преміальний вигляд, роками" },
  { value: "both", title: "Поєднати", text: "Напр. вишивка на грудях + друк на спині" },
  { value: "advise", title: "Порадьте", text: "Підберемо під бюджет і задачу" },
] as const;

const BUDGETS = [
  { value: "lt10", label: "до 10 000 ₴" },
  { value: "10-30", label: "10–30 тис. ₴" },
  { value: "30-100", label: "30–100 тис. ₴" },
  { value: "gt100", label: "понад 100 тис. ₴" },
] as const;

type Draft = {
  company: string;
  edrpou: string;
  purpose: string[];
  types: Record<string, number>;
  tech: string | null;
  noLogo: boolean;
  deadline: string;
  flexible: boolean;
  budget: string[];
  comment: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  consent: boolean;
};

const INITIAL: Draft = {
  company: "",
  edrpou: "",
  purpose: [],
  types: {},
  tech: null,
  noLogo: false,
  deadline: "",
  flexible: false,
  budget: [],
  comment: "",
  name: "",
  role: "",
  phone: "+380",
  email: "",
  consent: false,
};

const fmtDate = (iso: string) => (iso ? new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)) : "");

export function BusinessForm() {
  const { value: d, setValue, restored, clear } = useDraft<Draft>("business-v2", INITIAL);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const router = useRouter();
  const set = (patch: Partial<Draft>) => setValue((v) => ({ ...v, ...patch }));

  const chosen = B2B_TYPES.filter((t) => d.types[t.value] !== undefined);
  const total = chosen.reduce((n, t) => n + (d.types[t.value] ?? 0), 0);
  const typesText = chosen.map((t) => `${t.label} × ${d.types[t.value]}`).join(", ");
  const techTitle = TECH.find((t) => t.value === d.tech)?.title;
  const deadlineText = d.flexible ? "Гнучкі терміни" : fmtDate(d.deadline);

  const toggleType = (key: string) => {
    const next = { ...d.types };
    if (next[key] === undefined) next[key] = 10;
    else delete next[key];
    set({ types: next });
  };

  const onSubmit = async () => {
    const rec = await submitRequest({
      type: "business",
      contact: { name: d.name.trim(), phone: d.phone, email: d.email.trim() },
      summary: [
        ["Компанія", `${d.company.trim()}${d.edrpou ? `, ЄДРПОУ ${d.edrpou}` : ""}`],
        ["Продукція", `${typesText} (разом ${total} шт.)`],
        ["Нанесення", techTitle ?? ""],
        ["Термін", deadlineText],
      ],
      files: files.map((f) => ({ name: f.file.name, size: f.file.size })),
    });
    clear();
    router.push(`/request/success?id=${rec.id}`);
  };

  const steps = [
    /* ── 1. Що потрібно ── */
    {
      id: "products",
      title: "Що потрібно",
      summary: total ? `${chosen.map((t) => t.label).join(", ")} · ${total} шт.${techTitle ? ` · ${techTitle}` : ""}` : null,
      validate: () =>
        chosen.length === 0 ? "Оберіть хоча б один тип продукції" : total < 1 ? "Вкажіть кількість" : !d.tech ? "Оберіть технологію нанесення" : null,
      content: (
        <>
          <Field label="Продукція й кількість" hint="Можна обрати кілька типів — для кожного вкажіть кількість">
            <ul role="list" className={b.types}>
              {B2B_TYPES.map((t) => {
                const on = d.types[t.value] !== undefined;
                return (
                  <li key={t.value} className={b.type} data-on={on || undefined}>
                    <Check checked={on} onChange={() => toggleType(t.value)}>
                      <strong>{t.label}</strong>
                    </Check>
                    {on && (
                      <Qty
                        value={d.types[t.value]}
                        onChange={(n) => setValue((v) => ({ ...v, types: { ...v.types, [t.value]: n } }))}
                        label={`Кількість: ${t.label}`}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </Field>
          <p className={b.total}>
            Разом: <strong>{total} шт.</strong>
            {total > 0 && total < 10 && (
              <span>
                {" "}
                · для тиражу до 10 шт. зручніше <Link href="/customize">кастомізація</Link>
              </span>
            )}
          </p>
          <Field label="Технологія нанесення">
            <ChoiceCards name="tech" options={TECH} value={d.tech} onChange={(v) => set({ tech: v })} columns={4} />
          </Field>
        </>
      ),
    },

    /* ── 2. Логотип і терміни ── */
    {
      id: "details",
      title: "Логотип і терміни",
      summary: deadlineText ? `${deadlineText}${files.length ? ` · ${files.length} файл(и)` : ""}` : null,
      validate: () =>
        files.length === 0 && !d.noLogo
          ? "Завантажте логотип або позначте, що надішлете його пізніше"
          : !d.flexible && !d.deadline
            ? "Вкажіть бажану дату або позначте, що терміни гнучкі"
            : null,
      content: (
        <>
          <div className={b.details}>
            <div className={b.block}>
              <Field label="Логотип або макет">
                <FileUpload files={files} onChange={setFiles} compact hint="Краще вектор: AI, SVG, PDF, CDR або PNG від 300 dpi" />
              </Field>
              <Check checked={d.noLogo} onChange={(v) => set({ noLogo: v })}>
                Надішлю пізніше / потрібна допомога з макетом
              </Check>
            </div>
            <div className={b.block}>
              <Field label="Бажаний термін готовності" htmlFor="b-deadline">
                <input id="b-deadline" type="date" value={d.deadline} disabled={d.flexible} onChange={(e) => set({ deadline: e.target.value })} />
              </Field>
              <Check checked={d.flexible} onChange={(v) => set({ flexible: v, deadline: v ? "" : d.deadline })}>
                Терміни гнучкі — зазвичай 7–14 робочих днів
              </Check>
            </div>
          </div>
          <Field label="Орієнтовний бюджет" optional>
            <Chips label="Бюджет" options={BUDGETS} value={d.budget} onChange={(v) => set({ budget: v })} />
          </Field>
          <Field label="Коментар" htmlFor="b-comment" optional>
            <textarea
              id="b-comment"
              placeholder="Кольори, розміри, пакування, доставка в кілька міст"
              rows={2}
              value={d.comment}
              onChange={(e) => set({ comment: e.target.value })}
            />
          </Field>
        </>
      ),
    },

    /* ── 3. Компанія й контакти ── */
    {
      id: "contacts",
      title: "Компанія й контакти",
      validate: () =>
        d.company.trim().length < 2
          ? "Вкажіть назву компанії чи організації"
          : d.name.trim().length < 2
            ? "Вкажіть ім'я контактної особи"
            : phoneDigits(d.phone).length !== 12
              ? "Телефон у форматі +380 XX XXX XX XX"
              : !/^\S+@\S+\.\S+$/.test(d.email.trim())
                ? "Вкажіть e-mail — надішлемо комерційну пропозицію"
                : !d.consent
                  ? "Потрібна згода на обробку даних"
                  : null,
      content: (
        <>
          <dl className={styles.review}>
            <div>
              <dt>Продукція</dt>
              <dd>
                {typesText} — разом {total} шт.
              </dd>
            </div>
            <div>
              <dt>Нанесення</dt>
              <dd>
                {techTitle} · {files.length ? files.map((f) => f.file.name).join(", ") : "логотип надішлю пізніше"}
              </dd>
            </div>
            <div>
              <dt>Термін</dt>
              <dd>
                {deadlineText}
                {d.budget[0] && ` · бюджет ${BUDGETS.find((x) => x.value === d.budget[0])?.label}`}
              </dd>
            </div>
          </dl>
          <div className={styles.grid2}>
            <Field label="Компанія чи організація" htmlFor="b-company">
              <input
                id="b-company"
                placeholder="ТОВ «Назва» або ФОП"
                autoComplete="organization"
                value={d.company}
                onChange={(e) => set({ company: e.target.value })}
              />
            </Field>
            <Field label="ЄДРПОУ" htmlFor="b-edrpou" optional hint="Для рахунку й документів">
              <input
                id="b-edrpou"
                placeholder="8 або 10 цифр"
                inputMode="numeric"
                maxLength={10}
                value={d.edrpou}
                onChange={(e) => set({ edrpou: e.target.value.replace(/\D/g, "") })}
              />
            </Field>
            <Field label="Контактна особа" htmlFor="b-name">
              <input id="b-name" placeholder="Ім'я та прізвище" autoComplete="name" value={d.name} onChange={(e) => set({ name: e.target.value })} />
            </Field>
            <Field label="Посада" htmlFor="b-role" optional>
              <input
                id="b-role"
                placeholder="Напр., HR-менеджер"
                autoComplete="organization-title"
                value={d.role}
                onChange={(e) => set({ role: e.target.value })}
              />
            </Field>
            <Field label="Телефон" htmlFor="b-phone">
              <input
                id="b-phone"
                placeholder="+380 XX XXX XX XX"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={d.phone}
                onChange={(e) => set({ phone: formatPhone(e.target.value) })}
              />
            </Field>
            <Field label="E-mail" htmlFor="b-email" hint="Надішлемо комерційну пропозицію">
              <input
                id="b-email"
                placeholder="name@company.ua"
                type="email"
                autoComplete="email"
                value={d.email}
                onChange={(e) => set({ email: e.target.value })}
              />
            </Field>
          </div>
          <Check checked={d.consent} onChange={(v) => set({ consent: v })}>
            Погоджуюсь з <Link href="/info/privacy">політикою конфіденційності</Link>
          </Check>
          <p className={b.next}>
            <strong>Що далі.</strong> Протягом робочого дня надішлемо комерційну пропозицію з варіантами виробів і нанесення.
            Після погодження — зразок, потім тираж.
          </p>
        </>
      ),
    },
  ];

  return (
    <Wizard
      steps={steps}
      onSubmit={onSubmit}
      submitLabel="Отримати прорахунок"
      restored={restored}
      onReset={clear}
      aside={
        <p className={b.asideNote}>
          <Logo variant="mark" title="" className={b.asideMark} />
          Комерційна пропозиція — протягом робочого дня. Працюємо з ФОП і юрособами, документи для бухгалтерії.
        </p>
      }
    />
  );
}
