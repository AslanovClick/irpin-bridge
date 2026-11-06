import Link from "next/link";
import type { Theme } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "./Directions.module.css";

const ITEMS: { title: string; text: string; href: string; theme: Theme }[] = [
  { title: "Магазин", text: "Готовий одяг і аксесуари IRPIN BRIDGE", href: "/catalog", theme: "dark" },
  { title: "Послуги", text: "DTF-друк, вишивка, кастомізація ваших речей", href: "/services", theme: "pine" },
  { title: "Бізнес-мерч", text: "Корпоративний одяг і подарунки під ключ", href: "/business", theme: "blue" },
  { title: "Арт-мерч", text: "Колекції, створені разом з митцями", href: "/art", theme: "purple" },
];

export function Directions() {
  return (
    <section className={styles.section} aria-label="Напрями IRPIN BRIDGE">
      <div className="container">
        <ul role="list" className={styles.grid}>
          {ITEMS.map((it, i) => (
            <li key={it.href}>
              <Link href={it.href} className={`theme-${it.theme} ${styles.tile}`}>
                <span className={styles.num}>0{i + 1}</span>
                <Logo variant="mark" className={styles.mark} title="" />
                <span className={styles.bottom}>
                  <span className={styles.title}>{it.title}</span>
                  <span className={styles.text}>{it.text}</span>
                  <span className={styles.go}>
                    <Icon name="arrow" size={26} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
