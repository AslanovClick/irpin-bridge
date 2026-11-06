"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "./Mockup.module.css";

export type MockupKind = "tee" | "hoodie" | "sweat" | "tote" | "cap" | "pants";
type View = "front" | "back";

/** Зона нанесення в одиницях поля 240 × 240 (як у SVG-силуету) */
export type Zone = { id: string; label: string; view: View; x: number; y: number; w: number; h: number };

const SIZE = 240;

/* Футболка й світшот мають однакову посадку на корпусі; рукав — свій для кожного силуету */
const chestLeft = (y: number): Zone => ({ id: "chest-left", label: "Груди ліворуч", view: "front", x: 136, y, w: 26, h: 20 });

export const ZONES: Record<MockupKind, Zone[]> = {
  tee: [
    chestLeft(52),
    { id: "chest", label: "Груди по центру", view: "front", x: 88, y: 76, w: 64, h: 70 },
    { id: "sleeve", label: "Рукав", view: "front", x: 34, y: 66, w: 22, h: 18 },
    { id: "back", label: "Спина", view: "back", x: 80, y: 58, w: 80, h: 92 },
  ],
  sweat: [
    chestLeft(54),
    { id: "chest", label: "Груди по центру", view: "front", x: 88, y: 78, w: 64, h: 68 },
    { id: "sleeve", label: "Рукав", view: "front", x: 33, y: 100, w: 22, h: 22 },
    { id: "back", label: "Спина", view: "back", x: 80, y: 60, w: 80, h: 92 },
  ],
  hoodie: [
    chestLeft(70),
    { id: "chest", label: "Груди по центру", view: "front", x: 90, y: 98, w: 60, h: 46 },
    { id: "sleeve", label: "Рукав", view: "front", x: 31, y: 108, w: 22, h: 22 },
    { id: "back", label: "Спина", view: "back", x: 80, y: 74, w: 80, h: 90 },
  ],
  tote: [
    { id: "front", label: "Спереду", view: "front", x: 78, y: 116, w: 84, h: 88 },
    { id: "back", label: "Ззаду", view: "back", x: 78, y: 116, w: 84, h: 88 },
  ],
  cap: [{ id: "front", label: "Спереду", view: "front", x: 98, y: 92, w: 44, h: 32 }],
  pants: [
    { id: "thigh", label: "Стегно", view: "front", x: 138, y: 64, w: 26, h: 26 },
    { id: "back", label: "Ззаду, кишеня", view: "back", x: 80, y: 52, w: 30, h: 24 },
  ],
};

/**
 * Силует: body — контур, inner — внутрішня частина (горловина, капюшон) темнішим тоном,
 * details — шви й резинки пунктиром, folds — м'які складки тканини.
 */
type Shape = { body: string; inner?: string; details: string; folds?: string };

/* Спільні частини футболки */
const TEE_BODY = "C192 50 206 64 218 84L194 104 178 90 180 204Q120 210 60 204L62 90 46 104 22 84C34 64 48 50 64 42Z";
const TEE_DETAILS = "M176 42C170 60 172 78 178 90M64 42C70 60 68 78 62 90M212 80 191 98M28 80l21 18M62 196q58 6 116 0";
const TEE_FOLDS = "M72 124q4 30 0 64M168 122q-5 34-1 68";

/* Спільні частини світшота */
const SWEAT_BODY =
  "C190 48 198 60 202 76L216 176 214 190 192 192 188 178 176 104 178 192 180 204H60L62 192 64 104 52 178 48 192 26 190 24 176 38 76C42 60 50 48 64 42Z";
const SWEAT_DETAILS = "M176 42C172 62 172 84 176 100M64 42C68 62 68 84 64 100M190 180l25-2M50 180l-25-2M62 192H178";
const SWEAT_FOLDS = "M200 110q4 24 8 50M40 110q-4 24-8 50M74 130q3 30 0 52M166 130q-3 30 0 52";

/* Спільні частини худі (корпус від плечей донизу) */
const HOODIE_BODY =
  "L180 52C194 58 202 70 206 86L218 182 216 196 194 198 190 184 178 112 180 196 182 210H58L60 196 62 112 50 184 46 198 24 196 22 182 34 86C38 70 46 58 60 52Z";
const HOODIE_DETAILS = "M180 52C176 72 176 92 178 108M60 52C64 72 64 92 62 108M192 186l25-2M48 186l-25-2M60 196H180";

