/** Модель даних фронтенду. Поки наповнюється моками, потім — з API. */

/** key — латиниця для URL-фільтрів (?color=black) */
export type ColorOption = { key: string; name: string; hex: string };

export type ProductImage = { src: string; alt: string; color?: string };

export type ProductVariant = { color: string; size: string; stock: number };

export type ProductBadge = "new" | "hit" | "art" | "custom" | "sale";

export type Category = {
  slug: string;
  name: string;
  /** Коротке пояснення під заголовком категорії */
  intro: string;
  /** SEO-текст унизу сторінки категорії */
  seo?: string;
  sizeChart?: SizeChartKey;
};

export type SizeChartKey = "tee" | "hoodie" | "sweatshirt" | "pants";

export type SizeChart = {
  title: string;
  note: string;
  columns: string[];
  rows: { size: string; values: (string | number)[] }[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  oldPrice?: number;
  colors: ColorOption[];
  sizes: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  badges: ProductBadge[];
  customizable: boolean;
  collection?: string;
  artist?: string;
  /** Заглушка, поки немає фото: колір фону й знака */
  placeholder?: { bg: string; fg: string };
  description: string;
  material: string;
  care: string[];
  /** Для сортування «Популярні» (більше — вище) */
  popularity: number;
  /** ISO-дата появи — для сортування «Новинки» */
  createdAt: string;
};

export type Theme = "light" | "dark" | "pine" | "lime" | "blue" | "purple" | "sand" | "orange";
