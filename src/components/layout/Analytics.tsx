"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { GA_ID, PIXEL_ID } from "@/lib/analytics";
import { getConsent, subscribeConsent } from "@/lib/consent";

/* Знімок згоди рядком — стабільний для useSyncExternalStore */
const snapshot = () => {
  const c = getConsent();
  return `${c?.analytics ? 1 : 0}${c?.marketing ? 1 : 0}`;
};

/**
 * Завантажує GA4 і Meta Pixel лише після згоди й рахує перегляди сторінок при клієнтській навігації.
 * Відкликання згоди: для GA — consent update, для Pixel — revoke (скрипти, що вже завантажились, не вивантажуються).
 */
export function Analytics() {
  const state = useSyncExternalStore(subscribeConsent, snapshot, () => "00");
  const analytics = state[0] === "1" && Boolean(GA_ID);
  const marketing = state[1] === "1" && Boolean(PIXEL_ID);
  const pathname = usePathname();
  const first = useRef(true);

  // Зміна згоди після завантаження скриптів
  useEffect(() => {
    window.gtag?.("consent", "update", { analytics_storage: analytics ? "granted" : "denied" });
    window.fbq?.("consent", marketing ? "grant" : "revoke");
  }, [analytics, marketing]);

  // Перегляди сторінок при переходах (перший — надсилає сам скрипт)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (analytics) window.gtag?.("event", "page_view", { page_path: pathname, page_location: window.location.href });
    if (marketing) window.fbq?.("track", "PageView");
  }, [pathname, analytics, marketing]);

  return (
    <>
      {analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {marketing && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
