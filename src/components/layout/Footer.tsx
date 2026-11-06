import Image from "next/image";
import Link from "next/link";
import { CONTACTS, FOOTER_COLUMNS, SOCIALS } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { CookieSettingsLink } from "./CookieConsent";
import { ModalTrigger } from "@/components/forms/RequestModal";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`theme-dark ${styles.footer}`}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo} aria-label="IRPIN BRIDGE — на головну">
              <Logo variant="full" title="IRPIN BRIDGE Art Center" />
            </Link>
            <p className={styles.motto}>
              Створюємо речі.
              <br />
              Створюємо можливості.
            </p>
          </div>

          <div className={styles.cols}>
            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title} className={styles.col}>
                <h2 className={styles.colTitle}>{col.title}</h2>
                <ul role="list">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className={styles.middle}>
          <address className={styles.contacts}>
            <p>{CONTACTS.address}</p>
            <p>
              <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
            </p>
            <p>
              <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
            </p>
            <p className={styles.muted}>{CONTACTS.hours}</p>
            <ModalTrigger kind="callback" size="sm" arrow className={styles.callback}>
              Передзвоніть мені
            </ModalTrigger>
          </address>

          <div>
            <h2 className={styles.colTitle}>Ми в соцмережах</h2>
            <ul role="list" className={styles.socials}>
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    <Icon name={s.icon} size={20} />
                    <span>
                      <span className={styles.socialHandle}>{s.handle}</span>
                      <span className={styles.muted}>{s.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.fund}>
            <Image
              src="/brand/ednist-svitu.png"
              alt="Логотип БФ «Єдність світу»"
              width={64}
              height={59}
              className={styles.fundLogo}
            />
            <p>
              Соціальне підприємство
              <br />
              <strong>БФ «Єдність світу»</strong>
              <span className={styles.muted}> · ЄДРПОУ 44674004</span>
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © 2026 IRPIN BRIDGE. ТМ належить БФ «Єдність світу».{" "}
            <CookieSettingsLink className={styles.cookieLink}>Налаштування cookies</CookieSettingsLink>
          </p>
          <p className={styles.pay}>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
