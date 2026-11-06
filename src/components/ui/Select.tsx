"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";
import styles from "./Select.module.css";

type Option<T extends string> = { value: T; label: string; hint?: string };

type Props<T extends string> = {
  value: T;
  options: readonly Option<T>[];
  onChange?: (value: T) => void;
  /** Підпис для скрінрідерів, напр. «Сортування» */
  label: string;
  /** Видимий префікс у кнопці, напр. «Сортувати:» */
  prefix?: string;
  className?: string;
};

/** Випадний список у стилі сайту (патерн listbox, з клавіатурою) */
export function Select<T extends string>({ value, options, onChange, label, prefix, className }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const current = options.find((o) => o.value === value) ?? options[0];

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (i: number) => {
    onChange?.(options[i].value);
    setOpen(false);
    button.current?.focus();
  };

  // Фокус у список при відкритті; закриття по кліку поза ним
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onButtonKey = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  };

  const onListKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") setActive((i) => Math.min(options.length - 1, i + 1));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape") {
      setOpen(false);
      button.current?.focus();
    } else if (e.key === "Tab") setOpen(false);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className={[styles.root, className].filter(Boolean).join(" ")}>
      <button
        ref={button}
        type="button"
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${current.label}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onButtonKey}
      >
        <span className={styles.value}>
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          {current.label}
          {current.hint && <span className={styles.buttonHint}>{current.hint}</span>}
        </span>
        <Icon name="chevron" size={18} className={styles.chevron} />
      </button>

      <ul
        ref={list}
        id={`${id}-list`}
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        className={styles.list}
        hidden={!open}
        onKeyDown={onListKey}
      >
        {options.map((o, i) => (
          <li
            key={o.value}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={o.value === value}
            data-active={i === active || undefined}
            className={styles.option}
            onPointerEnter={() => setActive(i)}
            onClick={() => choose(i)}
          >
            <span className={styles.optionText}>
              {o.label}
              {o.hint && <span className={styles.optionHint}>{o.hint}</span>}
            </span>
            {o.value === value && <Icon name="check" size={16} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
