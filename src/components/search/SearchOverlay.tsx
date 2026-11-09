"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useId, useImperativeHandle, useMemo, useRef, useState, type KeyboardEvent, type Ref } from "react";
import { CATEGORIES } from "@/data/categories";
/* ДЕМО: поки шукаємо по моках на клієнті; з бекендом — запит до API пошуку */
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/data/types";
import { formatPrice, searchProducts } from "@/lib/catalog";
import { productsWord } from "@/lib/plural";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "./Search.module.css";

export type SearchOverlayHandle = { open: () => void };

const POPULAR_QUERIES = ["Футболка", "Худі", "Шопер", "Кольори Ірпеня", "Вишивка"];
const TILE_THEMES = ["dark", "pine", "blue", "purple", "sand", "lime"];
const RECENT_KEY = "ib-recent-search";

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  try {
    const next = [q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* немає доступу до сховища — не страшно */
  }
}

/** Підсвічуємо знайдені слова в назві */
function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.trim().split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

function Thumb({ p }: { p: Product }) {
  return (
    <span className={styles.thumb} style={!p.images[0] ? { background: p.placeholder?.bg, color: p.placeholder?.fg } : undefined}>
      {p.images[0] ? <Image src={p.images[0].src} alt="" fill sizes="64px" /> : <Logo variant="mark" title="" className={styles.thumbMark} />}
    </span>
  );
}

