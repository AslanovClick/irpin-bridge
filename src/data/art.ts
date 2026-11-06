/*
 * ДЕМО-ДАНІ арт-мерчу: митці й колекції вигадані для макета.
 * Нові автори й колекції додаються лише даними — сторінки будуються за шаблонами.
 */

export type Artist = {
  slug: string;
  name: string;
  /** Орудний відмінок для «Колаборація з …» */
  nameWith: string;
  role: string;
  city: string;
  photo?: string;
  photoPosition?: string;
  /** Коротко — для карток */
  short: string;
  bio: string[];
  quote?: string;
  /** Рік початку співпраці зі студією */
  since: string;
  /** Техніки й матеріали — теги на сторінці автора */
  techniques: string[];
  links: { label: string; href: string }[];
};

export type CollectionStatus = "current" | "archive" | "soon";

export type Collection = {
  slug: string;
  title: string;
  artist: string;
  status: CollectionStatus;
  /** Сезон або дата запуску */
  season: string;
  cover: string;
  coverPosition?: string;
  /** Одне речення — для карток і hero */
  lead: string;
  concept: string[];
  /** Палітра колекції — для смужки кольорів */
  palette: string[];
  facts: [string, string][];
  gallery: { src: string; alt: string; caption: string }[];
};

export const STATUS_LABEL: Record<CollectionStatus, string> = {
  current: "Актуальна",
  archive: "Архів",
  soon: "Незабаром",
};

export const ARTISTS: Artist[] = [
  {
    slug: "olena-koval",
    name: "Олена Коваль",
    nameWith: "Оленою Коваль",
    role: "Ілюстраторка",
    city: "Ірпінь",
    photo: "/placeholders/artist.jpg",
    photoPosition: "60% 20%",
    short: "Малює місто, яке відбудовується: двори, парки, річку Ірпінь.",
    bio: [
      "Олена — ілюстраторка з Ірпеня. Після 2022 року почала вести візуальний щоденник міста: замальовувала двори, що відбудовуються, нові лавки в парках, людей, які повертаються додому.",
      "З IRPIN BRIDGE працює з 2025 року: спершу вела майстер-класи для дорослих, потім разом зі студією перетворила щоденник на колекцію одягу.",
    ],
    quote: "Я малюю не руїни, а те, що з'являється на їхньому місці. Хочу, щоб ці кольори носили на вулицях Ірпеня.",
    since: "2025",
    techniques: ["Ілюстрація", "Кольорові олівці", "Гуаш", "Скетчинг"],
    links: [
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "Портфоліо", href: "https://behance.net/" },
    ],
  },
  {
    slug: "iryna-melnyk",
    name: "Ірина Мельник",
    nameWith: "Іриною Мельник",
    role: "Флористка й художниця",
    city: "Буча",
    photo: "/placeholders/workshop-flowers.jpg",
    photoPosition: "50% 30%",
    short: "Перетворює букети на графіку: польові квіти, соняшники, мальви.",
    bio: [
      "Ірина складає букети й малює їх — тушшю, аквареллю, на папері й тканині. У студії IRPIN BRIDGE веде майстер-класи з флористики.",
      "Колекція «Місто квітів» виросла з її замальовок на воркшопах: кожен принт — реальний букет, зібраний учасниками.",
    ],
    quote: "Квіти — найпростіший спосіб сказати, що життя триває.",
    since: "2025",
    techniques: ["Флористика", "Туш", "Акварель"],
    links: [{ label: "Instagram", href: "https://instagram.com/" }],
  },
  {
    slug: "art-maisternia",
    name: "Дитяча арт-майстерня",
    nameWith: "дитячою арт-майстернею",
    role: "Учні 7–12 років",
    city: "Ірпінь",
    photo: "/placeholders/workshop-kids.jpg",
    photoPosition: "50% 50%",
    short: "Малюнки дітей з наших майстер-класів — на справжньому одязі.",
    bio: [
      "Щосуботи в просторі IRPIN BRIDGE працює безкоштовна арт-майстерня для дітей. Тут ліплять, малюють і вигадують персонажів.",
      "Найкращі малюнки сезону ми перетворюємо на принти. Прибуток від колекції повністю йде на матеріали й нові заняття для дітей.",
    ],
    since: "2024",
    techniques: ["Ліплення", "Малюнок", "Персонажі"],
    links: [],
  },
  {
    slug: "sofiia-bondar",
    name: "Софія Бондар",
    nameWith: "Софією Бондар",
    role: "Живописиця",
    city: "Київ",
    photo: "/placeholders/workshop-painting.jpg",
    photoPosition: "60% 30%",
    short: "Теплі інтер'єри й домашні речі в техніці олійного живопису.",
    bio: [
      "Софія пише олією невеликі інтер'єрні сцени: кухні, підвіконня, чашки на столі. Викладає живопис у нашій студії.",
      "Зараз разом з IRPIN BRIDGE готує зимову колекцію «Тепло дому».",
    ],
    since: "2026",
    techniques: ["Олійний живопис", "Інтер'єр", "Натюрморт"],
    links: [{ label: "Instagram", href: "https://instagram.com/" }],
  },
];

