import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS } from "@/data/art";
import { CONTACTS } from "@/data/site";
import { getProducts } from "@/lib/catalog";
import { Timeline } from "@/components/content/Blocks";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "Про нас — креативна студія й соціальне підприємство",
  description:
    "IRPIN BRIDGE — креативна студія й «третє місце» в Ірпені. Власне виробництво одягу, арт-колаборації й майстер-класи. Соціальне підприємство БФ «Єдність світу».",
  alternates: { canonical: "/about" },
};

/* ДЕМО: історія, цифри, команда й партнери вигадані — замінити на реальні від замовника */
const HISTORY = [
  { time: "2022", title: "Фонд «Єдність світу»", text: "Волонтери фонду допомагають родинам Ірпеня після деокупації." },
  { time: "2023", title: "Простір на Мечникова", text: "Відкриваємо місце для зустрічей, майстер-класів і творчості." },
  { time: "2024", title: "Власне виробництво", text: "DTF-принтер і вишивальна машина — перші замовлення для бізнесу." },
  { time: "2025", title: "Арт-колаборації", text: "Перші колекції разом з митцями й учнями дитячої майстерні." },
  { time: "2026", title: "Онлайн-магазин", text: "Одяг, мерч і кастомізація — з доставкою по всій Україні." },
];

const DIRECTIONS = [
  { title: "Магазин", text: "Базовий одяг і аксесуари власного виробництва", href: "/catalog", theme: "dark", src: "/placeholders/tee-back.jpg", pos: "50% 30%" },
  { title: "Послуги", text: "DTF-друк, вишивка й кастомізація вашого дизайну", href: "/services", theme: "pine", src: "/placeholders/hoodie.jpg", pos: "50% 40%" },
  { title: "Бізнес-мерч", text: "Мерч під ключ для команд, подій і клієнтів", href: "/business", theme: "blue", src: "/placeholders/tote-blue.jpg", pos: "50% 45%" },
  { title: "Арт-мерч", text: "Колекції, створені разом з митцями", href: "/art", theme: "purple", src: "/placeholders/stickers.jpg", pos: "38% 50%" },
];

/* Шляхи співпраці для фінального блоку */
const WAYS = [
  { icon: "pin" as const, title: "Завітати в студію", text: "Подивитися виробництво, приміряти одяг, прийти на майстер-клас.", href: "/contacts", cta: "Як дістатися" },
  { icon: "box" as const, title: "Замовити мерч", text: "Футболки, худі й шопери з вашим логотипом — від 10 шт., з рахунком і актами.", href: "/business#request", cta: "Розрахувати вартість" },
  { icon: "grid" as const, title: "Створити колекцію", text: "Ви митець? Перенесемо ваші роботи на одяг і продаватимемо з вашим ім'ям.", href: "/art#collab", cta: "Запропонувати ідею" },
];

const PRODUCTION = [
  { value: "500+", label: "виробів на тиждень" },
  { value: "30 × 42", label: "см — поле DTF-друку" },
  { value: "15", label: "кольорів ниток у вишивці" },
  { value: "від 2", label: "днів — термін виготовлення" },
];

const TEAM = [
  { name: "Ганна Литвин", role: "Засновниця, керівниця студії" },
  { name: "Олег Кравець", role: "Технолог виробництва" },
  { name: "Марія Шевчук", role: "Дизайнерка" },
  { name: "Наталія Гуменюк", role: "Майстриня вишивки" },
  { name: "Андрій Бойко", role: "Менеджер B2B-замовлень" },
  { name: "Катерина Руденко", role: "Кураторка арт-програм" },
];

const FLOW = [
  { icon: "bag" as const, title: "Студія заробляє", text: "Продаємо одяг, виконуємо замовлення для бізнесу й приватних клієнтів." },
  { icon: "box" as const, title: "Прибуток реінвестуємо", text: "Частина прибутку щомісяця йде на програми фонду «Єдність світу»." },
  { icon: "pin" as const, title: "Громада отримує підтримку", text: "Робочі місця, безкоштовні майстер-класи, допомога родинам Ірпеня." },
];

