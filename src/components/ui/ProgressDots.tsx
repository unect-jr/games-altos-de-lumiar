import { motion } from "motion/react";

type ProgressDotsProps = {
  total: number;
  /** Índice da pergunta atual (0-based). */
  atual: number;
};

/** Bolinhas de progresso da rodada (ex.: pergunta 2 de 5). */
export function ProgressDots({ total, atual }: ProgressDotsProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={atual + 1}
      aria-label={`Pergunta ${atual + 1} de ${total}`}
      className="flex items-center justify-center gap-2"
    >
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          aria-hidden
          animate={{ width: i === atual ? 32 : 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`block h-3 rounded-full ${i <= atual ? "bg-folha-600" : "bg-creme-200"}`}
        />
      ))}
    </div>
  );
}
