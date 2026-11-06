import { Button } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/SectionHead";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./Business.module.css";

/* ДЕМО: умови (мінімальний тираж тощо) — уточнити в замовника */
const BENEFITS = [
  { value: "Під ключ", text: "Від ідеї та макета до пакування й доставки по Україні" },
  { value: "від 10 шт.", text: "Невеликі тиражі для команд, подій і подарунків" },
  { value: "Зразок", text: "Погоджуємо макет і показуємо зразок до запуску тиражу" },
  { value: "Соціальний ефект", text: "Ваше замовлення створює робочі місця в Ірпені" },
];

export function Business() {
  return (
    <section className="theme-blue section" aria-labelledby="b2b-title">
      <div className="container split">
        <div className="stack">
          <SectionHead
            flush
            id="b2b-title"
            title="Корпоративний мерч під ключ"
            lead="Футболки, худі, світшоти, шопери й інший текстиль з вашим брендом. DTF-друк і машинна вишивка на власному виробництві."
          />

          <dl className={styles.benefits}>
            {BENEFITS.map((b) => (
              <div key={b.value} className={styles.benefit}>
                <dt>{b.value}</dt>
                <dd>{b.text}</dd>
              </div>
            ))}
          </dl>

          <div className="actions">
            <Button href="/business#request" size="lg" arrow>
              Отримати прорахунок
            </Button>
            <Button href="/business" variant="link">
              Як ми працюємо з компаніями
            </Button>
          </div>
        </div>

        <div className={styles.media}>
          <span className={styles.block} aria-hidden="true" />
          <ShapeImage
            src="/placeholders/tote-blue.jpg"
            alt="Шопер із синім знаком на вулиці"
            ratio="4 / 5"
            notch={[28, 18]}
            sizes="(max-width: 900px) 90vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
