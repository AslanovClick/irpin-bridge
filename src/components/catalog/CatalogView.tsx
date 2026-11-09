"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { ColorOption, Product } from "@/data/types";
import {
  activeCount,
  applyFilters,
  facets as getFacets,
  FLAGS,
  parseFilters,
  serializeFilters,
  SORTS,
  type FilterState,
  type SortKey,
} from "@/lib/filters";
import { productsWord } from "@/lib/plural";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { ProductCard } from "@/components/ui/ProductCard";
import { Select } from "@/components/ui/Select";
import { FilterPanel } from "./FilterPanel";
import styles from "./Catalog.module.css";

const PAGE = 12;
const DEFAULT: FilterState = { sizes: [], colors: [], flags: [], sort: "popular" };

/** Каталог із фільтрами в URL. Обгортати в <Suspense> (useSearchParams). */
export function CatalogView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(params), [params]);

  const onChange = (next: FilterState) => {
    router.replace(`${pathname}${serializeFilters(next)}`, { scroll: false });
  };

  return <CatalogShell products={products} filters={filters} onChange={onChange} />;
}

/** Розмітка каталогу. Без onChange — статична версія для першого рендеру (fallback). */
export function CatalogShell({
  products,
  filters = DEFAULT,
  onChange,
}: {
  products: Product[];
  filters?: FilterState;
  onChange?: (next: FilterState) => void;
}) {
  const facets = useMemo(() => getFacets(products), [products]);
  const list = useMemo(() => applyFilters(products, filters), [products, filters]);
  const queryKey = serializeFilters(filters);
  const [shown, setShown] = useState({ key: queryKey, count: PAGE });
  const count = shown.key === queryKey ? shown.count : PAGE; // скидаємо «Показати ще» при зміні фільтрів
  const visible = list.slice(0, count);
  const active = activeCount(filters);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useCloseOnDesktop(dialogRef);
  const [sentinel, stuck] = useStuck();
  const [sideScroll, sideMore, sideScrolled] = useMoreBelow();

  const reset = () => onChange?.({ ...DEFAULT, sort: filters.sort });

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar} aria-label="Фільтри">
        <div className={styles.sidebarHead}>
          <h2 className={styles.sidebarTitle}>Фільтри</h2>
          {active > 0 && (
            <button type="button" className={styles.resetLink} onClick={reset}>
              Скинути
            </button>
          )}
        </div>
        {/* Прокручувана частина: тонкий скролбар + м’яке затухання знизу, поки є що гортати */}
        <div ref={sideScroll} className={styles.sidebarScroll} data-scrolled={sideScrolled || undefined}>
          <FilterPanel value={filters} facets={facets} onChange={onChange} idPrefix="side" />
        </div>
        <span className={styles.sidebarFade} data-show={sideMore || undefined} aria-hidden="true">
          <Icon name="chevron" size={18} />
        </span>
      </aside>

      <div className={styles.main}>
        {/* Маячок: коли він іде під шапку — панель фільтрів «прилипла», додаємо тінь */}
        <div ref={sentinel} aria-hidden="true" />
        <div className={styles.toolbar} data-stuck={stuck || undefined}>
          <button
            type="button"
            className={styles.filterBtn}
            onClick={() => dialogRef.current?.showModal()}
            aria-haspopup="dialog"
          >
            <Icon name="menu" size={20} />
            Фільтри
            {active > 0 && <span className={styles.filterCount}>{active}</span>}
          </button>

          <p className={styles.total} aria-live="polite">
            {productsWord(list.length)}
          </p>

          <Select<SortKey>
            className={styles.sort}
            label="Сортування"
            value={filters.sort}
            options={SORTS.map((s) => ({ value: s.key, label: s.label }))}
            onChange={(sort) => onChange?.({ ...filters, sort })}
          />
        </div>

        {active > 0 && (
          <ActiveChips filters={filters} colors={facets.colors} onChange={onChange} onReset={reset} />
        )}

        {list.length === 0 ? (
          <div className={styles.empty}>
            <Logo variant="mark" title="" className={styles.emptyMark} />
            <h2>Нічого не знайшли</h2>
            <p>Спробуйте прибрати частину фільтрів — або створимо річ саме під ваш запит.</p>
            <div className="actions">
              <Button onClick={reset} arrow>
                Скинути фільтри
              </Button>
              <Button href="/customize" variant="link">
                Створити свій мерч
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Заголовок для структури сторінки: на мобільному «Фільтри» сховані у висувній панелі */}
            <h2 className="visually-hidden">Товари</h2>
            <ul role="list" className={styles.grid}>
              {visible.map((p, i) => (
                <ListItem key={p.id} product={p} withPromo={i === 5 && active === 0} />
              ))}
            </ul>

            {list.length > count && (
              <div className={styles.more}>
                <p>
                  Показано {count} з {list.length}
                </p>
                <Button variant="outline" onClick={() => setShown({ key: queryKey, count: count + PAGE })}>
                  Показати ще
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Мобільна панель фільтрів */}
      <dialog
        ref={dialogRef}
        className={styles.drawer}
        aria-label="Фільтри"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      >
        <div className={styles.drawerInner}>
          <div className={styles.drawerHead}>
            <h2 className={styles.sidebarTitle}>Фільтри</h2>
            <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()} aria-label="Закрити">
              <Icon name="close" />
            </button>
          </div>
          <div className={styles.drawerBody}>
            <FilterPanel value={filters} facets={facets} onChange={onChange} idPrefix="drawer" />
          </div>
          <div className={styles.drawerFoot}>
            <Button variant="outline" onClick={reset} disabled={active === 0}>
              Скинути
            </Button>
            <Button onClick={() => dialogRef.current?.close()}>Показати {productsWord(list.length)}</Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function ListItem({ product, withPromo }: { product: Product; withPromo: boolean }) {
  return (
    <>
      {withPromo && (
        <li className={styles.promoCell}>
          <Link href="/customize" className={`theme-pine ${styles.promo}`}>
            <Logo variant="mark" title="" className={styles.promoMark} />
            <span className={styles.promoTitle}>Не знайшли потрібне?</span>
            <span className={styles.promoText}>Додамо ваш дизайн на будь-який виріб — від однієї речі.</span>
            <span className={styles.promoGo}>
              Створити свій мерч <Icon name="arrow" size={20} />
            </span>
          </Link>
        </li>
      )}
      <li>
        <ProductCard product={product} sizes="(max-width: 700px) 50vw, (max-width: 1200px) 33vw, 25vw" />
      </li>
    </>
  );
}

function ActiveChips({
  filters,
  colors,
  onChange,
  onReset,
}: {
  filters: FilterState;
  colors: ColorOption[];
  onChange?: (next: FilterState) => void;
  onReset: () => void;
}) {
  const chips: { label: string; remove: () => void }[] = [
    ...filters.sizes.map((s) => ({
      label: `Розмір ${s}`,
      remove: () => onChange?.({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }),
    })),
    ...filters.colors.map((k) => ({
      label: colors.find((c) => c.key === k)?.name ?? k,
      remove: () => onChange?.({ ...filters, colors: filters.colors.filter((x) => x !== k) }),
    })),
    ...(filters.min !== undefined || filters.max !== undefined
      ? [
          {
            label: `${filters.min ?? 0} – ${filters.max ?? "…"} ₴`,
            remove: () => onChange?.({ ...filters, min: undefined, max: undefined }),
          },
        ]
      : []),
    ...filters.flags.map((k) => ({
      label: FLAGS.find((f) => f.key === k)?.label ?? k,
      remove: () => onChange?.({ ...filters, flags: filters.flags.filter((x) => x !== k) }),
    })),
  ];

  return (
    <ul role="list" className={styles.chips} aria-label="Активні фільтри">
      {chips.map((c) => (
        <li key={c.label}>
          <button type="button" className={styles.chip} onClick={c.remove} aria-label={`Прибрати: ${c.label}`}>
            {c.label}
            <Icon name="close" size={14} />
          </button>
        </li>
      ))}
      <li>
        <button type="button" className={styles.resetLink} onClick={onReset}>
          Скинути все
        </button>
      </li>
    </ul>
  );
}

/** Закриваємо діалог, якщо екран розширили до десктопу */
/** Чи є ще вміст нижче в прокручуваному блоці — для підказки-затухання */
function useMoreBelow() {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
      setScrolled(el.scrollTop > 4);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, []);
  return [ref, more, scrolled] as const;
}

/** Чи прилипла панель до шапки (на мобільному вона sticky) */
function useStuck() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(false);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    // Відступ прилипання панелі = шапка + смуга категорій (береться з її власного top)
    const bar = el.nextElementSibling;
    const top = (bar && parseFloat(getComputedStyle(bar).top)) || 72;
    const io = new IntersectionObserver(([e]) => setValue(!e.isIntersecting && e.boundingClientRect.top < top + 1), {
      rootMargin: `-${top + 1}px 0px 0px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [sentinel, value] as const;
}

function useCloseOnDesktop(ref: RefObject<HTMLDialogElement | null>) {
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1001px)");
    const onChange = () => mq.matches && ref.current?.close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [ref]);
}
