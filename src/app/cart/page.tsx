import type { Metadata } from "next";
import { getPopularProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CartPageView } from "@/components/cart/CartPageView";
import styles from "@/components/cart/Cart.module.css";

export const metadata: Metadata = {
  title: "Кошик",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const popular = await getPopularProducts();
  return (
    <section className="theme-light">
      <div className={`container ${styles.page}`}>
        <Breadcrumbs items={[{ label: "Кошик" }]} />
        <CartPageView popular={popular} />
      </div>
    </section>
  );
}
