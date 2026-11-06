import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderResult } from "@/components/checkout/OrderResult";
import styles from "@/components/checkout/Order.module.css";

export const metadata: Metadata = {
  title: "Оплата не пройшла",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <section className="theme-light">
      <div className={`container ${styles.page}`}>
        <Suspense fallback={<div className={styles.skeleton} aria-hidden="true" />}>
          <OrderResult kind="failed" />
        </Suspense>
      </div>
    </section>
  );
}
