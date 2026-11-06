import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Сторінку не знайдено",
  robots: { index: false },
};

const LINKS = [
  { label: "Каталог", note: "Одяг і аксесуари", href: "/catalog" },
  { label: "Кастомізація", note: "Свій дизайн від 1 шт.", href: "/customize" },
  { label: "Бізнес-мерч", note: "Мерч для команди", href: "/business" },
  { label: "Арт-мерч", note: "Колаборації з митцями", href: "/art" },
];

export default function NotFound() {
  return (
    <section className={`theme-light ${styles.wrap}`} aria-labelledby="nf-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <p className={styles.code}>Помилка 404</p>
          <h1 id="nf-title" className={styles.title}>
            Сторінку не знайдено
          </h1>
          <p className={styles.lead}>Можливо, посилання застаріло або в адресі помилка. Спробуйте пошук або перейдіть до розділів нижче.</p>

          <form action="/search" className={styles.search} role="search">
            <label htmlFor="nf-q" className="visually-hidden">
              Пошук по сайту
            </label>
            <input id="nf-q" name="q" type="search" placeholder="Футболка, худі, вишивка…" autoComplete="off" />
            <button type="submit" aria-label="Шукати">
              <Icon name="search" size={22} />
            </button>
          </form>

          <div className="actions">
            <Button href="/" size="lg" arrow>
              На головну
            </Button>
            <Button href="/contacts" variant="link">
              Написати нам
            </Button>
          </div>
        </div>

        {/* Фірмова фігура: знак логотипа з «вікном», у якому — 404 */}
        <div className={styles.art} aria-hidden="true">
          <Logo variant="mark" title="" className={styles.mark} />
          <span className={styles.num}>404</span>
        </div>
      </div>

      <div className="container">
        <ul role="list" className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>
                <span>
                  <strong>{l.label}</strong>
                  <span>{l.note}</span>
                </span>
                <Icon name="arrow" size={22} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
