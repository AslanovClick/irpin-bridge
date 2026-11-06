"use client";

import { useId, useRef } from "react";
import type { SizeChart } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import styles from "./Product.module.css";

/** Кнопка «Таблиця розмірів» + модальне вікно з таблицею (підсвічує обраний розмір) */
export function SizeChartButton({ chart, highlight, className }: { chart: SizeChart; highlight?: string | null; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  return (
    <>
      <button type="button" className={className ?? styles.chartLink} onClick={() => ref.current?.showModal()}>
        Таблиця розмірів
      </button>
      <dialog
        ref={ref}
        className={styles.chart}
        aria-labelledby={`${id}-t`}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
      >
        <div className={styles.chartInner}>
          <div className={styles.chartHead}>
            <h2 id={`${id}-t`}>Таблиця розмірів · {chart.title}</h2>
            <button type="button" onClick={() => ref.current?.close()} aria-label="Закрити">
              <Icon name="close" />
            </button>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Розмір</th>
                  {chart.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((r) => (
                  <tr key={r.size} aria-current={r.size === highlight || undefined}>
                    <th scope="row">{r.size}</th>
                    {r.values.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.chartNote}>{chart.note}</p>
        </div>
      </dialog>
    </>
  );
}
