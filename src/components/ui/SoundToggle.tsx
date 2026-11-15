import { motion } from "motion/react";
import { useSessao } from "../../store/sessao";
import { IconSom } from "./icons";

type SoundToggleProps = { className?: string };

/** Liga/desliga o som. Sempre visível no cabeçalho. */
export function SoundToggle({ className = "" }: SoundToggleProps) {
  const { somLigado, alternarSom } = useSessao();
  return (
    <motion.button
      type="button"
      onClick={alternarSom}
      whileTap={{ scale: 0.92 }}
      aria-pressed={somLigado}
      aria-label={somLigado ? "Som ligado. Toque para desligar" : "Som desligado. Toque para ligar"}
      className={`inline-flex size-toque items-center justify-center rounded-full bg-creme-50 text-mata-900 shadow-botao active:shadow-botao-pressionado ${className}`}
    >
      <IconSom ligado={somLigado} className="size-8" />
    </motion.button>
  );
}
