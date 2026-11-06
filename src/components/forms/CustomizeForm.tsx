"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { ColorOption, Product, SizeChart } from "@/data/types";
import { formatPrice } from "@/lib/catalog";
import { formatPhone, phoneDigits } from "@/lib/order";
import { submitRequest, useDraft } from "@/lib/requests";
import { Logo } from "@/components/ui/Logo";
import { SizeChartButton } from "@/components/product/SizeChartButton";
import { Check, Chips, Field, FileUpload, Qty, type UploadFile } from "./Fields";
import { Mockup, mockupKind, ZONES } from "./Mockup";
import { Wizard } from "./Wizard";
import styles from "./Forms.module.css";
import own from "./CustomizeForm.module.css";

type Method = "dtf" | "embroidery" | "advise";
type Channel = "telegram" | "viber" | "call";

const METHODS = [
  { value: "dtf", label: "DTF-друк" },
  { value: "embroidery", label: "Вишивка" },
  { value: "advise", label: "Порадьте мені" },
] as const;

const METHOD_HINT: Record<Method, string> = {
  dtf: "Повноколірні зображення, фото, градієнти — від 150 ₴",
  embroidery: "Логотипи й написи, що служать роками — від 200 ₴",
  advise: "Підберемо технологію під ваш макет і бюджет",
};

const CHANNELS = [
  { value: "telegram", label: "Telegram" },
  { value: "viber", label: "Viber" },
  { value: "call", label: "Дзвінок" },
] as const;

/**
 * Кастомізуємо «чисту» заготовку певного типу — конкретна модель з каталогу (з її принтом) тут
 * не важлива. base — модель, з якої беремо фото й ціну «від» (базова доросла, не дитяча).
 * Кольори й розміри заготовки — об'єднання всіх моделей категорії.
 */
const TYPES = [
  { cat: "futbolky", name: "Футболка", base: "futbolka-bazova-mini-logo" },
  { cat: "khudi", name: "Худі", base: "khudi-mistse-shcho-iednaie" },
  { cat: "svitshoty", name: "Світшот", base: "svitshot-bazovyi" },
  { cat: "shopery", name: "Шопер", base: "shoper-znak-laim" },
  { cat: "aksesuary", name: "Кепка", base: "kepka-znak" },
  { cat: "shtany", name: "Штани", base: "shtany-trykotazhni" },
];

const isKids = (p: Product) => /дитяч/i.test(p.name);

/** Порядок розмірів: дорослі, універсальний, дитячі */
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "One size", "110", "122", "134", "146", "158"];
const isKidSize = (s: string) => /^\d+$/.test(s);

type Blank = {
  cat: string;
  name: string;
  price: number;
  image?: string;
  placeholder?: Product["placeholder"];
  colors: ColorOption[];
  sizes: string[];
};

type Draft = {
  product: string | null;
  ownItem: string;
  color: string | null;
  sizes: Record<string, number>;
  ownQty: number;
  method: Method[];
  placements: string[];
  noLayout: boolean;
  comment: string;
  name: string;
  phone: string;
  email: string;
  channel: Channel[];
  consent: boolean;
};

const INITIAL: Draft = {
  product: null,
  ownItem: "",
  color: null,
  sizes: {},
  ownQty: 1,
  method: ["dtf"],
  placements: [],
  noLayout: false,
  comment: "",
  name: "",
  phone: "+380",
  email: "",
  channel: ["telegram"],
  consent: false,
};

type Props = { products: Product[]; charts: Record<string, SizeChart> };