export const COLLECTIONS: Collection[] = [
  {
    slug: "kolory-irpenia",
    title: "Кольори Ірпеня",
    artist: "olena-koval",
    status: "current",
    season: "Осінь 2026",
    cover: "/placeholders/artist.jpg",
    coverPosition: "60% 20%",
    lead: "Ілюстрації про місто, яке відбудовується, — кольори дворів, парків і річки на одязі.",
    concept: [
      "Колекція виросла з візуального щоденника Олени Коваль: понад сто замальовок Ірпеня, зроблених за два роки.",
      "Ми обрали шість сюжетів і перенесли їх на одяг без спрощень — з усіма відтінками, лініями олівця й нерівностями паперу. Кожна річ виготовлена в нашій студії обмеженим тиражем.",
    ],
    palette: ["#6C2C91", "#EF65AB", "#EADFBB", "#F9F9F9", "#111111"],
    facts: [
      ["4", "вироби в колекції"],
      ["200", "штук — тираж кожного"],
      ["6", "сюжетів про місто"],
    ],
    gallery: [
      { src: "/placeholders/artist.jpg", alt: "Олена Коваль працює над ілюстрацією", caption: "Ескізи в майстерні" },
      { src: "/placeholders/exhibition.jpg", alt: "Афіша виставки ілюстрацій", caption: "Виставка оригіналів" },
      { src: "/placeholders/posters-wall.jpg", alt: "Плакати колекції на стіні", caption: "Плакати до запуску" },
    ],
  },
  {
    slug: "misto-kvitiv",
    title: "Місто квітів",
    artist: "iryna-melnyk",
    status: "archive",
    season: "Весна 2026",
    cover: "/placeholders/workshop-flowers.jpg",
    coverPosition: "50% 30%",
    lead: "Букети з воркшопів з флористики, перетворені на графіку тушшю.",
    concept: [
      "Навесні в студії пройшло дванадцять майстер-класів з флористики. Ірина Мельник замальовувала кожен букет, зібраний учасниками.",
      "Колекція — це графічний гербарій весни: польові квіти, мальви, соняшники. Принти зроблені DTF-друком, щоб зберегти тонкі лінії туші.",
    ],
    palette: ["#015641", "#D5F266", "#F9F9F9", "#EF65AB"],
    facts: [
      ["2", "вироби в колекції"],
      ["12", "воркшопів"],
      ["150", "штук — тираж"],
    ],
    gallery: [
      { src: "/placeholders/workshop-flowers.jpg", alt: "Ірина Мельник складає букет", caption: "Воркшоп з флористики" },
      { src: "/placeholders/post-flowers.jpg", alt: "Афіша майстер-класу з флористики", caption: "Афіша воркшопу" },
    ],
  },
  {
    slug: "dity-maliuiut-irpin",
    title: "Діти малюють Ірпінь",
    artist: "art-maisternia",
    status: "archive",
    season: "Зима 2026",
    cover: "/placeholders/workshop-kids.jpg",
    lead: "Персонажі й малюнки учнів дитячої майстерні. Прибуток — на нові заняття.",
    concept: [
      "За зиму учні нашої арт-майстерні виліпили й намалювали понад п'ятдесят персонажів. Діти самі обрали найкращих — так з'явилися Левеня, Равлик і Кіт-мандрівник.",
      "Увесь прибуток від колекції йде на матеріали й безкоштовні заняття для дітей Ірпеня.",
    ],
    palette: ["#F77E2D", "#EF65AB", "#4FC6E6", "#D5F266"],
    facts: [
      ["2", "вироби в колекції"],
      ["50+", "дитячих малюнків"],
      ["100%", "прибутку — на заняття"],
    ],
    gallery: [
      { src: "/placeholders/workshop-kids.jpg", alt: "Діти ліплять персонажів з пластиліну", caption: "Заняття в майстерні" },
      { src: "/placeholders/post-kids.jpg", alt: "Афіша дитячого майстер-класу", caption: "Афіша майстер-класу" },
    ],
  },
  {
    slug: "teplo-domu",
    title: "Тепло дому",
    artist: "sofiia-bondar",
    status: "soon",
    season: "Грудень 2026",
    cover: "/placeholders/workshop-painting.jpg",
    coverPosition: "60% 30%",
    lead: "Зимова колекція з олійним живописом: кухні, підвіконня, чашки на столі.",
    concept: [
      "Софія Бондар пише маленькі домашні сцени — те, за чим найбільше сумуєш далеко від дому.",
      "Колекція вийде в грудні: светри з вишивкою й шопери з репродукціями картин. Залиште контакт — повідомимо про старт продажу першими.",
    ],
    palette: ["#EADFBB", "#F77E2D", "#6C2C91", "#111111"],
    facts: [
      ["Грудень", "старт продажу"],
      ["3", "вироби готуємо"],
    ],
    gallery: [{ src: "/placeholders/workshop-painting.jpg", alt: "Софія Бондар за мольбертом", caption: "Робота над серією" }],
  },
];

export function getArtist(slug: string | undefined) {
  return ARTISTS.find((a) => a.slug === slug);
}

export function getCollection(slug: string | undefined) {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** Ім'я автора для карток і пошуку */
export function artistName(slug: string | undefined) {
  return getArtist(slug)?.name;
}

/** Назви кольорів палітри бренду — для підписів у палітрі колекції */
const COLOR_NAMES: Record<string, string> = {
  "#6C2C91": "Фіолетовий",
  "#EF65AB": "Рожевий",
  "#EADFBB": "Пісочний",
  "#F9F9F9": "Білий",
  "#111111": "Чорний",
  "#015641": "Смерековий",
  "#D5F266": "Лайм",
  "#F77E2D": "Помаранчевий",
  "#4FC6E6": "Блакитний",
  "#005EC4": "Синій",
};

export const colorName = (hex: string) => COLOR_NAMES[hex.toUpperCase()] ?? hex;
