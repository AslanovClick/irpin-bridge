import type { Theme } from "./types";

/** Адреса сайту для sitemap, canonical і schema.org. ДЕМО-домен — задати NEXT_PUBLIC_SITE_URL при деплої */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://irpin-bridge.com.ua").replace(/\/$/, "");

export type NavItem = {
  label: string;
  href: string;
  theme?: Theme;
  /** Короткий підпис у мобільному меню */
  note?: string;
  children?: { label: string; href: string; note?: string }[];
};

export const NAV: NavItem[] = [
  { label: "Каталог", href: "/catalog", theme: "dark", note: "Одяг і аксесуари" },
  {
    label: "Послуги",
    href: "/services",
    theme: "pine",
    note: "Друк, вишивка, кастомізація",
    children: [
      { label: "DTF-друк", href: "/services/dtf-druk", note: "Повноколірний друк на будь-якому текстилі" },
      { label: "Машинна вишивка", href: "/services/vyshyvka", note: "Логотипи, написи, зображення" },
      { label: "Кастомізація", href: "/customize", note: "Ваш дизайн на готовому виробі" },
    ],
  },
  { label: "Бізнес-мерч", href: "/business", theme: "blue", note: "Мерч для компаній" },
  { label: "Арт-мерч", href: "/art", theme: "purple", note: "Колаборації з митцями" },
  { label: "Про нас", href: "/about", theme: "sand" },
  { label: "Контакти", href: "/contacts" },
];

/** ДЕМО: телефон і години — уточнити в замовника */
export const CONTACTS = {
  address: "м. Ірпінь, вул. Мечникова, 109А",
  phone: "+380 00 000 00 00",
  phoneHref: "tel:+380000000000",
  email: "irpinbridge@gmail.com",
  hours: "Пн–Пт 10:00–19:00, Сб 11:00–16:00",
};

/** Графік роботи: 0 — неділя … 6 — субота; null — вихідний */
export const SCHEDULE: { days: string; from?: string; to?: string; idx: number[] }[] = [
  { days: "Понеділок – п'ятниця", from: "10:00", to: "19:00", idx: [1, 2, 3, 4, 5] },
  { days: "Субота", from: "11:00", to: "16:00", idx: [6] },
  { days: "Неділя", idx: [0] },
];

export const SOCIALS = [
  { label: "IRPIN BRIDGE Studio", handle: "@irpin.bridge.studio", href: "https://instagram.com/irpin.bridge.studio", icon: "instagram" },
  { label: "IRPIN BRIDGE Art", handle: "@irpin.bridge.art", href: "https://instagram.com/irpin.bridge.art", icon: "instagram" },
  { label: "IRPIN BRIDGE", handle: "facebook.com/irpinbridge", href: "https://facebook.com/irpinbridge", icon: "facebook" },
  { label: "БФ «Єдність світу»", handle: "@ednist_svitu", href: "https://instagram.com/ednist_svitu", icon: "instagram" },
  { label: "БФ «Єдність світу»", handle: "facebook.com/ednistsvitu", href: "https://facebook.com/ednistsvitu", icon: "facebook" },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Магазин",
    links: [
      { label: "Футболки", href: "/catalog/futbolky" },
      { label: "Худі", href: "/catalog/khudi" },
      { label: "Світшоти та реглани", href: "/catalog/svitshoty" },
      { label: "Шопери", href: "/catalog/shopery" },
      { label: "Аксесуари", href: "/catalog/aksesuary" },
    ],
  },
  {
    title: "Послуги",
    links: [
      { label: "DTF-друк", href: "/services/dtf-druk" },
      { label: "Машинна вишивка", href: "/services/vyshyvka" },
      { label: "Кастомізація", href: "/customize" },
      { label: "Бізнес-мерч", href: "/business" },
    ],
  },
  {
    title: "IRPIN BRIDGE",
    links: [
      { label: "Про нас", href: "/about" },
      { label: "Арт-мерч", href: "/art" },
      { label: "Співпраця для митців", href: "/art#collab" },
      { label: "Контакти", href: "/contacts" },
    ],
  },
  {
    title: "Покупцям",
    links: [
      { label: "Оплата й доставка", href: "/info/payment-delivery" },
      { label: "Обмін і повернення", href: "/info/returns" },
      { label: "Публічна оферта", href: "/info/oferta" },
      { label: "Політика конфіденційності", href: "/info/privacy" },
      { label: "Cookies", href: "/info/cookies" },
      { label: "Реквізити", href: "/info/requisites" },
    ],
  },
];
