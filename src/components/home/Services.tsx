import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Services.module.css";

/* ДЕМО: ціни «від» — уточнити в замовника */
const SERVICES = [
  {
    title: "DTF-друк",
    text: "Повноколірний друк на бавовні, синтетиці й сумішах. Стійкий до прання, без обмежень за кольорами.",
    price: "від 150 ₴",
    href: "/services/dtf-druk",
    img: "/placeholders/hoodie.jpg",
  },
  {
    title: "Машинна вишивка",
    text: "Логотипи, написи та зображення, що служать роками. Для форми, подарунків і преміального мерчу.",
    price: "від 200 ₴",
    href: "/services/vyshyvka",
    img: "/placeholders/tee-front.jpg",
  },
  {
    title: "Кастомізація",
    text: "Друк, вишивка й інші технології на ваших або наших готових виробах. Від однієї речі.",
    price: "за макетом",
    href: "/customize",
    img: "/placeholders/tote-blue.jpg",
  },
];

export function Services() {
  return (
    <section className={`theme-light ${styles.section}`} aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          id="services-title"
          title="Друк і вишивка"
          lead="Власне обладнання в Ірпені: робимо швидко, контролюємо якість на кожному етапі."
          action={
            <Button href="/services" variant="link" arrow>
              Усі послуги
            </Button>
          }
        />

        <ul role="list" className={styles.list}>
          {SERVICES.map((s, i) => (
            <li key={s.href}>
              <Link href={s.href} className={styles.row}>
                <span className={styles.num}>0{i + 1}</span>
                <span className={styles.thumb}>
                  <Image src={s.img} alt="" fill sizes="160px" className={styles.thumbImg} />
                </span>
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.text}>{s.text}</p>
                <span className={styles.price}>{s.price}</span>
                <span className={styles.go} aria-hidden="true">
                  <Icon name="arrow" size={26} />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.foot}>
          <p>Не знаєте, яку технологію обрати? Підкажемо за кілька хвилин.</p>
          <Button href="/#request" arrow>
            Розрахувати вартість
          </Button>
        </div>
      </div>
    </section>
  );
}