export function SearchOverlay({ ref }: { ref?: Ref<SearchOverlayHandle> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();
  const uid = useId();

  useImperativeHandle(ref, () => ({
    open: () => {
      setRecent(readRecent());
      dialog.current?.showModal();
      requestAnimationFrame(() => input.current?.select());
    },
  }));

  const query = q.trim();
  const results = useMemo(() => searchProducts(PRODUCTS, query), [query]);
  const cats = useMemo(
    () => (query.length < 2 ? [] : CATEGORIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))),
    [query],
  );
  const shown = results.slice(0, 6);
  const popular = useMemo(() => [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 4), []);

  const close = () => dialog.current?.close();

  const goAll = (text = query) => {
    if (text.length < 2) return;
    saveRecent(text);
    close();
    router.push(`/search?q=${encodeURIComponent(text)}`);
  };

  const openProduct = (p: Product) => {
    if (query.length >= 2) saveRecent(query);
    close();
    router.push(`/product/${p.slug}`);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && shown.length) {
      e.preventDefault();
      setActive((i) => (i + 1) % shown.length);
    } else if (e.key === "ArrowUp" && shown.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? shown.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && shown[active]) openProduct(shown[active]);
      else goAll();
    }
  };

  const clearRecent = () => {
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
    setRecent([]);
  };

  return (
    <dialog
      ref={dialog}
      className={styles.overlay}
      aria-label="Пошук"
      onClick={(e) => e.target === dialog.current && close()}
      onClose={() => setActive(-1)}
    >
      <div className={styles.sheet}>
        <div className={`container ${styles.inner}`}>
          {/* Поле пошуку лишається вгорі, коли гортаємо підказки й результати */}
          <div className={styles.formBar}>
            <div className={styles.form} role="search">
              <Icon name="search" size={24} className={styles.formIcon} />
              <label htmlFor={`${uid}-q`} className="visually-hidden">
                Пошук товарів
              </label>
              <input
                ref={input}
                id={`${uid}-q`}
                type="search"
                autoComplete="off"
                enterKeyHint="search"
                placeholder="Шукати футболки, худі, колекції…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(-1);
                }}
                onKeyDown={onKey}
                role="combobox"
                aria-expanded={shown.length > 0}
                aria-controls={`${uid}-list`}
                aria-activedescendant={active >= 0 ? `${uid}-opt-${active}` : undefined}
              />
              {q && (
                <button type="button" className={styles.clear} onClick={() => (setQ(""), input.current?.focus())} aria-label="Стерти запит" title="Стерти запит">
                  <Icon name="eraser" size={18} />
                </button>
              )}
              <kbd className={styles.kbd}>Esc</kbd>
              <button type="button" className={styles.closeBtn} onClick={close} aria-label="Закрити пошук">
                <Icon name="close" />
              </button>
            </div>
          </div>

          <div className={styles.body} aria-live="polite">
            {query.length < 2 ? (
              <div className={styles.idle}>
                <div className={styles.col}>
                  {recent.length > 0 && (
                    <section>
                      <div className={styles.labelRow}>
                        <p className={styles.label}>Ви шукали</p>
                        <button type="button" className={styles.textBtn} onClick={clearRecent}>
                          Очистити
                        </button>
                      </div>
                      <ul role="list" className={styles.recent}>
                        {recent.map((r) => (
                          <li key={r}>
                            <button type="button" onClick={() => setQ(r)}>
                              <Icon name="return" size={16} />
                              {r}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  <section>
                    <p className={styles.label}>Часто шукають</p>
                    <ul role="list" className={styles.pills}>
                      {POPULAR_QUERIES.map((p) => (
                        <li key={p}>
                          <button type="button" className={styles.pill} onClick={() => setQ(p)}>
                            {p}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <p className={styles.label}>Категорії</p>
                    <ul role="list" className={styles.tiles}>
                      {CATEGORIES.map((c, i) => (
                        <li key={c.slug}>
                          <Link href={`/catalog/${c.slug}`} className={styles.tile} onClick={close}>
                            <span className={`theme-${TILE_THEMES[i % TILE_THEMES.length]} ${styles.tileMark}`}>
                              <Logo variant="mark" title="" />
                            </span>
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className={styles.col}>
                  <section>
                  <p className={styles.label}>Популярні товари</p>
                  <ul role="list" className={styles.popular}>
                    {popular.map((p) => (
                      <li key={p.id}>
                        <Link href={`/product/${p.slug}`} className={styles.result} onClick={close}>
                          <Thumb p={p} />
                          <span className={styles.resultName}>{p.name}</span>
                          <span className={styles.resultPrice}>{formatPrice(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  </section>
                </div>
              </div>
            ) : shown.length === 0 && cats.length === 0 ? (
              <div className={styles.nothing}>
                <p>
                  За запитом «<strong>{query}</strong>» нічого не знайшли.
                </p>
                <p>Спробуйте інше слово — або зробимо річ саме під ваш запит.</p>
                <Link href="/customize" onClick={close} className={styles.allLink}>
                  Створити свій мерч <Icon name="arrow" size={20} />
                </Link>
              </div>
            ) : (
              <>
                {cats.length > 0 && (
                  <ul role="list" className={styles.pills}>
                    {cats.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/catalog/${c.slug}`} className={styles.pill} onClick={close}>
                          Категорія: {c.name} <Icon name="arrow" size={16} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {shown.length > 0 && (
                  <ul role="listbox" id={`${uid}-list`} className={styles.results} aria-label="Знайдені товари">
                    {shown.map((p, i) => {
                      const cat = CATEGORIES.find((c) => c.slug === p.category)?.name;
                      return (
                        <li
                          key={p.id}
                          id={`${uid}-opt-${i}`}
                          role="option"
                          aria-selected={i === active}
                          className={styles.resultItem}
                          onPointerEnter={() => setActive(i)}
                        >
                          <Link
                            href={`/product/${p.slug}`}
                            className={styles.result}
                            tabIndex={-1}
                            onClick={(e) => {
                              e.preventDefault();
                              openProduct(p);
                            }}
                          >
                            <Thumb p={p} />
                            <span className={styles.resultText}>
                              <span className={styles.resultName}>
                                <Highlight text={p.name} query={query} />
                              </span>
                              <span className={styles.resultMeta}>
                                {cat} · {p.colors.length} {p.colors.length === 1 ? "колір" : "кольори"}
                              </span>
                            </span>
                            <span className={styles.resultPrice}>{formatPrice(p.price)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {results.length > 0 && (
                  <div className={styles.footer}>
                    <p className={styles.hint}>
                      <kbd>↑</kbd>
                      <kbd>↓</kbd> вибір · <kbd>Enter</kbd> відкрити
                    </p>
                    <button type="button" className={styles.allLink} onClick={() => goAll()}>
                      Усі результати: {productsWord(results.length)} <Icon name="arrow" size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
