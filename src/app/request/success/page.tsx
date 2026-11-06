import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestSuccess } from "@/components/forms/RequestSuccess";
import styles from "@/components/checkout/Order.module.css";

export const metadata: Metadata = {
  title: "Заявку прийнято",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <section className="theme-light">
      <div className={`container ${styles.page}`}>
        <Suspense fallback={<div className={styles.skeleton} aria-hidden="true" />}>
          <RequestSuccess />
        </Suspense>
      </div>
    </section>
  );
}
