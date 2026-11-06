import type { Product } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { ModalTrigger } from "@/components/forms/RequestModal";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { ShapeImage } from "@/components/ui/ShapeImage";
import styles from "./Collab.module.css";

/* ДЕМО: колекція й авторка вигадані для макета */
export function Collab({ products }: { products: Product[] }) {
  return (
    <section className="theme-purple section" aria-labelledby="collab-title">
      <div className="container">
        <SectionHead
          id="collab-title"
          title="Кольори Ірпеня"
          lead="Актуальна колаборація з художницею Оленою Коваль: ілюстрації про місто, яке відбудовується, — кольори дворів, парків і річки на одязі."
          action={
            <Button href="/art" variant="link" arrow>
              Усі колаборації
            </Button>
          }
        />

        <ul role="list" className={styles.grid}>
          <li className={styles.artist}>
            <ShapeImage
              src="/placeholders/artist.jpg"
              alt="Авторка колекції Олена Коваль біля мольберта"
              shape="br"
              ratio="4 / 5"
              notch={[24, 14]}
              objectPosition="60% 20%"
              sizes="(max-width: 900px) 60vw, 22vw"
            />
            <div className={styles.artistBody}>
              <p className={styles.artistRole}>Авторка колекції</p>
              <p className={styles.artistName}>Олена Коваль</p>
              <Button href="/art/collections/kolory-irpenia" arrow block>
                Дивитися колекцію
              </Button>
            </div>
          </li>
          {products.slice(0, 3).map((p) => (
            <li key={p.id}>
              <ProductCard product={p} tone="onColor" sizes="(max-width: 900px) 60vw, 22vw" />
            </li>
          ))}
        </ul>

        <div className={styles.note}>
          <p>Ви митець? Створімо колекцію разом — від ідеї до готового мерчу.</p>
          <ModalTrigger kind="artist" variant="link" arrow>
            Запропонувати співпрацю
          </ModalTrigger>
        </div>
      </div>
    </section>
  );
}
