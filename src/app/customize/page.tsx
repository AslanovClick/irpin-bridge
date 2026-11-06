import type { Metadata } from "next";
import { Suspense } from "react";
import { CATEGORIES, SIZE_CHARTS } from "@/data/categories";
import type { SizeChart } from "@/data/types";
import { getProducts } from "@/lib/catalog";
import { PageHero } from "@/components/ui/PageHero";
import { CustomizeForm } from "@/components/forms/CustomizeForm";

export const metadata: Metadata = {
  title: "Кастомізація одягу — свій дизайн від 1 шт.",
  description:
    "Додайте свій логотип, фото чи ілюстрацію на футболку, худі або шопер. DTF-друк і машинна вишивка в Ірпені. Оплата після погодження макета.",
  alternates: { canonical: "/customize" },
};

export default async function Page() {
  const products = (await getProducts()).filter((p) => p.customizable);
  const charts: Record<string, SizeChart> = Object.fromEntries(
    CATEGORIES.filter((c) => c.sizeChart).map((c) => [c.slug, SIZE_CHARTS[c.sizeChart!]]),
  );

  return (
    <>
      <PageHero
        theme="pine"
        crumbs={[{ label: "Послуги", href: "/services" }, { label: "Кастомізація" }]}
        title="Додайте свій дизайн"
        lead="Три кроки: виріб, дизайн на мокапі, контакти. Менеджер перевірить макет і назве точну ціну — оплата після погодження."
        facts={[
          ["від 1 шт.", "навіть одна річ"],
          ["Макет", "погоджуємо до друку"],
          ["Оплата", "після погодження"],
        ]}
        image={{ src: "/placeholders/tote-lime.jpg", alt: "Шопер з великим знаком IRPIN BRIDGE" }}
      />
      <section className="theme-light section" aria-label="Заявка на кастомізацію">
        <div className="container">
          <Suspense fallback={null}>
            <CustomizeForm products={products} charts={charts} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
