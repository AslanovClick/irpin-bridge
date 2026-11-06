"use client";

/*
 * Заявки (кастомізація, бізнес-мерч, послуги, зворотний дзвінок, співпраця з митцями).
 * ДЕМО: «надсилання» — затримка + збереження в sessionStorage для сторінки успіху.
 * З бекендом: POST /api/requests (multipart з файлами) → CRM (KeyCRM), відповідь — номер заявки.
 */
import { useEffect, useRef, useState } from "react";
import { track } from "./analytics";

export type RequestType = "custom" | "business" | "service" | "callback" | "artist" | "quick";

export type RequestRecord = {
  id: string;
  type: RequestType;
  createdAt: string;
  contact: { name: string; phone?: string; email?: string; channel?: string };
  /** Короткий підсумок для сторінки успіху: [підпис, значення] */
  summary: [string, string][];
  files: { name: string; size: number }[];
};

const KEY = "ib-last-request";

export const REQUEST_LABEL: Record<RequestType, string> = {
  custom: "Заявка на кастомізацію",
  business: "Заявка на бізнес-мерч",
  service: "Заявка на послугу",
  callback: "Зворотний дзвінок",
  artist: "Заявка на співпрацю",
  quick: "Заявка на прорахунок",
};

export async function submitRequest(record: Omit<RequestRecord, "id" | "createdAt">): Promise<RequestRecord> {
  const full: RequestRecord = {
    ...record,
    id: `ZV-${String(Date.now()).slice(-6)}`,
    createdAt: new Date().toISOString(),
  };
  await new Promise((r) => setTimeout(r, 900));
  track({ name: "generate_lead", lead_type: full.type });
  try {
    sessionStorage.setItem(KEY, JSON.stringify(full));
  } catch {
    /* без сховища — сторінка успіху покаже лише номер */
  }
  return full;
}

export function readRequest(id: string | null): RequestRecord | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as RequestRecord;
    return !id || r.id === id ? r : null;
  } catch {
    return null;
  }
}

/**
 * Чернетка форми в localStorage: переживає перезавантаження сторінки.
 * Файли в чернетку не потрапляють (їх не можна серіалізувати).
 */
export function useDraft<T extends object>(key: string, initial: T) {
  const storageKey = `ib-draft-${key}`;
  const [value, setValue] = useState<T>(initial);
  const [restored, setRestored] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- відновлюємо чернетку лише на клієнті
        setValue({ ...initial, ...(JSON.parse(raw) as T) });
        setRestored(true);
      }
    } catch {
      /* пошкоджена чернетка — починаємо з нуля */
    }
  }, [storageKey, initial]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      // Порожня (початкова) форма — не чернетка: прибираємо, щоб не показувати «відновлено»
      if (value === initial) localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* немає доступу до сховища */
    }
  }, [storageKey, value, initial]);

  const clear = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setValue(initial);
    setRestored(false);
  };

  return { value, setValue, restored, clear };
}

/** Відкриття модальних форм з будь-якого місця */
export const MODAL_EVENT = "ib:request-modal";
export type ModalKind = "callback" | "artist";
export const openRequestModal = (kind: ModalKind) =>
  window.dispatchEvent(new CustomEvent<ModalKind>(MODAL_EVENT, { detail: kind }));

export const formatSize = (b: number) =>
  b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} КБ` : `${(b / 1024 / 1024).toFixed(1)} МБ`;
