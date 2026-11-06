import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import styles from "@/components/checkout/Checkout.module.css";

export const metadata: Metadata = {
  title: "Оформлення замовлення",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <section className="theme-light">
      <div className={`container ${styles.page}`}>
        <Breadcrumbs items={[{ label: "Кошик", href: "/cart" }, { label: "Оформлення" }]} />
        <h1 className={styles.title}>Оформлення</h1>
        <CheckoutView />
      </div>
    </section>
  );
}
