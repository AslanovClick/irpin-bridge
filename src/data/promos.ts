/*
 * ДЕМО: промокоди. Справжня перевірка — на бекенді (адмін створює коди без розробника).
 * Для перевірки макета: IRPIN10 (−10%), BRIDGE200 (−200 ₴ від 1500 ₴).
 */
export type Promo = { code: string; type: "percent" | "fixed"; value: number; label: string };

const CODES: (Promo & { minTotal?: number })[] = [
  { code: "IRPIN10", type: "percent", value: 10, label: "−10% на замовлення" },
  { code: "BRIDGE200", type: "fixed", value: 200, label: "−200 ₴ від 1 500 ₴", minTotal: 1500 },
];

export function checkPromo(raw: string, subtotal: number): Promo | string {
  const code = raw.trim().toUpperCase();
  if (!code) return "Введіть промокод";
  const found = CODES.find((c) => c.code === code);
  if (!found) return "Такого промокоду немає або його термін дії минув";
  if (found.minTotal && subtotal < found.minTotal) return `Промокод діє від ${found.minTotal} ₴`;
  return { code: found.code, type: found.type, value: found.value, label: found.label };
}
