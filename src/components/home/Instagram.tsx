import Image from "next/image";
import { SOCIALS } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Instagram.module.css";

/* ДЕМО: у майбутньому — останні пости, додані через адмінку */
const POSTS = [
  { src: "/placeholders/post-flowers.jpg", alt: "Афіша майстер-класу з флористики" },
  { src: "/placeholders/tee-back.jpg", alt: "Футболка IRPIN BRIDGE" },
  { src: "/placeholders/post-painting.jpg", alt: "Афіша воркшопу з малювання" },
  { src: "/placeholders/stickers.jpg", alt: "Стікери IRPIN BRIDGE" },
  { src: "/placeholders/post-kids.jpg", alt: "Афіша дитячого майстер-класу" },
  { src: "/placeholders/hoodie.jpg", alt: "Худі IRPIN BRIDGE" },
];

const MAIN = SOCIALS[0];

export function Instagram() {
  return (
    <section className={`theme-light ${styles.section}`} aria-labelledby="ig-title">
      <div className="container">
        <SectionHead
          id="ig-title"
          title="Ми в соцмережах"
          action={
            <ul role="list" className={styles.links}>
              {SOCIALS.slice(0, 3).map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    <Icon name={s.icon} size={20} />
                    {s.handle}
                  </a>
                </li>
              ))}
            </ul>
          }
        />

        <ul role="list" className={styles.grid}>
          {POSTS.map((p) => (
            <li key={p.src}>
              <a href={MAIN.href} target="_blank" rel="noopener noreferrer" className={styles.post}>
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 700px) 50vw, 16vw" className={styles.img} />
                <span className={styles.overlay} aria-hidden="true">
                  <Icon name="instagram" size={32} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