/** Заявка на кастомізацію (3 кроки). Обгортати в <Suspense> (useSearchParams для ?product=). */
export function CustomizeForm({ products, charts }: Props) {
  const params = useSearchParams();
  const preset = params.get("product");
  const initial = useMemo<Draft>(() => {
    // ?product=slug з картки товару → обираємо заготовку цього типу й колір товару
    const p = preset ? products.find((x) => x.slug === preset) : undefined;
    return p ? { ...INITIAL, product: p.category, color: p.colors[0]?.name ?? null } : INITIAL;
  }, [preset, products]);
  const { value: d, setValue, restored, clear } = useDraft<Draft>("customize-v3", initial);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const blanks = useMemo<Blank[]>(
    () =>
      TYPES.flatMap((t) => {
        const list = products.filter((p) => p.category === t.cat);
        if (!list.length) return [];
        const adults = list.filter((p) => !isKids(p));
        const base =
          list.find((p) => p.slug === t.base) ??
          (adults.length ? adults : list).reduce((a, b) => (b.popularity > a.popularity ? b : a));
        const colors = [...new Map(list.flatMap((p) => p.colors).map((c) => [c.key, c])).values()];
        const sizes = [...new Set(list.flatMap((p) => p.sizes))].sort(
          (x, y) => (SIZE_ORDER.indexOf(x) + 1 || 99) - (SIZE_ORDER.indexOf(y) + 1 || 99),
        );
        return [{ cat: t.cat, name: t.name, price: base.price, image: base.images[0]?.src, placeholder: base.placeholder, colors, sizes }];
      }),
    [products],
  );
  const router = useRouter();
  const set = (patch: Partial<Draft>) => setValue((v) => ({ ...v, ...patch }));

  const blank = blanks.find((b) => b.cat === d.product) ?? null;
  const isOwn = d.product === "own";
  const kind = mockupKind(blank?.cat);
  const zones = ZONES[kind];
  const colorHex = blank?.colors.find((c) => c.name === d.color)?.hex ?? "#F4F4F1";
  const chart = blank ? charts[blank.cat] : undefined;
  const adultSizes = blank?.sizes.filter((x) => !isKidSize(x)) ?? [];
  const kidSizes = blank?.sizes.filter(isKidSize) ?? [];
  const total = isOwn ? d.ownQty : Object.values(d.sizes).reduce((a, b) => a + b, 0);
  const method = d.method[0] ?? "dtf";
  const methodLabel = METHODS.find((m) => m.value === method)?.label ?? "";
  const placementText = d.placements.map((p) => zones.find((z) => z.id === p)?.label ?? p).join(", ");
  const preview = files.find((f) => f.preview)?.preview;
  const sizeText = Object.entries(d.sizes)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${s} × ${n}`)
    .join(", ");
  const typeName = blank?.name ?? "";
  const itemText = isOwn ? `Свій виріб: ${d.ownItem.trim()}` : typeName;
  const qtyText = isOwn ? `${d.ownQty} шт.` : `${d.color ?? ""} · ${sizeText}`;

  const pick = (b: Blank) => set({ product: b.cat, color: b.colors[0]?.name ?? null, sizes: {}, placements: [] });

  const togglePlacement = (id: string) =>
    setValue((v) => ({ ...v, placements: v.placements.includes(id) ? v.placements.filter((x) => x !== id) : [...v.placements, id] }));

  const onSubmit = async () => {
    const rec = await submitRequest({
      type: "custom",
      contact: { name: d.name.trim(), phone: d.phone, email: d.email.trim() || undefined, channel: d.channel.join(", ") },
      summary: [
        ["Виріб", itemText],
        ["Колір і розміри", qtyText],
        ["Нанесення", `${methodLabel} · ${placementText}`],
        ["Макет", files.length ? `${files.length} файл(и)` : "Потрібна допомога дизайнера"],
      ],
      files: files.map((f) => ({ name: f.file.name, size: f.file.size })),
    });
    clear();
    router.push(`/request/success?id=${rec.id}`);
  };

  const steps = [
    /* ── 1. Виріб, колір, розміри ── */
    {
      id: "item",
      title: "Виріб і кількість",
      summary: d.product ? `${isOwn ? "Свій виріб" : typeName}${total ? ` · ${total} шт.` : ""}` : null,
      validate: () =>
        !d.product
          ? "Оберіть виріб зі списку або «Свій виріб»"
          : isOwn && d.ownItem.trim().length < 3
            ? "Опишіть ваш виріб"
            : !isOwn && !d.color
              ? "Оберіть колір"
              : total < 1
                ? "Вкажіть кількість хоча б для одного розміру"
                : null,
      content: (
        <>
          <ul role="list" className={own.types}>
            {blanks.map((t) => (
              <li key={t.cat}>
                <label className={own.item}>
                  <input type="radio" name="type" checked={d.product === t.cat} onChange={() => pick(t)} />
                  <span
                    className={own.itemThumb}
                    style={!t.image ? { background: t.placeholder?.bg, color: t.placeholder?.fg } : undefined}
                  >
                    {t.image ? <Image src={t.image} alt="" fill sizes="140px" /> : <Logo variant="mark" title="" className={own.itemMark} />}
                  </span>
                  <span className={own.itemName}>{t.name}</span>
                  <span className={own.itemPrice}>від {formatPrice(t.price)}</span>
                </label>
              </li>
            ))}
            <li>
              <label className={`${own.item} ${own.itemOwn}`}>
                <input type="radio" name="type" checked={isOwn} onChange={() => set({ product: "own", color: null, sizes: {}, placements: [] })} />
                <span className={own.itemThumb}>
                  <span className={own.ownPlus}>+</span>
                </span>
                <span className={own.itemName}>Свій виріб</span>
                <span className={own.itemPrice}>Ваша річ</span>
              </label>
            </li>
          </ul>

          {isOwn && (
            <div className={own.panel}>
              <Field label="Що за річ?" htmlFor="own-item" hint="Тип, тканина, колір — щоб ми оцінили, яка технологія підійде">
                <textarea id="own-item" rows={2} value={d.ownItem} onChange={(e) => set({ ownItem: e.target.value })} placeholder="Напр.: джинсова куртка, синя, бавовна" />
              </Field>
              <Field label="Кількість речей">
                <Qty value={d.ownQty} onChange={(n) => set({ ownQty: Math.max(1, n) })} label="Кількість" />
              </Field>
            </div>
          )}

          {blank && (
            <div className={own.panel}>
              <Field label={`Колір заготовки: ${d.color ?? "не обрано"}`}>
                <div className={own.swatches}>
                  {blank.colors.map((c) => (
                    <label key={c.key} className={own.swatch} title={c.name}>
                      <input type="radio" name="color" checked={d.color === c.name} onChange={() => set({ color: c.name })} />
                      <span style={{ background: c.hex }} aria-hidden="true" />
                      <span className="visually-hidden">{c.name}</span>
                    </label>
                  ))}
                </div>
              </Field>
              <div className={styles.field}>
                <div className={own.sizesHead}>
                  <p className={styles.label}>Розміри й кількість</p>
                  {chart && <SizeChartButton chart={chart} className={own.chartBtn} />}
                </div>
                {[
                  { label: "", list: adultSizes },
                  { label: "Дитячі", list: kidSizes },
                ]
                  .filter((g) => g.list.length)
                  .map((g) => (
                    <div key={g.label || "main"} className={own.sizeGroup}>
                      {g.label && adultSizes.length > 0 && <p className={own.sizeGroupLabel}>{g.label}</p>}
                      <ul role="list" className={own.sizes} data-single={g.list.length === 1 || undefined}>
                        {g.list.map((s) => (
                          <li key={s} data-on={(d.sizes[s] ?? 0) > 0 || undefined}>
                            <span className={own.sizeLabel}>{s}</span>
                            <Qty
                              value={d.sizes[s] ?? 0}
                              onChange={(n) => setValue((v) => ({ ...v, sizes: { ...v.sizes, [s]: n } }))}
                              label={`Кількість, розмір ${s}`}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                <p className={own.total}>
                  Разом: <strong>{total} шт.</strong>
                  {total >= 10 && (
                    <span>
                      {" "}
                      · від 10 шт. вигідніше <Link href="/business">для бізнесу</Link>
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </>
      ),
    },

    /* ── 2. Дизайн і розміщення на мокапі ── */
    {
      id: "design",
      title: "Дизайн і розміщення",
      summary: d.placements.length ? `${methodLabel} · ${placementText}` : null,
      validate: () =>
        d.placements.length === 0
          ? "Оберіть місце нанесення — натисніть на зону на виробі"
          : files.length === 0 && !d.noLayout
            ? "Завантажте макет або позначте, що потрібна допомога"
            : null,
      content: (
        <div className={own.design}>
          <div className={own.mockupCol}>
            <Mockup kind={kind} color={colorHex} selected={d.placements} onToggle={togglePlacement} preview={preview} />
          </div>

          <div className={own.controls}>
            <Field label="Макет" hint={preview ? "Так макет виглядатиме на виробі — точне розміщення погодимо з менеджером" : undefined}>
              <FileUpload files={files} onChange={setFiles} />
            </Field>
            <Check checked={d.noLayout} onChange={(v) => set({ noLayout: v })}>
              Немає готового макета — потрібна допомога з дизайном
            </Check>
            <Field label="Технологія" hint={METHOD_HINT[method]}>
              <Chips label="Технологія" options={METHODS} value={d.method} onChange={(v) => set({ method: v.length ? v : d.method })} />
            </Field>
            <Field label="Коментар" htmlFor="c-comment" optional>
              <textarea
                id="c-comment"
                rows={2}
                value={d.comment}
                onChange={(e) => set({ comment: e.target.value })}
                placeholder="Розмір принта, кольори, побажання"
              />
            </Field>
          </div>
        </div>
      ),
    },

    /* ── 3. Контакти й надсилання ── */
    {
      id: "contacts",
      title: "Контакти й надсилання",
      validate: () =>
        d.name.trim().length < 2
          ? "Вкажіть ім'я"
          : phoneDigits(d.phone).length !== 12
            ? "Телефон у форматі +380 XX XXX XX XX"
            : d.email.trim() && !/^\S+@\S+\.\S+$/.test(d.email.trim())
              ? "Перевірте e-mail"
              : !d.consent
                ? "Потрібна згода на обробку даних"
                : null,
      content: (
        <>
          <div className={own.summary}>
            <dl className={styles.review}>
              <div>
                <dt>Виріб</dt>
                <dd>{itemText}</dd>
              </div>
              <div>
                <dt>Колір і кількість</dt>
                <dd>
                  {qtyText} {!isOwn && `(разом ${total} шт.)`}
                </dd>
              </div>
              <div>
                <dt>Нанесення</dt>
                <dd>
                  {methodLabel}
                  <span className={own.tags}>
                    {d.placements.map((p) => (
                      <span key={p}>{zones.find((z) => z.id === p)?.label ?? p}</span>
                    ))}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Макет</dt>
                <dd>{files.length ? files.map((f) => f.file.name).join(", ") : "Потрібна допомога дизайнера"}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.grid2}>
            <Field label="Ім'я" htmlFor="c-name">
              <input id="c-name" autoComplete="name" value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="Як до вас звертатися" />
            </Field>
            <Field label="Телефон" htmlFor="c-phone">
              <input
                id="c-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={d.phone}
                onChange={(e) => set({ phone: formatPhone(e.target.value) })}
                placeholder="+380 XX XXX XX XX"
              />
            </Field>
            <Field label="E-mail" htmlFor="c-email" optional>
              <input
                id="c-email"
                type="email"
                autoComplete="email"
                value={d.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="name@example.com"
              />
            </Field>
            <Field label="Як зручніше зв'язатися">
              <Chips label="Спосіб зв'язку" options={CHANNELS} value={d.channel} onChange={(v) => set({ channel: v })} multiple />
            </Field>
          </div>
          <Check checked={d.consent} onChange={(v) => set({ consent: v })}>
            Погоджуюсь з <Link href="/info/privacy">політикою конфіденційності</Link>
          </Check>
          <p className={own.next}>
            <strong>Що буде далі.</strong> Менеджер перевірить макет, надішле візуалізацію й точну ціну. Оплата — лише після
            погодження.
          </p>
        </>
      ),
    },
  ];

  return (
    <Wizard
      steps={steps}
      onSubmit={onSubmit}
      restored={restored}
      onReset={clear}
      aside={
        <p className={own.asideNote}>
          <Logo variant="mark" title="" className={own.asideMark} />
          Відповімо протягом робочого дня. Оплата — після погодження макета й ціни.
        </p>
      }
    />
  );
}
