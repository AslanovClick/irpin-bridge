/*
 * Згода на cookies. Зберігається в localStorage; на зміну розсилаємо подію,
 * на яку реагують банер і завантажувач аналітики.
 */
export type Consent = { analytics: boolean; marketing: boolean; date: string };

const KEY = "ib-consent-v1";
export const CONSENT_CHANGE = "ib-consent-change";
export const CONSENT_OPEN = "ib-consent-open";

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(c: Omit<Consent, "date">) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...c, date: new Date().toISOString() }));
  } catch {
    /* приватний режим — банер з'явиться знову */
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE));
}

export function subscribeConsent(cb: () => void) {
  window.addEventListener(CONSENT_CHANGE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_CHANGE, cb);
    window.removeEventListener("storage", cb);
  };
}

export const openConsentSettings = () => window.dispatchEvent(new Event(CONSENT_OPEN));