const IMPACT = [
  { value: "12", label: "робочих місць для людей з громади" },
  { value: "30+", label: "проєктів підтримано" },
  { value: "800+", label: "учасників майстер-класів" },
];

const STORIES = [
  {
    src: "/placeholders/workshop-kids.jpg",
    title: "Дитяча арт-майстерня",
    text: "Щосуботи — безкоштовні заняття для дітей 7–12 років. Найкращі малюнки стають колекцією одягу.",
  },
  {
    src: "/placeholders/workshop-painting.jpg",
    title: "Робота для жінок громади",
    text: "Навчаємо шиттю й вишивці, беремо в команду. Половина виробництва — жінки, які повернулися в Ірпінь.",
  },
  {
    src: "/placeholders/workshop-flowers.jpg",
    title: "Простір для зустрічей",
    text: "Майстер-класи, виставки й вечори для мешканців міста — місце, де знову знайомляться сусіди.",
  },
];

const PARTNERS = ["Ірпінська міська рада", "Фонд «Відродження»", "UNDP Ukraine", "Kyiv Design Week", "Coworking «Мрія»", "Українська асоціація дизайнерів"];

export default async function Page() {
  const products = await getProducts();
  // Ключова цифра для кожного напряму
  const facts = [`${products.length} моделей`, "від 1 шт.", "від 10 шт.", `${COLLECTIONS.length} колекції`];
  return (
    <>
      <PageHero
        theme="sand"
        crumbs={[{ label: "Про нас" }]}
        title="Місце, що єднає"
        lead="IRPIN BRIDGE — креативна студія й «третє місце» в Ірпені: тут шиють одяг, малюють, навчаються й зустрічаються. Ми — соціальне підприємство БФ «Єдність світу»."
        facts={[
          ["2023", "відкрили простір"],
          ["12", "людей у команді"],
          ["30+", "проєктів для громади"],
        ]}
        actions={
          <>
            <Button href="#mission" size="lg" arrow>
              Як ми допомагаємо
            </Button>
            <Button href="/contacts" variant="link">
              Завітати до нас
            </Button>
          </>
        }
        image={{ src: "/placeholders/space-sign.jpg", alt: "Вивіска IRPIN BRIDGE на фасаді простору", position: "62% 50%" }}
      />

      <section className="theme-light section" aria-labelledby="history-title">
        <div className="container">
          <SectionHead id="history-title" title="Наша історія" lead="Від волонтерської ініціативи до студії з власним виробництвом." />
          <Timeline steps={HISTORY} />
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="studio-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            split
            id="studio-title"
            title="Креативна студія"
            lead="Робимо речі, які хочеться носити, — і самі їх виготовляємо. Чотири напрями, одне виробництво в Ірпені."
          />
          <ul role="list" className={styles.directions}>
            {DIRECTIONS.map((d, i) => (
              <li key={d.href}>
                <Link href={d.href} className={`theme-${d.theme} ${styles.direction}`}>
                  <span className={styles.dirTop}>
                    <span className={styles.dirNum} aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span className={styles.dirFact}>{facts[i]}</span>
                  </span>
                  <ShapeImage
                    src={d.src}
                    alt=""
                    shape={i % 2 ? "bl" : "br"}
                    ratio="4 / 3"
                    notch={[30, 26]}
                    objectPosition={d.pos}
                    sizes="(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 22vw"
                  />
                  <span className={styles.dirBody}>
                    <strong>{d.title}</strong>
                    <span>{d.text}</span>
                  </span>
                  <span className={styles.dirMore}>
                    Перейти <Icon name="arrow" size={20} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-pine section" aria-labelledby="prod-title">
        <div className="container">
          <div className={styles.prod}>
            <div className="stack">
              <SectionHead
                flush
                id="prod-title"
                title="Виробництво"
                lead="Власне обладнання в Ірпені: DTF-друк, машинна вишивка й термопреси. Контролюємо кожен етап — від файлу до пакування."
              />
              <Button href="/services" variant="outline" arrow>
                Наші послуги
              </Button>
            </div>
            <dl className={styles.prodStats}>
              {PRODUCTION.map((p) => (
                <div key={p.label}>
                  <dt>{p.label}</dt>
                  <dd>{p.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="team-title">
        <div className="container">
          <SectionHead id="team-title" title="Команда" lead="Дизайнери, технологи, майстри — і люди, для яких студія стала новим початком." />
          {/* ДЕМО: фото команди — замінити; поки ініціали на фірмовому фоні */}
          <ul role="list" className={styles.team}>
            {TEAM.map((t, i) => (
              <li key={t.name}>
                <span className={styles.avatar} data-tone={i % 3} aria-hidden="true">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="mission" className="theme-sand section" aria-labelledby="mission-title">
        <div className="container">
          <SectionHead
            split
            id="mission-title"
            title="Соціальне підприємство"
            lead="IRPIN BRIDGE — комерційна студія, яка працює на громаду. Кожна покупка — це внесок у проєкти фонду «Єдність світу»."
          />
          <ol role="list" className={styles.flow}>
            {FLOW.map((f, i) => (
              <li key={f.title}>
                <span className={styles.flowNum} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={styles.flowIcon}>
                  <Icon name={f.icon} size={28} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="impact-title">
        <div className="container">
          <div className={styles.impactHead}>
            <SectionHead flush id="impact-title" title="Соціальний вплив" />
            <dl className={styles.impact}>
              {IMPACT.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ul role="list" className={styles.stories}>
            {STORIES.map((s) => (
              <li key={s.title}>
                <span className={styles.storyMedia}>
                  <Image src={s.src} alt="" fill sizes="(max-width: 900px) 90vw, 30vw" />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="partners-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead id="partners-title" title="Партнери" />
          {/* ДЕМО: логотипи партнерів — отримати від замовника */}
          <ul role="list" className={styles.partners}>
            {PARTNERS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="space-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead id="space-title" title="Простір" lead={`${CONTACTS.address}. Приходьте на майстер-клас, за замовленням або просто познайомитися.`} />
          <ul role="list" className={styles.space}>
            {[
              { src: "/placeholders/space-sign.jpg", alt: "Вхід до простору IRPIN BRIDGE" },
              { src: "/placeholders/posters-wall.jpg", alt: "Афіші подій на стіні простору" },
              { src: "/placeholders/exhibition.jpg", alt: "Афіша художньої виставки" },
              { src: "/placeholders/workshop-painting.jpg", alt: "Майстер-клас з живопису" },
            ].map((g) => (
              <li key={g.src}>
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 900px) 90vw, 40vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-orange section" aria-labelledby="cta-title">
        <div className="container">
          <SectionHead
            split
            id="cta-title"
            title="Приходьте, співпрацюймо"
            lead="Ми відкриті для гостей, клієнтів і митців. Оберіть, з чого почати, — далі підкажемо."
          />
          <ol role="list" className={styles.ways}>
            {WAYS.map((w, i) => (
              <li key={w.title}>
                <span className={styles.wayTop}>
                  <span className={styles.wayIcon}>
                    <Icon name={w.icon} size={26} />
                  </span>
                  <span className={styles.wayNum} aria-hidden="true">
                    0{i + 1}
                  </span>
                </span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                {i === 0 && (
                  <p className={styles.wayMeta}>
                    {CONTACTS.address}
                    <br />
                    {CONTACTS.hours}
                  </p>
                )}
                <Button href={w.href} variant={i === 0 ? "primary" : "outline"} arrow block>
                  {w.cta}
                </Button>
              </li>
            ))}
          </ol>
          {/* ДЕМО: логотип БФ «Єдність світу» — отримати від замовника */}
          <div className={styles.fund}>
            <Logo variant="mark" title="" className={styles.fundMark} />
            <p>
              <span>Соціальне підприємство</span>
              <strong>БФ «Єдність світу»</strong>
            </p>
            <p className={styles.fundText}>Частина прибутку з кожного замовлення йде на проєкти Ірпінської громади.</p>
            <Button href="#mission" variant="link" arrow>
              Як це працює
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
