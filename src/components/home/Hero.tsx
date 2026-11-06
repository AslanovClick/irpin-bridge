import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./Hero.module.css";

const FACTS = [
  { value: "Ірпінь", label: "власне виробництво" },
  { value: "від 1 шт.", label: "до великих тиражів" },
  { value: "Соцмісія", label: "частина прибутку — громаді" },
];

export function Hero() {
  return (
    <section className={`theme-light ${styles.hero}`} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>
            <Logo variant="mark" title="" className={styles.mark} />
            Креативна студія · Ірпінь
          </p>
          <h1 id="hero-title" className={styles.title} aria-label="Мерч, що єднає">
            <span aria-hidden="true">
              Мерч
              <br />
              що єднає
            </span>
          </h1>
          <p className={styles.lead}>
            Шиємо, друкуємо й вишиваємо власний одяг, створюємо корпоративний мерч і колекції з українськими митцями.
          </p>
          <div className={styles.ctas}>
            <Button href="/catalog" size="lg" arrow>
              До каталогу
            </Button>
            <Button href="/customize" size="lg" variant="outline">
              Створити свій мерч
            </Button>
          </div>
        </div>

        <div className={styles.visual}>
          <span className={styles.block} aria-hidden="true" />
          <div className={styles.photo}>
            <ShapeImage
              src="/placeholders/tee-back.jpg"
              alt="Футболка IRPIN BRIDGE з написом «Місце, що єднає»"
              ratio="4 / 5"
              notch={[28, 18]}
              sizes="(max-width: 900px) 90vw, 42vw"
              eager
            />
          </div>
          <Link href="/product/futbolka-mistse-shcho-iednaie" className={styles.pin}>
            <span className={styles.pinName}>Футболка «Місце, що єднає»</span>
            <span className={styles.pinPrice}>
              890 ₴ <Icon name="arrow" size={18} />
            </span>
          </Link>
        </div>

        <dl className={styles.facts}>
          {FACTS.map((f) => (
            <div key={f.value} className={styles.fact}>
              <dt>{f.value}</dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
