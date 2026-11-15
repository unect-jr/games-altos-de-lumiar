import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { fotoDe, PLACEHOLDER_AVE } from "../../data/aves";
import type { Ave } from "../../data/types";
import { tocarAudio } from "../../lib/audio";
import { useEstadoAudio } from "../../lib/useEstadoAudio";
import { useSessao } from "../../store/sessao";
import { IconCanto, IconRepetir } from "../ui/icons";

type ListenStageProps = {
  ave: Ave;
  revelada: boolean;
  /** Sobreposição no topo do palco (ex.: Toast). */
  children?: ReactNode;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const BARRAS = [0.5, 1, 0.7, 0.9, 0.6];
const ONDAS = [0, 1, 2];

/**
 * Palco do jogo Canto. Antes de revelar: botão grande de ouvir (com ondas e
 * equalizador enquanto toca). Ao revelar: a foto da ave surge (fade + escala).
 * Sem arquivo ou com falha: aviso gentil, e o jogo segue.
 * Use `key={ave.id}` no pai para reiniciar a cada pergunta.
 */
export function ListenStage({ ave, revelada, children, className = "" }: ListenStageProps) {
  const { somLigado } = useSessao();
  const audio = useEstadoAudio();
  const [fotoFalhou, setFotoFalhou] = useState(false);

  const src = ave.midia.canto;
  const meu = src !== null && audio.src === src;
  const tocando = meu && audio.status === "tocando";
  const carregando = meu && audio.status === "carregando";
  const falhou = meu && (audio.status === "erro" || audio.status === "bloqueado");
  const indisponivel = src === null || !somLigado;

  const aviso =
    src === null
      ? "Este canto ainda não chegou. Tente adivinhar pelas opções!"
      : !somLigado
        ? "O som está desligado. Ligue o som para ouvir."
        : falhou
          ? audio.status === "bloqueado"
            ? "Toque no botão para ouvir."
            : "Não deu para tocar o som."
          : null;

  const rotulo = falhou ? "Tentar de novo" : "Ouvir de novo";

  return (
    <div
      className={`relative flex min-h-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-cartao bg-linear-to-b from-neblina to-creme-100 p-4 shadow-cartao ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {revelada ? (
          <motion.div
            key="foto"
            role="img"
            aria-label={`Foto de ${ave.nomePopular}`}
            className="relative aspect-square h-[82%] max-w-[82%]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, y: [0, -18, 0, -6, 0] }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <img
              src={fotoFalhou ? PLACEHOLDER_AVE : fotoDe(ave)}
              alt=""
              draggable={false}
              onError={() => setFotoFalhou(true)}
              className="size-full rounded-cartao object-contain"
            />
          </motion.div>
        ) : (
          <motion.div
            key="ouvir"
            className="flex flex-col items-center gap-4 text-center"
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="relative flex items-center justify-center">
              {/* ondas de som saindo do botão */}
              {tocando &&
                ONDAS.map((i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="absolute inset-0 rounded-full border-4 border-saira"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                  />
                ))}
              <motion.button
                type="button"
                onClick={() => void tocarAudio(src)}
                disabled={indisponivel}
                whileTap={{ scale: 0.94 }}
                aria-label={`${rotulo}: canto de uma ave misteriosa`}
                aria-busy={carregando}
                className="relative flex size-36 flex-col items-center justify-center gap-2 rounded-full bg-saira text-creme-50 shadow-botao active:shadow-botao-pressionado disabled:opacity-50 sm:size-44"
              >
                {falhou ? <IconRepetir className="size-14" /> : <IconCanto className="size-14 sm:size-16" />}
                <span aria-hidden className="flex h-6 items-end gap-1">
                  {BARRAS.map((altura, i) => (
                    <motion.span
                      key={i}
                      className="block w-1.5 origin-bottom rounded-full bg-creme-50"
                      style={{ height: "100%" }}
                      animate={
                        tocando ? { scaleY: [0.3, altura, 0.4, 1, 0.3] } : { scaleY: carregando ? 0.5 : 0.25 }
                      }
                      transition={
                        tocando
                          ? { duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }
                          : { duration: 0.2 }
                      }
                    />
                  ))}
                </span>
              </motion.button>
            </div>
            <p className="font-titulo text-botao font-semibold text-mata-900">
              {tocando ? "Escute bem..." : rotulo}
            </p>
            {aviso && (
              <p role="status" className="max-w-xs text-corpo text-tinta-suave">
                {aviso}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {children && (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3">{children}</div>
      )}
    </div>
  );
}
