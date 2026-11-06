"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { FLAGS, type Facets, type FilterState, type FlagKey } from "@/lib/filters";
import { Icon } from "@/components/ui/Icon";
import styles from "./Catalog.module.css";

type Props = {
  value: FilterState;
  facets: Facets;
  onChange?: (next: FilterState) => void;
  idPrefix: string;
};

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function FilterPanel({ value, facets, onChange, idPrefix }: Props) {
  const set = (patch: Partial<FilterState>) => onChange?.({ ...value, ...patch });
  const sizeCount = value.sizes.length;
  const priceSet = value.min !== undefined || value.max !== undefined;

  return (
    <div className={styles.panel}>
      {facets.sizeGroups.length > 0 && (
        <Group title="Розмір" count={sizeCount}>
          <div className={styles.sizeGroups}>
            {facets.sizeGroups.map((g) => (
              <div key={g.label}>
                {facets.sizeGroups.length > 1 && <p className={styles.sizeGroupLabel}>{g.label}</p>}
                <div className={styles.sizes}>
                  {g.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={styles.size}
                      aria-pressed={value.sizes.includes(s)}
                      onClick={() => set({ sizes: toggle(value.sizes, s) })}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Group>
      )}

      {facets.colors.length > 1 && (
        <Group title="Колір" count={value.colors.length}>
          <div className={styles.colors}>
            {facets.colors.map((c) => (
              <button
                key={c.key}
                type="button"
                className={styles.color}
                aria-pressed={value.colors.includes(c.key)}
                onClick={() => set({ colors: toggle(value.colors, c.key) })}
                title={c.name}
              >
                <span className={styles.colorDot} style={{ background: c.hex }} aria-hidden="true" />
                <span className="visually-hidden">{c.name}</span>
              </button>
            ))}
          </div>
        </Group>
      )}

      {facets.priceMax > facets.priceMin && (
        <Group title="Ціна, ₴" count={priceSet ? 1 : 0}>
          <PriceRange
            key={`${value.min ?? ""}-${value.max ?? ""}`}
            idPrefix={idPrefix}
            floor={facets.priceMin}
            ceil={facets.priceMax}
            min={value.min}
            max={value.max}
            onCommit={(min, max) => set({ min, max })}
          />
        </Group>
      )}

      <div className={styles.flags}>
        {FLAGS.map((f) => (
          <label key={f.key} className={styles.check}>
            <input
              type="checkbox"
              checked={value.flags.includes(f.key)}
              onChange={() => set({ flags: toggle<FlagKey>(value.flags, f.key) })}
            />
            <span className={styles.box} aria-hidden="true">
              <Icon name="check" size={14} />
            </span>
            {f.label}
          </label>
        ))}
      </div>
    </div>
  );
}

/** Група, що згортається */
function Group({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <details className={styles.group} open>
      <summary className={styles.groupTitle}>
        <span>
          {title}
          {count > 0 && <span className={styles.groupCount}>{count}</span>}
        </span>
        <Icon name="chevron" size={18} className={styles.groupChevron} />
      </summary>
      <div className={styles.groupBody}>{children}</div>
    </details>
  );
}

/** Ціна: подвійний повзунок + поля вводу. Застосовується, коли відпустили повзунок або вийшли з поля. */
function PriceRange({
  idPrefix,
  floor,
  ceil,
  min,
  max,
  onCommit,
}: {
  idPrefix: string;
  floor: number;
  ceil: number;
  min?: number;
  max?: number;
  onCommit: (min?: number, max?: number) => void;
}) {
  const [lo, setLo] = useState(min ?? floor);
  const [hi, setHi] = useState(max ?? ceil);
  const [loText, setLoText] = useState(String(min ?? floor));
  const [hiText, setHiText] = useState(String(max ?? ceil));
  const step = 10;

  const commit = (a = lo, b = hi) => {
    const nextMin = a <= floor ? undefined : a;
    const nextMax = b >= ceil ? undefined : b;
    if (nextMin !== min || nextMax !== max) onCommit(nextMin, nextMax);
  };

  const setRange = (a: number, b: number) => {
    setLo(a);
    setHi(b);
    setLoText(String(a));
    setHiText(String(b));
  };

  const pct = (v: number) => ((v - floor) / (ceil - floor)) * 100;
  const fill = { "--from": `${pct(lo)}%`, "--to": `${pct(hi)}%` } as CSSProperties;

  const fromText = (t: string, which: "lo" | "hi") => {
    const n = Number(t);
    if (!Number.isFinite(n) || t === "") return setRange(lo, hi);
    if (which === "lo") {
      const a = Math.min(Math.max(floor, n), hi);
      setRange(a, hi);
      commit(a, hi);
    } else {
      const b = Math.max(Math.min(ceil, n), lo);
      setRange(lo, b);
      commit(lo, b);
    }
  };

  return (
    <div className={styles.price}>
      <div className={styles.range} style={fill}>
        <input
          type="range"
          min={floor}
          max={ceil}
          step={step}
          value={lo}
          aria-label="Мінімальна ціна"
          onChange={(e) => setRange(Math.min(Number(e.target.value), hi - step), hi)}
          onPointerUp={() => commit()}
          onKeyUp={() => commit()}
        />
        <input
          type="range"
          min={floor}
          max={ceil}
          step={step}
          value={hi}
          aria-label="Максимальна ціна"
          onChange={(e) => setRange(lo, Math.max(Number(e.target.value), lo + step))}
          onPointerUp={() => commit()}
          onKeyUp={() => commit()}
        />
      </div>

      <div className={styles.priceInputs}>
        <label htmlFor={`${idPrefix}-min`}>
          <span>від</span>
          <input
            id={`${idPrefix}-min`}
            placeholder={String(floor)}
            inputMode="numeric"
            value={loText}
            onChange={(e) => setLoText(e.target.value.replace(/\D/g, ""))}
            onBlur={() => fromText(loText, "lo")}
            onKeyDown={(e) => e.key === "Enter" && fromText(loText, "lo")}
          />
        </label>
        <span aria-hidden="true">—</span>
        <label htmlFor={`${idPrefix}-max`}>
          <span>до</span>
          <input
            id={`${idPrefix}-max`}
            placeholder={String(ceil)}
            inputMode="numeric"
            value={hiText}
            onChange={(e) => setHiText(e.target.value.replace(/\D/g, ""))}
            onBlur={() => fromText(hiText, "hi")}
            onKeyDown={(e) => e.key === "Enter" && fromText(hiText, "hi")}
          />
        </label>
      </div>
    </div>
  );
}
