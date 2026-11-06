import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./ShapeImage.module.css";

type ShapeImageProps = {
  src: string;
  alt: string;
  /**
   * Форма-контейнер зі знака логотипа — два прямокутники, що перетинаються.
   * a — виріз зверху ліворуч і знизу праворуч (як у шаблонах постів),
   * b — дзеркально, tr / tl / br — один виріз у куті (для портретів), rect — без вирізів.
   */
  shape?: "a" | "b" | "tr" | "tl" | "br" | "bl" | "rect";
  /** Співвідношення сторін, напр. "4 / 5" */
  ratio?: string;
  /** Розмір вирізів у відсотках: [ширина, висота] */
  notch?: [number, number];
  sizes?: string;
  /** Фото над згином (LCP): завантажити одразу з високим пріоритетом */
  eager?: boolean;
  className?: string;
  objectPosition?: string;
};

export function ShapeImage({
  src,
  alt,
  shape = "a",
  ratio = "4 / 5",
  notch = [30, 18],
  sizes = "(max-width: 900px) 100vw, 50vw",
  eager = false,
  className,
  objectPosition,
}: ShapeImageProps) {
  const style = {
    "--ratio": ratio,
    "--nx": `${notch[0]}%`,
    "--ny": `${notch[1]}%`,
  } as CSSProperties;

  return (
    <div className={[styles.wrap, styles[`shape-${shape}`], className].filter(Boolean).join(" ")} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className={styles.img}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
