import type { KeyboardEvent } from "react";
import { motion } from "motion/react";
import type { Dificuldade } from "../../data/types";
import { CONFIG_DIFICULDADE } from "../../quiz/montarRodada";
import { IconEstrela } from "../ui/icons";

type DifficultyPickerProps = {
  valor: Dificuldade;
  onChange: (dificuldade: Dificuldade) => void;
};

const ORDEM: Dificuldade[] = ["facil", "medio", "dificil"];

const DESCRICOES: Record<Dificuldade, string> = {
  facil: "3 opções e 2 chances",
  medio: "4 opções",
  dificil: "4 opções com aves parecidas",
};

/** Escolha do nível: três cartões grandes (grupo de rádio). */
export function DifficultyPicker({ valor, onChange }: DifficultyPickerProps) {
  // setas movem a escolha, como num grupo de rádio nativo
  function aoTeclar(evento: KeyboardEvent, indice: number) {
    const passo = evento.key === "ArrowDown" || evento.key === "ArrowRight" ? 1 : evento.key === "ArrowUp" || evento.key === "ArrowLeft" ? -1 : 0;
    if (!passo) return;
    evento.preventDefault();
    const proximo = ORDEM[(indice + passo + ORDEM.length) % ORDEM.length];
    onChange(proximo);
    const grupo = evento.currentTarget.parentElement;
    grupo?.querySelector<HTMLButtonElement>(`[data-nivel="${proximo}"]`)?.focus();
  }

  return (
    <div role="radiogroup" aria-label="Nível" className="grid w-full gap-3 sm:grid-cols-3">
      {ORDEM.map((nivel, i) => {
        const ativo = nivel === valor;
        return (
          <motion.button
            key={nivel}
            type="button"
            role="radio"
            aria-checked={ativo}
            data-nivel={nivel}
            tabIndex={ativo ? 0 : -1}
            onClick={() => onChange(nivel)}
            onKeyDown={(e) => aoTeclar(e, i)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.3, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            className={`flex min-h-toque items-center gap-3 rounded-cartao px-5 py-4 text-left shadow-botao transition-colors duration-200 sm:flex-col sm:items-start ${
              ativo ? "bg-mata-900 text-creme-50 ring-4 ring-canario" : "bg-creme-50 text-mata-900"
            }`}
          >
            <span aria-hidden className="flex gap-0.5 text-canario">
              {ORDEM.map((_, j) => (
                <IconEstrela key={j} cheia={j <= i} className="size-6" />
              ))}
            </span>
            <span className="flex flex-col">
              <span className="font-titulo text-botao font-semibold">{CONFIG_DIFICULDADE[nivel].rotulo}</span>
              <span className={`text-corpo ${ativo ? "text-creme-100" : "text-tinta-suave"}`}>{DESCRICOES[nivel]}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
