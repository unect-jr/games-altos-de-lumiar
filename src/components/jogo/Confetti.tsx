import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type ConfettiProps = {
  className?: string;
};

const CORES = ["bg-canario", "bg-sabia", "bg-saira", "bg-hortensia", "bg-folha-400", "bg-tie"];

type Particula = {
  cor: string;
  /** Deslocamento horizontal final, em px a partir do centro. */
  x: number;
  /** Altura do salto, em px. */
  sobe: number;
  giro: number;
  atraso: number;
  redonda: boolean;
};

function criarParticulas(quantidade: number): Particula[] {
  return Array.from({ length: quantidade }, (_, i) => ({
    cor: CORES[i % CORES.length],
    x: (Math.random() - 0.5) * 360,
    sobe: 80 + Math.random() * 120,
    giro: (Math.random() - 0.5) * 720,
    atraso: Math.random() * 0.15,
    redonda: i % 3 === 0,
  }));
}

/** Confete leve feito à mão (poucas partículas). Monte para disparar uma vez. */
export function Confetti({ className = "" }: ConfettiProps) {
  const reduzir = useReducedMotion();
  const [particulas] = useState(() => criarParticulas(reduzir ? 8 : 24));

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particulas.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute top-1/2 left-1/2 block ${p.redonda ? "size-3 rounded-full" : "h-4 w-2 rounded-sm"} ${p.cor}`}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={
            reduzir
              ? { opacity: [0, 1, 0], x: p.x / 2, y: -p.sobe / 2 }
              : { x: [0, p.x * 0.8, p.x], y: [0, -p.sobe, 160], rotate: p.giro, opacity: [1, 1, 0] }
          }
          transition={{ duration: reduzir ? 0.8 : 1.4, delay: p.atraso, ease: "easeOut", times: reduzir ? undefined : [0, 0.4, 1] }}
        />
      ))}
    </div>
  );
}
