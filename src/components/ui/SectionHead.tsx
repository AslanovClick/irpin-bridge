import type { ReactNode } from "react";
import { Logo } from "./Logo";
import styles from "./SectionHead.module.css";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Дія праворуч від заголовка (посилання «Усі …», таби) */
  action?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  /** Без нижнього відступу — коли шапка стоїть у колонці поруч із медіа */
  flush?: boolean;
  /** Підзаголовок праворуч, на рівні заголовка (на мобільному — під ним) */
  split?: boolean;
};

/** Єдина шапка секції: надзаголовок зі знаком → заголовок → лід. */
export function SectionHead({ eyebrow, title, lead, action, id, as: Tag = "h2", flush = false, split = false }: Props) {
  return (
    <header className={[styles.head, flush && styles.flush, split && styles.split].filter(Boolean).join(" ")}>
      <div className={styles.text}>
        {eyebrow && (
          <p className={styles.eyebrow}>
            <Logo variant="mark" title="" className={styles.mark} />
            {eyebrow}
          </p>
        )}
        <Tag id={id} className={styles.title}>
          {title}
        </Tag>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </header>
  );
}
