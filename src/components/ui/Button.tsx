import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./Button.module.css";

type Variant = "primary" | "outline" | "link";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Стрілка праворуч — фірмовий маркер дії */
  arrow?: boolean;
  block?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export type ButtonProps = AsLink | AsButton;

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  block = false,
  children,
  className,
  ...rest
}: ButtonProps) {
  const cls = [styles.btn, styles[variant], styles[size], block && styles.block, className].filter(Boolean).join(" ");
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Icon name="arrow" size={size === "lg" ? 22 : 20} className={styles.arrow} />}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link className={cls} data-variant={variant} {...rest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<AsButton, keyof CommonProps>;
  return (
    <button type={type} className={cls} data-variant={variant} {...buttonRest}>
      {content}
    </button>
  );
}
