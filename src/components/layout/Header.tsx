"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CONTACTS, NAV, SOCIALS } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { SearchOverlay, type SearchOverlayHandle } from "@/components/search/SearchOverlay";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";
import { RequestModal } from "@/components/forms/RequestModal";
import { openRequestModal } from "@/lib/requests";
import { openCartDrawer, useCartCount } from "@/lib/cart";
import styles from "./Header.module.css";

/** Другорядні посилання мобільного меню */
const SECONDARY = [
  { label: "Про нас", note: "Студія й місія", href: "/about", icon: "pin" as const },
  { label: "Контакти", note: "Адреса, години", href: "/contacts", icon: "phone" as const },
  { label: "Доставка", note: "Нова пошта", href: "/info/payment-delivery", icon: "truck" as const },
  { label: "Повернення", note: "14 днів", href: "/info/returns", icon: "return" as const },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const [panelTop, setPanelTop] = useState(0);
  const [svcOpen, setSvcOpen] = useState(false);
  // Після кліку в меню «Послуги» ховаємо випадайку, доки курсор не залишить пункт (інакше :hover/:focus тримають її відкритою)
  const [dropClosed, setDropClosed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<SearchOverlayHandle>(null);
  const cartCount = useCartCount();

  // Закриваємо меню при переході на іншу сторінку
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Гарячі клавіші пошуку: «/» або Ctrl/⌘ + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
      if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        searchRef.current?.open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => {
    // Панель відкривається рівно під шапкою (над нею може бути смуга оголошення)
    setPanelTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeDrop = (e: { currentTarget: HTMLElement }) => {
    e.currentTarget.blur();
    setDropClosed(true);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header ref={headerRef} className={[styles.header, scrolled && styles.scrolled].filter(Boolean).join(" ")}>
        <div className={`container ${styles.inner}`}>
          <Link href="/" className={styles.logo} aria-label="IRPIN BRIDGE — на головну">
            <Logo variant="compact" />
          </Link>

          <nav aria-label="Головне меню" className={styles.nav}>
            <ul role="list" className={styles.navList}>
              {NAV.map((item) => (
                <li
                  key={item.href}
                  className={item.children ? styles.hasDrop : undefined}
                  data-closed={(item.children && dropClosed) || undefined}
                  onMouseLeave={item.children ? () => setDropClosed(false) : undefined}
                >
                  <Link
                    href={item.href}
                    onClick={item.children ? closeDrop : undefined}
                    className={styles.navLink}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                    {item.children && <Icon name="chevron" size={16} className={styles.chev} />}
                  </Link>
                  {item.children && (
                    <div className={styles.drop}>
                      <ul role="list" className={`theme-pine ${styles.dropList}`}>
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className={styles.dropLink} onClick={closeDrop}>
                              <span className={styles.dropTitle}>{c.label}</span>
                              {c.note && <span className={styles.dropNote}>{c.note}</span>}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href="/services" className={styles.dropAll} onClick={closeDrop}>
                            Усі послуги <Icon name="arrow" size={18} />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Button href="/#request" size="sm" className={styles.cta}>
              Розрахувати вартість
            </Button>
            <Link
              href="/search"
              className={styles.iconBtn}
              aria-label="Пошук"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                searchRef.current?.open();
              }}
            >
              <Icon name="search" />
            </Link>
            <Link
              href="/cart"
              className={styles.iconBtn}
              aria-label={`Кошик, товарів: ${cartCount}`}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                openCartDrawer();
              }}
            >
              <Icon name="bag" />
              {cartCount > 0 && (
                <span className={styles.count} aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.burger}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Закрити меню" : "Відкрити меню"}
              onClick={toggle}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      {/* Поза <header>: backdrop-filter шапки інакше «ламає» position: fixed панелі */}
        <div
          id="mobile-menu"
          className={styles.panel}
          data-open={open}
          hidden={!open}
          style={{ "--panel-top": `${panelTop}px` } as CSSProperties}
        >
          <nav aria-label="Мобільне меню" className={`container ${styles.panelInner}`}>
            <button
              type="button"
              className={styles.mSearch}
              onClick={() => {
                setOpen(false);
                searchRef.current?.open();
              }}
            >
              <Icon name="search" size={20} />
              Пошук товарів…
            </button>

            {/* Основні розділи — з кольором своєї пари */}
            <ul role="list" className={styles.mList}>
              {NAV.filter((i) => i.note).map((item) => (
                <li key={item.href} className={styles.mItem}>
                  <div className={styles.mRow}>
                    <Link href={item.href} className={styles.mLink} aria-current={isActive(item.href) ? "page" : undefined}>
                      <span className={`${styles.mTile} theme-${item.theme ?? "light"}`} aria-hidden="true">
                        <Logo variant="mark" title="" />
                      </span>
                      <span className={styles.mText}>
                        <span className={styles.mLabel}>{item.label}</span>
                        <span className={styles.mNote}>{item.note}</span>
                      </span>
                    </Link>
                    {item.children ? (
                      <button
                        type="button"
                        className={styles.mToggle}
                        aria-expanded={svcOpen}
                        aria-controls="m-services"
                        aria-label={svcOpen ? "Згорнути послуги" : "Розгорнути послуги"}
                        onClick={() => setSvcOpen((v) => !v)}
                      >
                        <Icon name="chevron" size={22} />
                      </button>
                    ) : (
                      <Icon name="arrow" size={22} className={styles.mArrow} />
                    )}
                  </div>
                  {item.children && (
                    <ul role="list" id="m-services" className={styles.mSub} hidden={!svcOpen}>
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href}>
                            <span>{c.label}</span>
                            {c.note && <span className={styles.mNote}>{c.note}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* Другорядні посилання */}
            <div className={styles.mSecondary}>
              <p className={styles.mSecTitle}>Корисне</p>
              <ul role="list">
                {SECONDARY.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
                      <span className={styles.mSecIcon}>
                        <Icon name={l.icon} size={18} />
                      </span>
                      <span className={styles.mSecText}>
                        <strong>{l.label}</strong>
                        <span>{l.note}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`theme-lime ${styles.mFoot}`}>
              <p className={styles.mFootTitle}>Маєте ідею? Розрахуємо вартість</p>
              <div className={styles.mContacts}>
                <a href={CONTACTS.phoneHref}>
                  <Icon name="phone" size={18} /> {CONTACTS.phone}
                </a>
                <button
                  type="button"
                  className={styles.mCallback}
                  onClick={() => {
                    setOpen(false);
                    openRequestModal("callback");
                  }}
                >
                  Передзвоніть мені
                </button>
                <ul role="list" className={styles.mSocials}>
                  {SOCIALS.slice(0, 3).map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} — ${s.handle}`}>
                        <Icon name={s.icon} size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <Button href="/#request" block arrow>
                Залишити заявку
              </Button>
            </div>
          </nav>
        </div>
      <SearchOverlay ref={searchRef} />
      <CartDrawer />
      <CartToast />
      <RequestModal />
    </>
  );
}
