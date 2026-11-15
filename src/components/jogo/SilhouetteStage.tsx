import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { fotoDe, PLACEHOLDER_AVE } from "../../data/aves";
import type { Ave } from "../../data/types";
import { IconSilhueta } from "../ui/icons";

type SilhouetteStageProps = {
  ave: Ave;
  revelada: boolean;
  /** Sobreposição no topo do palco (ex.: Toast). */
  children?: ReactNode;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Palco da silhueta. Antes de revelar: imagem escurecida (`brightness(0)`),
 * com rótulo genérico. Ao revelar: a foto colorida surge (fade + escala) e a ave "pula".
 * Use `key={ave.id}` no pai para reiniciar a cada pergunta.
 */
export function SilhouetteStage({ ave, revelada, children, className = "" }: SilhouetteStageProps) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const [silhuetaFalhou, setSilhuetaFalhou] = useState(false);

  // sem arquivo (ou com erro), a silhueta usa o desenho genérico de ave
  const srcSilhueta = silhuetaFalhou ? null : (ave.midia.silhueta ?? ave.midia.foto);
  const srcFoto = fotoFalhou ? PLACEHOLDER_AVE : fotoDe(ave);

  return (
    <div
      className={`relative flex min-h-0 items-center justify-center overflow-hidden rounded-cartao bg-linear-to-b from-neblina to-creme-100 shadow-cartao ${className}`}
    >
      {/* rótulo genérico até revelar; o nome só entra depois */}
      <div
        role="img"
        aria-label={revelada ? `Foto de ${ave.nomePopular}` : "Silhueta de uma ave"}
        className="absolute inset-0"
      />
      {/* chão: sombra suave sob a ave */}
      <div aria-hidden className="absolute bottom-[8%] h-[8%] w-1/2 rounded-[50%] bg-mata-950/15 blur-sm" />

      <motion.div
        aria-hidden
        className="relative aspect-square h-[82%] max-w-[82%]"
        animate={revelada ? { y: [0, -18, 0, -6, 0] } : { y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
      >
        {/* silhueta */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: revelada ? 0 : 1, scale: revelada ? 1.05 : 1 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {srcSilhueta ? (
            <img
              src={srcSilhueta}
              alt=""
              draggable={false}
              onError={() => setSilhuetaFalhou(true)}
              className="size-full object-contain brightness-0"
            />
          ) : (
            <IconSilhueta className="size-full text-mata-950" />
          )}
        </motion.div>

        {/* foto colorida */}
        <motion.img
          src={srcFoto}
          alt=""
          draggable={false}
          onError={() => setFotoFalhou(true)}
          className="absolute inset-0 size-full rounded-cartao object-contain"
          initial={false}
          animate={{ opacity: revelada ? 1 : 0, scale: revelada ? 1 : 0.9 }}
          transition={{ duration: 0.45, ease: EASE }}
        />
      </motion.div>

      {children && (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3">{children}</div>
      )}
    </div>
  );
}