const SHAPES: Record<MockupKind, Partial<Record<View, Shape>>> = {
  tee: {
    front: {
      body: `M98 30C106 46 134 46 142 30L176 42${TEE_BODY}`,
      inner: "M98 30C106 46 134 46 142 30C132 35 108 35 98 30Z",
      details: `M95 31C103 52 137 52 145 31${TEE_DETAILS}`,
      folds: TEE_FOLDS,
    },
    back: {
      body: `M98 30C108 36 132 36 142 30L176 42${TEE_BODY}`,
      details: `M96 31C106 41 134 41 144 31${TEE_DETAILS}`,
      folds: TEE_FOLDS,
    },
  },
  sweat: {
    front: {
      body: `M98 30C106 44 134 44 142 30L176 42${SWEAT_BODY}`,
      inner: "M98 30C106 44 134 44 142 30C132 35 108 35 98 30Z",
      details: `M95 31C103 50 137 50 145 31${SWEAT_DETAILS}`,
      folds: SWEAT_FOLDS,
    },
    back: {
      body: `M98 30C108 36 132 36 142 30L176 42${SWEAT_BODY}`,
      details: `M96 31C106 41 134 41 144 31${SWEAT_DETAILS}`,
      folds: SWEAT_FOLDS,
    },
  },
  hoodie: {
    front: {
      body: `M86 46C80 16 100 4 120 4S160 16 154 46${HOODIE_BODY}`,
      inner: "M94 46C96 22 144 22 146 46C140 60 128 68 120 72C112 68 100 60 94 46Z",
      details: `M110 66l-2 26M130 66l2 26M80 150H160L170 190H70ZM90 152l-8 36M150 152l8 36${HOODIE_DETAILS}`,
      folds: "M200 120q4 24 8 50M40 120q-4 24-8 50",
    },
    back: {
      body: `M84 52C76 14 100 2 120 2S164 14 156 52${HOODIE_BODY}`,
      details: `M84 52C100 64 140 64 156 52M120 4V60${HOODIE_DETAILS}`,
      folds: "M200 120q4 24 8 50M40 120q-4 24-8 50M76 170q3 14 0 22M164 170q-3 14 0 22",
    },
  },
  tote: {
    front: {
      body: "M52 86H188L192 226H48ZM84 86V60C84 24 156 24 156 60V86H146V60C146 36 94 36 94 60V86Z",
      details: "M51 98H189M84 86v16M94 86v16M146 86v16M156 86v16",
      folds: "M70 110q-4 50 2 104M172 110q4 50-2 104",
    },
    back: {
      body: "M52 86H188L192 226H48ZM84 86V60C84 24 156 24 156 60V86H146V60C146 36 94 36 94 60V86Z",
      details: "M51 98H189M84 86v16M94 86v16M146 86v16M156 86v16",
      folds: "M70 110q-4 50 2 104M172 110q4 50-2 104",
    },
  },
  cap: {
    front: {
      body: "M56 150C52 98 82 62 120 62S188 98 184 150C160 160 80 160 56 150ZM50 150C80 166 160 166 190 150 198 166 176 190 120 192S42 166 50 150Z",
      inner: "M50 150C80 166 160 166 190 150 184 160 166 168 120 169S56 160 50 150Z",
      details: "M120 62V156M96 68C82 92 78 120 80 154M144 68C158 92 162 120 160 154M60 166C90 182 150 182 180 166M114 63Q120 56 126 63",
      folds: "M70 124q6-30 22-46",
    },
  },
  pants: {
    front: {
      body: "M72 20H168L174 62 172 228H132L120 102 108 228H68L66 62Z",
      details: "M72 34H168M114 34l-4 18M126 34l4 18M68 48C80 50 88 60 90 74M172 48C160 50 152 60 150 74M120 34V100M70 214H108M132 214H172",
      folds: "M88 130q4 40 0 80M152 130q-4 40 0 80",
    },
    back: {
      body: "M72 20H168L174 62 172 228H132L120 102 108 228H68L66 62Z",
      details: "M72 34H168M120 34V102M80 52H110V76H80ZM130 52H160V76H130ZM70 214H108M132 214H172",
      folds: "M88 130q4 40 0 80M152 130q-4 40 0 80",
    },
  },
};

/** Висота тіні під виробом — трохи нижче низу силуету */
const GROUND: Record<MockupKind, number> = { tee: 214, sweat: 212, hoodie: 218, tote: 232, cap: 198, pants: 234 };

const VIEW_LABEL: Record<View, string> = { front: "Спереду", back: "Ззаду" };

const pct = (n: number) => `${(n / SIZE) * 100}%`;

type Props = {
  kind: MockupKind;
  color: string;
  selected: string[];
  onToggle: (zoneId: string) => void;
  /** Прев'ю першого завантаженого зображення */
  preview?: string;
};

