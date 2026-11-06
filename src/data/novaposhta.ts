/*
 * ДЕМО: міста й відділення Нової пошти для макета.
 * У продакшені — запити до API Нової пошти (Address.searchSettlements, Address.getWarehouses) через наш бекенд.
 */
export type NpCity = { ref: string; name: string; region: string };
export type NpPoint = { ref: string; kind: "branch" | "locker"; number: number; address: string; note?: string };

export const NP_CITIES: NpCity[] = [
  { ref: "kyiv", name: "Київ", region: "Київська обл." },
  { ref: "irpin", name: "Ірпінь", region: "Київська обл." },
  { ref: "bucha", name: "Буча", region: "Київська обл." },
  { ref: "hostomel", name: "Гостомель", region: "Київська обл." },
  { ref: "brovary", name: "Бровари", region: "Київська обл." },
  { ref: "lviv", name: "Львів", region: "Львівська обл." },
  { ref: "kharkiv", name: "Харків", region: "Харківська обл." },
  { ref: "odesa", name: "Одеса", region: "Одеська обл." },
  { ref: "dnipro", name: "Дніпро", region: "Дніпропетровська обл." },
  { ref: "vinnytsia", name: "Вінниця", region: "Вінницька обл." },
  { ref: "zhytomyr", name: "Житомир", region: "Житомирська обл." },
  { ref: "poltava", name: "Полтава", region: "Полтавська обл." },
  { ref: "chernihiv", name: "Чернігів", region: "Чернігівська обл." },
  { ref: "ivano-frankivsk", name: "Івано-Франківськ", region: "Івано-Франківська обл." },
  { ref: "uzhhorod", name: "Ужгород", region: "Закарпатська обл." },
];

const STREETS = [
  "вул. Соборна",
  "вул. Шевченка",
  "просп. Незалежності",
  "вул. Університетська",
  "вул. Садова",
  "вул. Мечникова",
  "вул. Київська",
  "бульв. Т. Шевченка",
];

/** Детерміновано генеруємо відділення й поштомати для міста */
export function getPoints(cityRef: string, kind: NpPoint["kind"]): NpPoint[] {
  const seed = [...cityRef].reduce((s, c) => s + c.charCodeAt(0), 0);
  const count = kind === "branch" ? 8 + (seed % 6) : 6 + (seed % 5);
  return Array.from({ length: count }, (_, i) => {
    const street = STREETS[(seed + i * 3) % STREETS.length];
    const house = ((seed * (i + 3)) % 140) + 1;
    const number = kind === "branch" ? i + 1 : 1000 + ((seed + i * 37) % 9000);
    return {
      ref: `${cityRef}-${kind}-${number}`,
      kind,
      number,
      address: `${street}, ${house}`,
      note: kind === "branch" ? (i % 3 === 0 ? "до 30 кг" : "до 1000 кг") : "цілодобово",
    };
  });
}

export const pointLabel = (p: NpPoint) =>
  `${p.kind === "branch" ? "Відділення" : "Поштомат"} №${p.number}: ${p.address}`;
