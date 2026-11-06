import Link from "next/link";
import styles from "./AnnouncementBar.module.css";

export function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <p>
          <span className={styles.full}>Соціальне підприємство: кожна покупка підтримує проєкти Ірпінської громади</span>
          <span className={styles.short}>Кожна покупка підтримує громаду</span>
        </p>
        <Link href="/about#mission" className={styles.link}>
          Детальніше
        </Link>
      </div>
    </div>
  );
}
