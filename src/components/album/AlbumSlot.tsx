import { useState } from "react";
import { motion } from "motion/react";
import { fotoDe, PLACEHOLDER_AVE } from "../../data/aves";
import type { Ave } from "../../data/types";
import { IconNova, IconSilhueta } from "../ui/icons";

type AlbumSlotProps = {
  ave: Ave;
  descoberta: boolean;
  /** Descoberta desde a última visita: entra "virando" e ganha o selo. */
  nova: boolean;
  indice: number;
  onAbrir: (ave: Ave) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Uma casa do Álbum: silhueta com "?" ou foto e nome da ave descoberta. */
export function AlbumSlot({ ave, descoberta, nova, indice, onAbrir }: AlbumSlotProps) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const entrada = { duration: 0.35, delay: 0.04 * indice, ease: EASE };

  if (!descoberta) {
    const src = imagemFalhou ? null : (ave.midia.silhueta ?? ave.midia.foto);
    return (
      <motion.div
        role="img"
        aria-label="Ave ainda não descoberta"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={entrada}
        className="flex h-full flex-col rounded-cartao bg-creme-100 p-2 ring-2 ring-creme-200 ring-inset"
      >
        <div aria-hidden className="relative flex aspect-square items-center justify-center rounded-botao bg-neblina/40">
          {src ? (
            <img
              src={src}
              alt=""
              loading="lazy"
              draggable={false}
              onError={() => setImagemFalhou(true)}
              className="size-4/5 object-contain opacity-40 brightness-0"
            />
          ) : (
            <IconSilhueta className="size-4/5 text-mata-950/40" />
          )}
          <span className="absolute font-titulo text-display font-bold text-mata-900">?</span>
        </div>
        <p aria-hidden className="mt-2 text-center font-titulo text-botao font-semibold text-tinta-suave">
          ???
        </p>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => onAbrir(ave)}
      aria-label={nova ? `${ave.nomePopular}, nova! Ver cartão` : `${ave.nomePopular}: ver cartão`}
      initial={nova ? { opacity: 0, rotateY: 180 } : { opacity: 0, y: 16 }}
      animate={nova ? { opacity: 1, rotateY: 0 } : { opacity: 1, y: 0 }}
      transition={nova ? { duration: 0.45, delay: 0.3 + 0.12 * indice, ease: EASE } : entrada}
      whileTap={{ scale: 0.96 }}
      className="relative flex h-full w-full flex-col rounded-cartao bg-creme-50 p-2 text-left shadow-cartao ring-2 ring-folha-400 ring-inset"
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-botao bg-linear-to-b from-neblina to-creme-100">
        <img
          src={imagemFalhou ? PLACEHOLDER_AVE : fotoDe(ave)}
          alt=""
          loading="lazy"
          draggable={false}
          onError={() => setImagemFalhou(true)}
          className="size-full object-contain"
        />
      </div>
      <p className="mt-2 text-center font-titulo text-botao leading-tight font-semibold text-mata-900">
        {ave.nomePopular}
      </p>
      {nova && (
        <span
          aria-hidden
          className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-full bg-canario px-3 py-1 font-titulo text-corpo font-semibold text-mata-950 shadow-botao"
        >
          <IconNova className="size-5" />
          Nova!
        </span>
      )}
    </motion.button>
  );
}
