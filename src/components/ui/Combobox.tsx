"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";
import styles from "./Combobox.module.css";

export type ComboOption = { value: string; label: string; hint?: string };

type Props = {
  label: string;
  options: ComboOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  /** Скільки варіантів показувати */
  limit?: number;
  emptyText?: string;
};

/** Поле з пошуком по списку (патерн combobox) — для міста й відділення */
export function Combobox({ label, options, value, onChange, placeholder, disabled, error, limit = 8, emptyText = "Нічого не знайдено" }: Props) {
  const id = useId();
  const selected = options.find((o) => o.value === value) ?? null;
  const [text, setText] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const [lastValue, setLastValue] = useState(value);

  // Значення змінили ззовні (напр. скинули місто) — синхронізуємо текст
  if (value !== lastValue) {
    setLastValue(value);
    setText(options.find((o) => o.value === value)?.label ?? "");
  }

  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase();
    const list = !q || (selected && text === selected.label) ? options : options.filter((o) => `${o.label} ${o.hint ?? ""}`.toLowerCase().includes(q));
    return list.slice(0, limit);
  }, [options, text, selected, limit]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (root.current?.contains(e.target as Node)) return;
      setOpen(false);
      setText(selected?.label ?? "");
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, selected]);

  const choose = (o: ComboOption) => {
    onChange(o.value);
    setText(o.label);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && open && filtered[active]) {
      e.preventDefault();
      choose(filtered[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setText(selected?.label ?? "");
    }
  };

  return (
    <div ref={root} className={styles.root}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.control} data-invalid={Boolean(error) || undefined} data-disabled={disabled || undefined}>
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${id}-o-${active}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(0);
            if (selected) onChange(null);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
        />
        <Icon name="chevron" size={18} className={styles.chevron} />
      </div>
      {open && !disabled && (
        <ul id={`${id}-list`} role="listbox" className={styles.list} aria-label={label}>
          {filtered.length === 0 ? (
            <li className={styles.empty}>{emptyText}</li>
          ) : (
            filtered.map((o, i) => (
              <li
                key={o.value}
                id={`${id}-o-${i}`}
                role="option"
                aria-selected={o.value === value}
                data-active={i === active || undefined}
                className={styles.option}
                onPointerEnter={() => setActive(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(o)}
              >
                <span>{o.label}</span>
                {o.hint && <span className={styles.hint}>{o.hint}</span>}
              </li>
            ))
          )}
        </ul>
      )}
      {error && (
        <p id={`${id}-err`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
