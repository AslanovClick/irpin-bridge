"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "./Product.module.css";

/** Поділитися: системне меню (мобільний) або копіювання посилання + месенджери */
export function Share({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => window.location.href.split("?")[0];

  const copy = async () => {
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title, url: url() });
        return;
      }
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* користувач скасував */
    }
  };

  const open = (base: string) => () =>
    window.open(`${base}${encodeURIComponent(url())}`, "_blank", "noopener,noreferrer,width=640,height=560");

  return (
    <div className={styles.share}>
      <span className={styles.shareLabel}>Поділитися</span>
      <button type="button" onClick={copy}>
        {copied ? <Icon name="check" size={18} /> : <Icon name="arrow-up-right" size={18} />}
        {copied ? "Скопійовано" : "Посилання"}
      </button>
      <button type="button" onClick={open("https://t.me/share/url?url=")} aria-label="Поділитися в Telegram">
        <Icon name="telegram" size={18} />
      </button>
      <button type="button" onClick={open("https://www.facebook.com/sharer/sharer.php?u=")} aria-label="Поділитися у Facebook">
        <Icon name="facebook" size={18} />
      </button>
    </div>
  );
}
