"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { formatSize } from "@/lib/requests";
import { Icon, type IconName } from "@/components/ui/Icon";
import styles from "./Forms.module.css";

/* ── Поле з підписом, підказкою й помилкою ── */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")} data-invalid={Boolean(error) || undefined}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={styles.label}>
          {label} {optional && <span className={styles.optional}>необов&apos;язково</span>}
        </label>
      ) : (
        <p className={styles.label}>
          {label} {optional && <span className={styles.optional}>необов&apos;язково</span>}
        </p>
      )}
      {children}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        hint && <p className={styles.hint}>{hint}</p>
      )}
    </div>
  );
}

/* ── Чіпи: один або кілька варіантів ── */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  multiple = false,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T[];
  onChange: (v: T[]) => void;
  multiple?: boolean;
  label: string;
}) {
  return (
    <div className={styles.chips} role="group" aria-label={label}>
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            className={styles.chip}
            aria-pressed={on}
            onClick={() =>
              onChange(multiple ? (on ? value.filter((v) => v !== o.value) : [...value, o.value]) : [o.value])
            }
          >
            {multiple && on && <Icon name="check" size={14} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Картки вибору (радіо) ── */
export function ChoiceCards<T extends string>({
  name,
  options,
  value,
  onChange,
  columns = 3,
}: {
  name: string;
  options: readonly { value: T; title: string; text?: string; icon?: IconName }[];
  value: T | null;
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <div className={styles.cards} style={{ "--cols": columns } as CSSProperties}>
      {options.map((o) => (
        <label key={o.value} className={styles.card}>
          <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} />
          {o.icon && <Icon name={o.icon} size={24} className={styles.cardIcon} />}
          <strong>{o.title}</strong>
          {o.text && <span>{o.text}</span>}
        </label>
      ))}
    </div>
  );
}

/* ── Чекбокс ── */
export function Check({
  checked,
  onChange,
  children,
  invalid,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  invalid?: boolean;
}) {
  return (
    <label className={styles.check}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={invalid} />
      <span className={styles.box} aria-hidden="true">
        <Icon name="check" size={14} />
      </span>
      <span>{children}</span>
    </label>
  );
}

/* ── Лічильник кількості ── */
export function Qty({ value, onChange, label, max = 9999 }: { value: number; onChange: (v: number) => void; label: string; max?: number }) {
  return (
    <div className={styles.qty} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0} aria-label="Менше">
        −
      </button>
      <input
        data-qty=""
        inputMode="numeric"
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Math.min(max, Number(e.target.value.replace(/\D/g, "") || 0)))}
      />
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Більше">
        +
      </button>
    </div>
  );
}

/* ── Завантаження файлів ── */
export type UploadFile = { id: string; file: File; progress: number; preview?: string };

const ACCEPT = [".png", ".jpg", ".jpeg", ".pdf", ".svg", ".ai", ".eps", ".psd", ".tif", ".tiff", ".cdr", ".zip"];
const MAX_MB = 50;
const MAX_FILES = 10;

export function FileUpload({
  files,
  onChange,
  hint = "PNG, JPG, PDF, SVG, AI, EPS, PSD, TIFF, CDR або ZIP — до 50 МБ кожен",
  compact,
}: {
  files: UploadFile[];
  onChange: (next: UploadFile[] | ((prev: UploadFile[]) => UploadFile[])) => void;
  hint?: string;
  /** Низька версія в один рядок — для щільних форм */
  compact?: boolean;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ДЕМО: імітуємо завантаження; з бекендом — реальний прогрес через XHR/fetch
  useEffect(() => {
    if (!files.some((f) => f.progress < 100)) return;
    const t = setInterval(() => {
      onChange((prev) => prev.map((f) => (f.progress < 100 ? { ...f, progress: Math.min(100, f.progress + 18) } : f)));
    }, 160);
    return () => clearInterval(t);
  }, [files, onChange]);

  // Звільняємо прев'ю при видаленні
  useEffect(() => () => files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const add = (list: FileList | null) => {
    if (!list) return;
    const errors: string[] = [];
    const next: UploadFile[] = [];
    [...list].forEach((file) => {
      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!ACCEPT.includes(ext)) errors.push(`${file.name}: формат не підтримується`);
      else if (file.size > MAX_MB * 1024 * 1024) errors.push(`${file.name}: більше ${MAX_MB} МБ`);
      else
        next.push({
          id: `${file.name}-${file.size}-${Math.round(Math.random() * 1e6)}`,
          file,
          progress: 0,
          preview: file.type.startsWith("image/") && file.type !== "image/tiff" ? URL.createObjectURL(file) : undefined,
        });
    });
    const room = MAX_FILES - files.length;
    if (next.length > room) errors.push(`Можна додати до ${MAX_FILES} файлів`);
    setError(errors.length ? errors.join(". ") : null);
    if (next.length) onChange((prev) => [...prev, ...next.slice(0, Math.max(0, room))]);
  };

  const remove = (fid: string) =>
    onChange((prev) => {
      const f = prev.find((x) => x.id === fid);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== fid);
    });

  return (
    <div className={styles.upload}>
      <label
        htmlFor={id}
        className={styles.drop}
        data-drag={drag || undefined}
        data-compact={compact || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
      >
        <span className={styles.dropIcon}>
          <Icon name="upload" size={24} />
        </span>
        <span className={styles.dropText}>
          <span className={styles.dropTitle}>
            {compact ? (
              <>
                <u>Оберіть файл</u> або перетягніть сюди
              </>
            ) : (
              <>
                Перетягніть файли сюди або <u>оберіть на пристрої</u>
              </>
            )}
          </span>
          <span className={styles.dropHint}>{hint}</span>
        </span>
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept={ACCEPT.join(",")}
          className="visually-hidden"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul role="list" className={styles.files} aria-label="Завантажені файли">
          {files.map((f) => (
            <li key={f.id} className={styles.file}>
              <span className={styles.fileThumb}>
                {f.preview ? (
                  <Image src={f.preview} alt="" fill sizes="48px" unoptimized />
                ) : (
                  <span>{f.file.name.split(".").pop()?.toUpperCase()}</span>
                )}
              </span>
              <span className={styles.fileInfo}>
                <span className={styles.fileName}>{f.file.name}</span>
                <span className={styles.fileMeta}>
                  {formatSize(f.file.size)} · {f.progress < 100 ? `завантаження ${f.progress}%` : "готово"}
                </span>
                <span className={styles.bar} aria-hidden="true">
                  <span style={{ width: `${f.progress}%` }} />
                </span>
              </span>
              <button type="button" className={styles.fileRemove} onClick={() => remove(f.id)} aria-label={`Видалити ${f.file.name}`}>
                <Icon name="close" size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
