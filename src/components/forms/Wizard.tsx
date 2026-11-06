"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import styles from "./Forms.module.css";

export type WizardStep = {
  id: string;
  title: string;
  /** Короткий підсумок кроку для бічної панелі (якщо вже заповнено) */
  summary?: string | null;
  /** Повертає текст помилки або null */
  validate?: () => string | null;
  content: ReactNode;
};

type Props = {
  steps: WizardStep[];
  onSubmit: () => Promise<void> | void;
  submitLabel?: string;
  aside?: ReactNode;
  /** Відновлено з чернетки — показати плашку */
  restored?: boolean;
  onReset?: () => void;
};

const STATE_LABEL = { done: "Готово", current: "Зараз", todo: "Далі" } as const;

/** Покрокова форма: прогрес, «Назад / Далі», перевірка кожного кроку, бічна панель з підсумком */
export function Wizard({ steps, onSubmit, submitLabel = "Надіслати заявку", aside, restored, onReset }: Props) {
  const [current, setCurrent] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const last = current === steps.length - 1;
  const step = steps[current];

  const scrollTop = () =>
    requestAnimationFrame(() => {
      const el = top.current;
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > y) window.scrollTo({ top: y, behavior: "smooth" });
    });

  const goTo = (i: number) => {
    setError(null);
    setCurrent(i);
    scrollTop();
  };

  const next = async (e?: FormEvent) => {
    e?.preventDefault();
    const err = step.validate?.() ?? null;
    setError(err);
    if (err) return;
    if (!last) {
      setMaxReached((m) => Math.max(m, current + 1));
      goTo(current + 1);
      return;
    }
    setSending(true);
    try {
      await onSubmit();
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={top} className={styles.wizard}>
      <form className={styles.wizardMain} onSubmit={next} noValidate>
        {/* Прогрес: кроки з назвами — видно, де ви і що попереду */}
        <ol className={styles.stepper} aria-label="Кроки заявки">
          {steps.map((s, i) => {
            const state = i < current ? "done" : i === current ? "current" : "todo";
            return (
              <li key={s.id} data-state={state}>
                <button
                  type="button"
                  onClick={() => i <= maxReached && goTo(i)}
                  disabled={i > maxReached}
                  aria-current={i === current ? "step" : undefined}
                >
                  <span className={styles.stepperNum}>{state === "done" ? <Icon name="check" size={16} /> : i + 1}</span>
                  <span className={styles.stepperText}>
                    <span className={styles.stepperOf}>
                      {STATE_LABEL[state]}
                      <span className={styles.stepperCount}>
                        {" "}
                        · {i + 1} / {steps.length}
                      </span>
                    </span>
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {restored && current === 0 && (
          <div className={styles.restored}>
            <span>Ми зберегли вашу чернетку — можна продовжити з того ж місця.</span>
            {onReset && (
              <button type="button" onClick={onReset}>
                Почати заново
              </button>
            )}
          </div>
        )}

        <fieldset className={styles.stepBody} key={step.id}>
          <legend className="visually-hidden">
            Крок {current + 1}: {step.title}
          </legend>
          {step.content}
        </fieldset>

        {error && (
          <p className={styles.stepError} role="alert">
            <Icon name="close" size={16} /> {error}
          </p>
        )}

        <div className={styles.nav}>
          {current > 0 ? (
            <button type="button" className={styles.back} onClick={() => goTo(current - 1)}>
              <Icon name="arrow" size={18} style={{ transform: "rotate(180deg)" }} />
              Назад
            </button>
          ) : (
            <span />
          )}
          <Button type="submit" size="lg" arrow disabled={sending}>
            {sending ? "Надсилаємо…" : last ? submitLabel : "Далі"}
          </Button>
        </div>
      </form>

      <aside className={styles.wizardAside} aria-label="Ваша заявка">
        <p className={styles.asideTitle}>Ваша заявка</p>
        <ol role="list" className={styles.asideSteps}>
          {steps.map((s, i) => (
            <li key={s.id} data-state={i < current ? "done" : i === current ? "current" : "todo"}>
              <button type="button" onClick={() => i <= maxReached && goTo(i)} disabled={i > maxReached}>
                <span className={styles.asideNum}>{i < current ? <Icon name="check" size={14} /> : i + 1}</span>
                <span className={styles.asideText}>
                  <strong>{s.title}</strong>
                  {s.summary && <span>{s.summary}</span>}
                </span>
              </button>
            </li>
          ))}
        </ol>
        {aside}
      </aside>
    </div>
  );
}
