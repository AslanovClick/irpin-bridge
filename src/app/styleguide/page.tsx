import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import type { Theme } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./styleguide.module.css";

export const metadata: Metadata = {
  title: "Стайлгайд",
  robots: { index: false, follow: false },
};

const PAIRS = [
  { a: { name: "Pine Green", hex: "#015641" }, b: { name: "Lime Yellow", hex: "#D5F266" }, use: "Послуги, кастомізація" },
  { a: { name: "Blue", hex: "#005EC4" }, b: { name: "Sky Cyan", hex: "#4FC6E6" }, use: "Бізнес-мерч" },
  { a: { name: "Royal Purple", hex: "#6C2C91" }, b: { name: "Bubblegum Pink", hex: "#EF65AB" }, use: "Арт-мерч" },
  { a: { name: "Warm Sand", hex: "#EADFBB" }, b: { name: "Orange", hex: "#F77E2D" }, use: "Соціальна місія, Про нас" },
  { a: { name: "Black", hex: "#111111" }, b: { name: "White", hex: "#F9F9F9" }, use: "Основа, магазин" },
];

const THEMES: { key: Theme; label: string }[] = [
  { key: "light", label: "light" },
  { key: "dark", label: "dark" },
  { key: "pine", label: "pine" },
  { key: "lime", label: "lime" },
  { key: "blue", label: "blue" },
  { key: "purple", label: "purple" },
  { key: "sand", label: "sand" },
  { key: "orange", label: "orange" },
];

const TYPE = [
  { token: "--fs-display", label: "Display · Black 900", sample: "Мерч, що єднає", cls: "display" },
  { token: "--fs-h1", label: "H1 · Black 900", sample: "Додайте свій дизайн", cls: "h1" },
  { token: "--fs-h2", label: "H2 · Black 900", sample: "Хіти та новинки", cls: "h2" },
  { token: "--fs-h3", label: "H3 · Black 900", sample: "Машинна вишивка", cls: "h3" },
  { token: "--fs-h4", label: "H4 · Bold 700", sample: "Футболка «Місце, що єднає»", cls: "h4" },
  { token: "--fs-lead", label: "Lead · Medium 500", sample: "Шиємо, друкуємо й вишиваємо власний одяг.", cls: "lead" },
  { token: "--fs-body", label: "Body · Medium 500", sample: "Власне виробництво в Ірпені: робимо швидко, контролюємо якість.", cls: "body" },
  { token: "--fs-small", label: "Small · Medium 500", sample: "В наявності · XS–XXL", cls: "small" },
];

