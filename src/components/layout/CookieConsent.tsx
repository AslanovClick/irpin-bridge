"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { CONSENT_OPEN, getConsent, openConsentSettings, saveConsent, subscribeConsent } from "@/lib/consent";
import styles from "./CookieConsent.module.css";

/* Згода на cookies: збереження й події — у lib/consent; аналітика підключається в <Analytics /> */
const snapshot = () => (getConsent() ? "set" : "none");

export function CookieConsent() {
  const state = useSyncExternalStore(subscribeConsent, snapshot, () => "server");
  const [forced, setForced] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // Відкриття з посилання «Налаштування cookies»
  useEffect(() => {
    const onOpen = () => {
      const c = getConsent();
      setAnalytics(c?.analytics ?? true);
      setMarketing(c?.marketing ?? false);
      setCustom(true);
      setForced(true);
    };
    window.addEventListener(CONSENT_OPEN, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN, onOpen);
  }, []);

  if (state === "server" || (state === "set" && !forced)) return null;

  const done = (c: { analytics: boolean; marketing: boolean }) => {
    saveConsent(c);
    setForced(false);
    setCustom(false);
  };

  return (
    <div className={styles.banner} role="dialog" aria-modal="false" aria-labelledby="cc-title">
      <p id="cc-title" className={styles.title}>
        Ми використовуємо cookies
      </p>
      <p className={styles.text}>
        Необхідні — щоб працювали кошик і заявки. Аналітичні й маркетингові — лише з вашої згоди, щоб покращувати сайт.{" "}
        <Link href="/info/cookies">Детальніше</Link>
      </p>

      {custom && (
        <ul role="list" className={styles.options}>
          <li>
            <label>
              <input type="checkbox" checked disabled />
              <span>
                <strong>Необхідні</strong>
                <span>Кошик, чернетки, вибір згоди — завжди увімкнені</span>
              </span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
              <span>
                <strong>Аналітичні</strong>
                <span>Google Analytics: які сторінки корисні</span>
              </span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
              <span>
                <strong>Маркетингові</strong>
                <span>Meta Pixel: релевантна реклама</span>
              </span>
            </label>
          </li>
        </ul>
      )}

      <div className={styles.actions}>
        {custom ? (
          <button type="button" className={styles.primary} onClick={() => done({ analytics, marketing })}>
            Зберегти вибір
          </button>
        ) : (
          <button type="button" className={styles.primary} onClick={() => done({ analytics: true, marketing: true })}>
            Прийняти всі
          </button>
        )}
        <button type="button" className={styles.secondary} onClick={() => done({ analytics: false, marketing: false })}>
          Лише необхідні
        </button>
        {!custom && (
          <button type="button" className={styles.link} onClick={() => setCustom(true)}>
            Налаштувати
          </button>
        )}
      </div>
    </div>
  );
}

/** Кнопка для футера й сторінки «Політика cookies» — знову відкриває банер */
export function CookieSettingsLink({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={openConsentSettings}>
      {children}
    </button>
  );
}
