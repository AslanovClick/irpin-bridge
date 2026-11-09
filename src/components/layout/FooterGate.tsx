"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Сторінки без підвалу: у кошику він лише відволікає від оформлення (особливо на телефоні) */
const NO_FOOTER = ["/cart"];

export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return NO_FOOTER.includes(pathname) ? null : children;
}