/** Мокап виробу: вкладки «Спереду / Ззаду», клік по зоні або по чипу — обрати місце, дизайн одразу видно на виробі */
export function Mockup({ kind, color, selected, onToggle, preview }: Props) {
  const uid = useId().replace(/:/g, "");
  const views = (["front", "back"] as View[]).filter((v) => SHAPES[kind][v]);
  const [picked, setPicked] = useState<View>("front");
  const view = views.includes(picked) ? picked : views[0];
  const shape = SHAPES[kind][view]!;
  const light = isLight(color);
  const zones = ZONES[kind];
  const ink = light ? "17 17 17" : "255 255 255";

  const toggleChip = (z: Zone) => {
    setPicked(z.view);
    onToggle(z.id);
  };

  return (
    <div className={styles.wrap}>
      {views.length > 1 && (
        <div className={styles.tabs} role="tablist" aria-label="Сторона виробу">
          {views.map((v) => {
            const count = zones.filter((z) => z.view === v && selected.includes(z.id)).length;
            return (
              <button key={v} type="button" role="tab" aria-selected={v === view} className={styles.tab} onClick={() => setPicked(v)}>
                {VIEW_LABEL[v]}
                {count > 0 && <span className={styles.tabCount}>{count}</span>}
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.stage} role={views.length > 1 ? "tabpanel" : undefined} aria-label={VIEW_LABEL[view]}>
        <div className={styles.canvas}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg} aria-hidden="true">
            <defs>
              {/* Світло зліва згори, тінь справа знизу — дає об'єм без фотореалізму */}
              <linearGradient id={`shade-${uid}`} x1="0" y1="0" x2="1" y2="0.6">
                <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.14" />
              </linearGradient>
            </defs>
            <ellipse cx="120" cy={GROUND[kind]} rx="70" ry="5" className={styles.ground} />
            <path d={shape.body} fill={color} className={styles.body} />
            {shape.inner && <path d={shape.inner} fill={`rgb(0 0 0 / ${light ? 0.08 : 0.22})`} />}
            <path d={shape.body} fill={`url(#shade-${uid})`} />
            {shape.folds && (
              <path d={shape.folds} fill="none" stroke={`rgb(${ink} / ${light ? 0.06 : 0.045})`} strokeWidth="6" strokeLinecap="round" />
            )}
            <path
              d={shape.details}
              fill="none"
              stroke={`rgb(${ink} / 0.26)`}
              strokeWidth="1.1"
              strokeDasharray="3 2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d={shape.body} fill="none" stroke="rgb(17 17 17 / 0.55)" strokeWidth="1.4" strokeLinejoin="round" />
            {shape.inner && <path d={shape.inner} fill="none" stroke="rgb(17 17 17 / 0.4)" strokeWidth="1.1" strokeLinejoin="round" />}
          </svg>
          {zones
            .filter((z) => z.view === view)
            .map((z) => {
              const on = selected.includes(z.id);
              return (
                <button
                  key={z.id}
                  type="button"
                  className={styles.zone}
                  data-on={on || undefined}
                  data-light={light || undefined}
                  style={{ left: pct(z.x), top: pct(z.y), width: pct(z.w), height: pct(z.h) }}
                  aria-pressed={on}
                  aria-label={`${z.label}${on ? " — обрано" : ""}`}
                  title={z.label}
                  onClick={() => onToggle(z.id)}
                >
                  {on ? (
                    preview ? (
                      // eslint-disable-next-line @next/next/no-img-element -- локальне прев'ю (blob:) завантаженого файлу
                      <img src={preview} alt="" />
                    ) : (
                      <span className={styles.design}>
                        <Logo variant="mark" title="" />
                      </span>
                    )
                  ) : (
                    <span className={styles.plus}>+</span>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      <div className={styles.chips}>
        <p className={styles.chipsLabel}>Місця нанесення — можна кілька:</p>
        <ul role="list">
          {zones.map((z) => {
            const on = selected.includes(z.id);
            return (
              <li key={z.id}>
                <button type="button" className={styles.chip} aria-pressed={on} onClick={() => toggleChip(z)}>
                  <span className={styles.chipBox} aria-hidden="true">
                    {on && <Icon name="check" size={14} />}
                  </span>
                  {z.label}
                  {views.length > 1 && kind !== "tote" && <span className={styles.chipView}>{VIEW_LABEL[z.view].toLowerCase()}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function isLight(hex: string) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return true;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

export function mockupKind(category: string | undefined): MockupKind {
  switch (category) {
    case "khudi":
      return "hoodie";
    case "svitshoty":
      return "sweat";
    case "shopery":
      return "tote";
    case "aksesuary":
      return "cap";
    case "shtany":
      return "pants";
    default:
      return "tee";
  }
}
