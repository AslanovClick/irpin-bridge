import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Social.module.css";

/* ДЕМО: цифри вигадані — замінити на реальні від замовника */
const STATS = [
  { value: "12", label: "робочих місць" },
  { value: "30+", label: "проєктів підтримано" },
  { value: "2 000+", label: "речей виготовлено" },
];

const FLOW = [
  { title: "Ви купуєте або замовляєте", text: "Готовий одяг, кастомізацію чи мерч для команди." },
  { title: "Студія створює робочі місця", text: "Власне виробництво в Ірпені, люди з громади в команді." },
  { title: "Прибуток працює на громаду", text: "Частина йде на соціальні проєкти БФ «Єдність світу»." },
];

export function Social() {
  return (
    <section id="mission" className="theme-sand section" aria-labelledby="social-title">
      <div className="container split">
        <div className="stack">
          <SectionHead
            flush
            id="social-title"
            title="Створюємо речі. Створюємо можливості."
            lead="IRPIN BRIDGE — комерційна студія, яка працює на громаду. Ми підтримуємо жінок і дітей з Ірпінської громади, що опинилися в соціальній ізоляції."
          />

          <ol role="list" className={styles.flow}>
            {FLOW.map((f, i) => (
              <li key={f.title} className={styles.flowItem}>
                <span className={styles.flowNum} aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className={styles.flowTitle}>{f.title}</h3>
                  <p className={styles.flowText}>{f.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="actions">
            <Button href="/about#mission" size="lg" arrow>
              Про нашу місію
            </Button>
          </div>
        </div>

        <div className={styles.side}>
          {/* Два фото складають знак логотипа: прямокутники, що перетинаються, і «вікно» на перетині */}
          <div className={styles.mosaic}>
            <div className={styles.photoA}>
              <Image
                src="/placeholders/workshop-kids.jpg"
                alt="Діти ліплять фігурки на майстер-класі"
                fill
                sizes="(max-width: 900px) 60vw, 28vw"
              />
            </div>
            <div className={styles.photoB}>
              <Image
                src="/placeholders/workshop-flowers.jpg"
                alt="Учасниця майстер-класу з флористики"
                fill
                sizes="(max-width: 900px) 50vw, 24vw"
              />
            </div>
            <span className={styles.window} aria-hidden="true" />
          </div>

          <dl className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
