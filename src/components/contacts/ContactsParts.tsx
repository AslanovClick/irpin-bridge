"use client";

import { useState, useSyncExternalStore } from "react";
import { SCHEDULE } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import styles from "./Contacts.module.css";

const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

/** Час у Києві (хвилини від півночі) і день тижня — на клієнті; на сервері null */
function kyivNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return `${day}:${Number(get("hour")) * 60 + Number(get("minute"))}`;
}

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

/** «Зараз відчинено / зачинено» — показуємо лише після гідратації */
export function OpenNow() {
  const now = useSyncExternalStore(subscribe, kyivNow, () => null);
  if (!now) return null;
  const [day, min] = now.split(":").map(Number);
  const today = SCHEDULE.find((s) => s.idx.includes(day));
  const open = Boolean(today?.from && today.to && min >= toMin(today.from) && min < toMin(today.to));
  return (
    <span className={styles.openNow} data-open={open || undefined}>
      <span aria-hidden="true" />
      {open ? `Зараз відчинено до ${today?.to}` : "Зараз зачинено"}
    </span>
  );
}

export function TodayMark({ idx }: { idx: number[] }) {
  const now = useSyncExternalStore(subscribe, kyivNow, () => null);
  if (!now || !idx.includes(Number(now.split(":")[0]))) return null;
  return <span className={styles.today}>сьогодні</span>;
}

/** Карта завантажується лише після кліку — не гальмує сторінку й не ставить сторонні cookies без дії користувача */
export function MapEmbed({ address }: { address: string }) {
  const [on, setOn] = useState(false);
  const q = encodeURIComponent(address);
  return (
    <div className={styles.map}>
      {on ? (
        <iframe
          title={`Карта: ${address}`}
          src={`https://www.google.com/maps?q=${q}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.mapCover} onClick={() => setOn(true)}>
          <span className={styles.mapGrid} aria-hidden="true" />
          <span className={styles.mapPin} aria-hidden="true">
            <Icon name="pin" size={28} />
          </span>
          <span className={styles.mapLabel}>
            <strong>Показати карту</strong>
            <span>Google Maps завантажиться після натискання</span>
          </span>
        </button>
      )}
    </div>
  );
}
