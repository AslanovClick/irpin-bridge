import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { Faq, Timeline, WorksGrid } from "@/components/content/Blocks";
import { BusinessForm } from "@/components/forms/BusinessForm";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./business.module.css";

export const metadata: Metadata = {
  title: "Корпоративний мерч під ключ — від 10 шт.",
  description:
    "Футболки, худі, світшоти, шопери з логотипом компанії. DTF-друк і вишивка на власному виробництві в Ірпені, зразок до тиражу, документи для юросіб.",
  alternates: { canonical: "/business" },
};

/* ДЕМО: ціни «від» за одиницю — погодити із замовником */
const TYPES = [
  { title: "Футболки", price: "від 390 ₴/шт.", img: "/placeholders/tee-front.jpg" },
  { title: "Худі", price: "від 990 ₴/шт.", img: "/placeholders/hoodie.jpg" },
  { title: "Світшоти", price: "від 790 ₴/шт." },
  { title: "Шопери", price: "від 190 ₴/шт.", img: "/placeholders/tote-blue.jpg" },
  { title: "Кепки", price: "від 290 ₴/шт." },
  { title: "Інший текстиль", price: "за запитом" },
];

const STEPS = [
  { title: "Бриф", time: "15 хвилин", text: "Розповідаєте про задачу, кількість і терміни — через форму чи дзвінок." },
  { title: "Пропозиція", time: "1 день", text: "Надсилаємо варіанти виробів, нанесення й вартість." },
  { title: "Макет і зразок", time: "2–3 дні", text: "Погоджуємо розміщення й виготовляємо тестовий зразок." },
  { title: "Тираж", time: "7–14 днів", text: "Виготовляємо партію й перевіряємо кожну річ перед пакуванням." },
  { title: "Доставка", time: "1–3 дні", text: "Пакуємо й доставляємо Новою поштою — в один чи кілька офісів." },
];

const FAQ = [
  { q: "Який мінімальний тираж?", a: "Від 10 одиниць. Для меншої кількості зручніше оформити кастомізацію — від 1 шт." },
  { q: "Скільки часу займає виробництво?", a: "7–14 робочих днів після погодження зразка. Термінові замовлення — обговорюємо індивідуально." },
  { q: "Чи можна побачити зразок?", a: "Так, перед тиражем робимо тестовий виріб і погоджуємо його з вами." },
  { q: "Як оплатити?", a: "За рахунком на розрахунковий рахунок. Передоплата — 50%, решта — перед відвантаженням." },
];

/* ДЕМО: кейси — показувати чи ні, вирішує замовник; зараз мокапи з бренд-буку */
const CASES = [
  { src: "/placeholders/tee-back.jpg", title: "Футболки для команди · 120 шт." },
  { src: "/placeholders/hoodie.jpg", title: "Худі для волонтерів · 40 шт." },
  { src: "/placeholders/tote-lime.jpg", title: "Шопери для фестивалю · 300 шт." },
];

export default function Page() {
  const tech = SERVICES.filter((s) => s.slug !== "kastomizatsiia");

  return (
    <>
      <PageHero
        theme="blue"
        crumbs={[{ label: "Бізнес-мерч" }]}
        title="Корпоративний мерч під ключ"
        lead="Футболки, худі, світшоти, шопери й інший текстиль з вашим брендом. Від брифу до доставки в офіс — на власному виробництві в Ірпені."
        actions={
          <>
            <Button href="#request" size="lg" arrow>
              Отримати прорахунок
            </Button>
            <Button href="#process" variant="link">
              Як ми працюємо
            </Button>
          </>
        }
        facts={[
          ["від 10 шт.", "мінімальний тираж"],
          ["7–14 днів", "виробництво"],
          ["Зразок", "до запуску тиражу"],
        ]}
        image={{ src: "/placeholders/tote-blue.jpg", alt: "Шопер з логотипом" }}
      />

      <section className="theme-light section" aria-labelledby="types-title">
        <div className="container">
          <SectionHead id="types-title" title="Що виготовляємо" lead="Ціни за одиницю з нанесенням логотипа — точна вартість залежить від тиражу й технології." />
          <ul role="list" className={styles.types}>
            {TYPES.map((t) => (
              <li key={t.title} className={styles.type}>
                <span className={styles.typeMedia}>
                  {t.img ? <Image src={t.img} alt="" fill sizes="(max-width: 560px) 50vw, 16vw" /> : <Logo variant="mark" title="" className={styles.typeMark} />}
                </span>
                <strong>{t.title}</strong>
                <span>{t.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="tech-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead id="tech-title" title="Технології нанесення" />
          <ul role="list" className={styles.tech}>
            {tech.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={styles.techCard}>
                  <span className={styles.techMedia}>
                    <Image src={s.image} alt="" fill sizes="160px" />
                  </span>
                  <span className={styles.techBody}>
                    <h3>{s.title}</h3>
                    <p>{s.short}</p>
                    <span>
                      Детальніше <Icon name="arrow" size={18} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="process" className="theme-blue section" aria-labelledby="process-title">
        <div className="container">
          <SectionHead
            id="process-title"
            title="Як ми працюємо"
            lead="Від першого повідомлення до коробок в офісі — у середньому 2–3 тижні."
          />
          <Timeline steps={STEPS} />
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="why-title">
        <div className="container">
          <SectionHead id="why-title" title="Чому IRPIN BRIDGE" />
          {/* Бенто: велика картка з фото + картки з акцентами */}
          <ul role="list" className={styles.bento}>
            <li className={styles.bentoMain}>
              <Image src="/placeholders/tee-back.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
              <div className={styles.bentoOverlay}>
                <p className={styles.bentoKicker}>Власне виробництво</p>
                <h3>Не перепродаємо — друкуємо й вишиваємо самі</h3>
                <p>Тому контролюємо якість кожної речі й тримаємо терміни.</p>
              </div>
            </li>
            <li className={styles.bentoStat}>
              <span className={styles.bentoNum}>1</span>
              <h3>Зразок до тиражу</h3>
              <p>Тримаєте в руках готову річ до запуску всієї партії.</p>
            </li>
            <li className={styles.bentoDocs}>
              <h3>Документи для бухгалтерії</h3>
              <ul role="list">
                <li>Рахунок і договір</li>
                <li>Акти виконаних робіт</li>
                <li>ФОП і юридичні особи</li>
              </ul>
            </li>
            <li className={styles.bentoSocial}>
              <Logo variant="mark" title="" className={styles.bentoMark} />
              <div>
                <h3>Мерч із соціальним ефектом</h3>
                <p>Ваше замовлення створює робочі місця в Ірпені й підтримує проєкти громади — це можна показати в CSR-звіті.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="cases-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead id="cases-title" title="Кейси" />
          <WorksGrid works={CASES} />
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
        <div className="container split">
          <SectionHead flush id="faq-title" title="Питання й відповіді" />
          <Faq items={FAQ} id="b2b-faq" />
        </div>
      </section>

      <section id="request" className="theme-light section" aria-labelledby="form-title" style={{ background: "var(--c-gray-50)" }}>
        <div className="container">
          <SectionHead
            id="form-title"
            title="Заявка на прорахунок"
            lead="3 коротких кроки — і протягом робочого дня отримаєте комерційну пропозицію."
          />
          <BusinessForm />
        </div>
      </section>
    </>
  );
}
