"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product, ProductImage } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "./Product.module.css";

type Props = { product: Product; images: ProductImage[] };

/** Галерея: мініатюри + головне фото (десктоп), свайп-стрічка (мобільний), повноекранний перегляд */
export function Gallery({ product, images }: Props) {
  const [active, setActive] = useState(0);
  const [imagesKey, setImagesKey] = useState(images);
  const track = useRef<HTMLDivElement>(null);
  const lightbox = useRef<HTMLDialogElement>(null);
  const lbTrack = useRef<HTMLDivElement>(null);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // Змінився колір → набір фото інший → на перше фото
  if (imagesKey !== images) {
    setImagesKey(images);
    setActive(0);
  }

  // Ширина кроку стрічки: слайд + проміжок (на мобільному слайди вужчі за екран)
  const stepWidth = (el: HTMLDivElement) => {
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return (first?.offsetWidth ?? el.clientWidth) + gap;
  };

  // Мобільна стрічка: який слайд зараз у кадрі
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setActive(Math.round(el.scrollLeft / stepWidth(el)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * Повноекранний перегляд має власну стрічку: перемикання — плавний скрол усередині неї,
   * основна галерея під модалкою не рухається (раніше саме це давало «смикання»).
   */
  const openLightbox = (i: number) => {
    setLbIndex(i);
    setLbOpen(true);
    lightbox.current?.showModal();
    requestAnimationFrame(() => {
      const el = lbTrack.current;
      if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "instant" });
    });
  };

  const lbGo = (i: number) => {
    const el = lbTrack.current;
    if (!el) return;
    const next = (i + images.length) % images.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onLightboxClose = () => {
    setLbOpen(false);
    setActive(lbIndex);
    const el = track.current;
    if (el) el.scrollTo({ left: lbIndex * stepWidth(el), behavior: "instant" });
  };

  const go = (i: number) => {
    const next = (i + images.length) % images.length;
    setActive(next);
    if (track.current) track.current.scrollTo({ left: next * stepWidth(track.current), behavior: "smooth" });
  };

  if (images.length === 0) {
    return (
      <div className={styles.gallery}>
        <div
          className={styles.placeholder}
          style={{ background: product.placeholder?.bg ?? "var(--c-gray-100)", color: product.placeholder?.fg }}
        >
          <Logo variant="mark" title="" className={styles.placeholderMark} />
          <span className={styles.placeholderNote}>Фото незабаром</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {images.length > 1 && (
        <ul role="list" className={styles.thumbs} aria-label="Фото товару">
          {images.map((img, i) => (
            <li key={img.src + i}>
              <button
                type="button"
                className={styles.thumb}
                aria-pressed={i === active}
                aria-label={`Фото ${i + 1}`}
                onClick={() => go(i)}
              >
                <Image src={img.src} alt="" fill sizes="88px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.stage}>
        <div ref={track} className={styles.track}>
          {images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              className={styles.slide}
              onClick={() => openLightbox(i)}
              aria-label={`Відкрити фото ${i + 1} на весь екран`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
              />
            </button>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <p className={styles.counter} aria-hidden="true">
              {active + 1} / {images.length}
            </p>
            <div className={styles.arrows}>
              <button type="button" onClick={() => go(active - 1)} aria-label="Попереднє фото">
                <Icon name="arrow" size={20} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button type="button" onClick={() => go(active + 1)} aria-label="Наступне фото">
                <Icon name="arrow" size={20} />
              </button>
            </div>
          </>
        )}

        <span className={styles.zoomHint} aria-hidden="true">
          <Icon name="expand" size={18} />
        </span>
      </div>

      {/* Мобільний індикатор: смужки замість лічильника — видно, що фото можна гортати */}
      {images.length > 1 && (
        <div className={styles.dots} aria-hidden="true">
          {images.map((img, i) => (
            <span key={img.src + i} data-active={i === active || undefined} />
          ))}
        </div>
      )}

      <dialog
        ref={lightbox}
        className={styles.lightbox}
        aria-label="Перегляд фото"
        onClose={onLightboxClose}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") lbGo(lbIndex + 1);
          if (e.key === "ArrowLeft") lbGo(lbIndex - 1);
        }}
      >
        {lbOpen && (
          <div
            ref={lbTrack}
            className={styles.lbTrack}
            onScroll={(e) => {
              const el = e.currentTarget;
              setLbIndex(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            {images.map((img, i) => (
              <div key={img.src + i} className={styles.lbSlide}>
                <Image src={img.src} alt={img.alt} fill sizes="100vw" loading={Math.abs(i - lbIndex) <= 1 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        )}
        <button type="button" className={styles.lightboxClose} onClick={() => lightbox.current?.close()} aria-label="Закрити">
          <Icon name="close" />
        </button>
        {images.length > 1 && (
          <div className={styles.lightboxNav}>
            <button type="button" onClick={() => lbGo(lbIndex - 1)} aria-label="Попереднє фото">
              <Icon name="arrow" style={{ transform: "rotate(180deg)" }} />
            </button>
            <span aria-live="polite">
              {lbIndex + 1} / {images.length}
            </span>
            <button type="button" onClick={() => lbGo(lbIndex + 1)} aria-label="Наступне фото">
              <Icon name="arrow" />
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