export default function StyleguidePage() {
  return (
    <div className={styles.page}>
      <section className="theme-light">
        <div className={`container ${styles.block}`}>
          <SectionHead
            as="h1"
            eyebrow="Етап 1 · дизайн-система"
            title="Стайлгайд"
            lead="Токени й базові компоненти IRPIN BRIDGE. Основа — бренд-бук «Irpin Bridge», адаптований під веб."
          />
        </div>
      </section>

      {/* Логотип */}
      <section className="theme-light">
        <div className={`container ${styles.block}`}>
          <h2 className={styles.h}>Логотип</h2>
          <div className={styles.logos}>
            <div className={`theme-light ${styles.logoCell}`}>
              <Logo variant="full" />
              <span>full · з «Art Center», від 200 px</span>
            </div>
            <div className={`theme-dark ${styles.logoCell}`}>
              <Logo variant="full" />
              <span>full · інверсія</span>
            </div>
            <div className={`theme-pine ${styles.logoCell}`} style={{ color: "var(--c-lime)" }}>
              <Logo variant="compact" />
              <span>compact · шапка, малі розміри</span>
            </div>
            <div className={`theme-purple ${styles.logoCell}`} style={{ color: "var(--c-pink)" }}>
              <Logo variant="mark" className={styles.markOnly} />
              <span>mark · фавікон, графіка</span>
            </div>
            <div className={`theme-blue ${styles.logoCell}`} style={{ color: "var(--c-sky)" }}>
              <Logo variant="mark" className={styles.markOnly} />
              <span>mark · на парі Blue/Sky</span>
            </div>
            <div className={`theme-sand ${styles.logoCell}`} style={{ color: "var(--c-orange)" }}>
              <Logo variant="mark" className={styles.markOnly} />
              <span>mark · на парі Sand/Orange</span>
            </div>
          </div>
          <p className={styles.note}>SVG у <code>public/brand/</code>. Колір задається через CSS <code>color</code>.</p>
        </div>
      </section>

      {/* Кольори */}
      <section className="theme-light">
        <div className={`container ${styles.block}`}>
          <h2 className={styles.h}>Кольорові пари</h2>
          <ul role="list" className={styles.pairs}>
            {PAIRS.map((p) => (
              <li key={p.a.hex} className={styles.pair}>
                <div className={styles.swatchBig} style={{ background: p.a.hex, color: p.b.hex }}>
                  <span className={styles.swatchInner} style={{ background: p.b.hex }} />
                  <span className={styles.swatchLabel}>
                    {p.a.name}
                    <br />
                    {p.a.hex}
                  </span>
                </div>
                <div className={styles.swatchSmall} style={{ background: p.b.hex, color: p.a.hex }}>
                  {p.b.name} · {p.b.hex}
                </div>
                <p className={styles.use}>{p.use}</p>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Дрібний текст у парах Blue/Sky і Purple/Pink — білий: контраст другого кольору пари недостатній для читання.
            Колір пари — для великих заголовків, фігур і кнопок.
          </p>
        </div>
      </section>

      {/* Типографіка */}
      <section className="theme-light">
        <div className={`container ${styles.block}`}>
          <h2 className={styles.h}>Типографіка · Inter Tight</h2>
          <ul role="list" className={styles.type}>
            {TYPE.map((t) => (
              <li key={t.token} className={styles.typeRow}>
                <div className={styles.typeMeta}>
                  <code>{t.token}</code>
                  <span>{t.label}</span>
                </div>
                <p className={`${styles.sample} ${styles[t.cls]}`}>{t.sample}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Теми й кнопки */}
      <section className="theme-light">
        <div className={`container ${styles.block}`}>
          <h2 className={styles.h}>Теми секцій і кнопки</h2>
          <div className={styles.themes}>
            {THEMES.map((t) => (
              <div key={t.key} className={`theme-${t.key} ${styles.themeCell}`}>
                <code className={styles.themeName}>.theme-{t.label}</code>
                <p className={styles.themeTitle}>Заголовок</p>
                <p className={styles.themeText}>Основний текст секції та вторинний опис.</p>
                <div className={styles.btns}>
                  <Button arrow>Основна</Button>
                  <Button variant="outline">Контурна</Button>
                  <Button variant="link" arrow>
                    Посилання
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.sizes}>
            <Button size="sm">Small · 40</Button>
            <Button>Medium · 52</Button>
            <Button size="lg" arrow>
              Large · 60
            </Button>
            <Button disabled>Неактивна</Button>
          </div>
        </div>
      </section>

      {/* Фото у формі знака */}
      <section className="theme-light">
        <div className={`container ${styles.block}`}>
          <h2 className={styles.h}>Фото у формі знака</h2>
          <div className={styles.shapes}>
            <figure>
              <ShapeImage src="/placeholders/post-painting.jpg" alt="" shape="a" ratio="4 / 5" sizes="25vw" />
              <figcaption>shape=&quot;a&quot;</figcaption>
            </figure>
            <figure>
              <ShapeImage src="/placeholders/workshop-flowers.jpg" alt="" shape="b" ratio="4 / 5" sizes="25vw" />
              <figcaption>shape=&quot;b&quot;</figcaption>
            </figure>
            <figure>
              <ShapeImage src="/placeholders/workshop-kids.jpg" alt="" shape="a" ratio="1 / 1" notch={[40, 30]} sizes="25vw" />
              <figcaption>notch 40 × 30</figcaption>
            </figure>
            <figure>
              <ShapeImage src="/placeholders/hoodie.jpg" alt="" shape="rect" ratio="4 / 5" sizes="25vw" />
              <figcaption>shape=&quot;rect&quot;</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Картки товарів */}
      <section className="theme-light">
        <div className={`container ${styles.block}`}>
          <h2 className={styles.h}>Картка товару</h2>
          <ul role="list" className={styles.cards}>
            {[PRODUCTS[0], PRODUCTS[4], PRODUCTS[6], PRODUCTS[8]].map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Бейджі: Новинка · Хіт · Арт-мерч · Можна кастомізувати · Знижка. Без фото — заглушка зі знаком у кольорах пари.
          </p>
        </div>
      </section>
    </div>
  );
}
