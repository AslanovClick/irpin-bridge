import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/SectionHead";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./Customization.module.css";

const STEPS = [
  { title: "Оберіть виріб", text: "Футболка, худі, світшот, шопер — з каталогу або ваш власний." },
  { title: "Завантажте макет", text: "Логотип, фото, ілюстрацію чи готовий дизайн. Немає макета — допоможемо." },
  { title: "Погодьте з менеджером", text: "Перевіримо файл, покажемо розміщення й назвемо точну вартість." },
  { title: "Отримайте свою річ", text: "Виготовимо в студії та відправимо Новою поштою." },
];

export function Customization() {
  return (
    <section className="theme-pine section" aria-labelledby="custom-title">
      <div className="container split">
        <div className={styles.media}>
          <span className={styles.block} aria-hidden="true" />
          <ShapeImage
            src="/placeholders/tote-lime.jpg"
            alt="Шопер з великим лаймовим знаком у руці"
            shape="b"
            ratio="4 / 5"
            notch={[28, 18]}
            sizes="(max-width: 900px) 90vw, 40vw"
          />
        </div>

        <div className="stack">
          <SectionHead
            flush
            id="custom-title"
            title="Додайте свій дизайн"
            lead="Без складних конструкторів: ви надсилаєте файл, ми погоджуємо макет і ціну. Від однієї речі."
          />

          <ol role="list" className={styles.steps}>
            {STEPS.map((s, i) => (
              <li key={s.title} className={styles.step} style={{ "--step": i + 1 } as CSSProperties}>
                <span className={styles.progress} aria-hidden="true" />
                <span className={styles.num}>
                  <span className="visually-hidden">Крок </span>
                  {i + 1}
                </span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="actions">
            <Button href="/customize" size="lg" arrow>
              Створити свій мерч
            </Button>
            <Button href="/services/dtf-druk#requirements" variant="link">
              Як підготувати макет
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
