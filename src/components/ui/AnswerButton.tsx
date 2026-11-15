import type { Ref } from "react";
import { motion } from "motion/react";
import { PLACEHOLDER_AVE } from "../../data/aves";
import { IconCerto, IconQuase } from "./icons";

/**
 * - livre: pode ser escolhida
 * - descartada: escolha errada ("quase"), em âmbar e sem vermelho
 * - certa: a resposta certa (acerto ou revelada após erro)
 * - apagada: demais opções depois da resposta
 */
export type EstadoOpcao = "livre" | "descartada" | "certa" | "apagada";

type AnswerButtonProps = {
  rotulo: string;
  /** Miniatura da ave (decorativa: o nome já está no rótulo). */
  imagem?: string;
  estado: EstadoOpcao;
  /** Posição na lista (cascata de entrada e atalho de teclado). */
  indice: number;
  onEscolher: () => void;
  ref?: Ref<HTMLButtonElement>;
};

const estilos: Record<EstadoOpcao, string> = {
  livre: "bg-creme-50 text-mata-900 shadow-botao active:shadow-botao-pressionado",
  descartada: "bg-creme-200 text-tinta-suave ring-4 ring-quase ring-inset",
  certa: "bg-acerto text-creme-50 shadow-botao",
  apagada: "bg-creme-100 text-tinta-suave opacity-60",
};

const animacoes: Record<EstadoOpcao, { x?: number[]; y?: number[]; scale?: number[] }> = {
  livre: { x: [0], y: [0], scale: [1] },
  descartada: { x: [0, -10, 9, -6, 4, 0] },
  certa: { y: [0, -12, 0, -4, 0], scale: [1, 1.04, 1] },
  apagada: { x: [0], y: [0], scale: [1] },
};

/** Opção de resposta grande, com ícone além da cor (✓ certa, balão "quase"). */
export function AnswerButton({ rotulo, imagem, estado, indice, onEscolher, ref }: AnswerButtonProps) {
  const ativa = estado === "livre";
  const sufixo = estado === "certa" ? ", resposta certa" : estado === "descartada" ? ", não é esta" : "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.06 * indice, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        ref={ref}
        type="button"
        onClick={onEscolher}
        disabled={!ativa}
        aria-label={`${indice + 1}. ${rotulo}${sufixo}`}
        whileTap={ativa ? { scale: 0.96 } : undefined}
        animate={animacoes[estado]}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`flex min-h-toque w-full items-center gap-3 rounded-botao px-4 py-3 text-left font-titulo text-botao font-semibold transition-colors duration-200 disabled:cursor-default ${estilos[estado]}`}
      >
        <span
          aria-hidden
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-mata-900/10 text-corpo"
        >
          {estado === "certa" ? (
            <IconCerto className="size-6" />
          ) : estado === "descartada" ? (
            <IconQuase className="size-6 text-quase" />
          ) : (
            indice + 1
          )}
        </span>
        {imagem && (
          <img
            src={imagem}
            alt=""
            draggable={false}
            onError={(evento) => {
              if (!evento.currentTarget.src.endsWith(PLACEHOLDER_AVE)) evento.currentTarget.src = PLACEHOLDER_AVE;
            }}
            className={`size-12 shrink-0 rounded-xl bg-neblina object-cover ${estado === "apagada" ? "grayscale" : ""}`}
          />
        )}
        <span className="flex-1">{rotulo}</span>
      </motion.button>
    </motion.div>
  );
}
