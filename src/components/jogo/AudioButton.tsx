import { motion } from "motion/react";
import { tocarAudio } from "../../lib/audio";
import { useEstadoAudio } from "../../lib/useEstadoAudio";
import { useSessao } from "../../store/sessao";
import { IconCanto, IconRepetir } from "../ui/icons";

type AudioButtonProps = {
  src: string | null;
  /** Ex.: "Ouvir o canto". */
  rotulo?: string;
  className?: string;
};

const BARRAS = [0.5, 1, 0.7, 0.9];

/** Botão de ouvir o canto: equalizador enquanto toca e aviso gentil se falhar. */
export function AudioButton({ src, rotulo = "Ouvir o canto", className = "" }: AudioButtonProps) {
  const { somLigado } = useSessao();
  const audio = useEstadoAudio();
  const meu = audio.src === src;
  const tocando = meu && audio.status === "tocando";
  const carregando = meu && audio.status === "carregando";
  const falhou = meu && (audio.status === "erro" || audio.status === "bloqueado");

  const aviso = !somLigado
    ? "O som está desligado."
    : falhou
      ? audio.status === "bloqueado"
        ? "Toque de novo para ouvir."
        : "Não deu para tocar o som."
      : null;

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <motion.button
        type="button"
        onClick={() => void tocarAudio(src)}
        disabled={!somLigado}
        whileTap={{ scale: 0.96 }}
        aria-label={falhou ? `Tentar de novo: ${rotulo}` : rotulo}
        aria-busy={carregando}
        className="inline-flex min-h-toque items-center gap-3 rounded-botao bg-saira px-5 font-titulo text-botao font-semibold text-creme-50 shadow-botao active:shadow-botao-pressionado disabled:opacity-50"
      >
        {falhou ? <IconRepetir className="size-7" /> : <IconCanto className="size-7" />}
        <span>{falhou ? "Tentar de novo" : rotulo}</span>
        <span aria-hidden className="flex h-6 items-end gap-1">
          {BARRAS.map((altura, i) => (
            <motion.span
              key={i}
              className="block w-1.5 origin-bottom rounded-full bg-creme-50"
              style={{ height: "100%" }}
              animate={tocando ? { scaleY: [0.3, altura, 0.4, 1, 0.3] } : { scaleY: carregando ? 0.5 : 0.25 }}
              transition={
                tocando ? { duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" } : { duration: 0.2 }
              }
            />
          ))}
        </span>
      </motion.button>
      {aviso && (
        <p role="status" className="text-corpo text-tinta-suave">
          {aviso}
        </p>
      )}
    </div>
  );
}
