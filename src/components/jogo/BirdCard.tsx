import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { Ave } from "../../data/types";

type BirdCardProps = {
  ave: Ave;
  /** Frase curta acima do nome (ex.: "Esta é a ave certa:"). */
  chamada?: string;
  /** Ações extras no rodapé do cartão (ex.: botão de ouvir). */
  children?: ReactNode;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cartão com nome popular, nome científico e curiosidade da ave. */
export function BirdCard({ ave, chamada, children, className = "" }: BirdCardProps) {
  return (
    <article className={`rounded-cartao bg-creme-50 p-5 shadow-cartao ${className}`}>
      {chamada && <p className="text-corpo font-semibold text-tinta-suave">{chamada}</p>}
      <motion.h2
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
        className="text-titulo text-mata-900"
      >
        {ave.nomePopular}
      </motion.h2>
      <p className="mt-1 text-corpo text-tinta-suave italic">{ave.nomeCientifico}</p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25, ease: EASE }}
        className="mt-3 text-corpo text-tinta"
      >
        {ave.curiosidade}
      </motion.p>
      {children && <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>}
    </article>
  );
}
