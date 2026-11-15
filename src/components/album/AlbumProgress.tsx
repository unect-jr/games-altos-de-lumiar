import { motion } from "motion/react";
import { fraseProgresso, type ProgressoAlbum } from "../../album/titulos";
import { IconTitulo } from "../ui/icons";

type AlbumProgressProps = { progresso: ProgressoAlbum };

/** Título atual, contagem (ex.: 7/12) e barra animada. */
export function AlbumProgress({ progresso }: AlbumProgressProps) {
  const { descobertas, total, fracao, titulo } = progresso;
  return (
    <section aria-label="Progresso do álbum" className="rounded-cartao bg-mata-900 p-4 text-creme-50 shadow-cartao">
      <div className="flex items-center gap-3">
        <span className="flex size-toque shrink-0 items-center justify-center rounded-full bg-canario text-mata-950">
          <IconTitulo className="size-8" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-corpo text-creme-200">Seu título</p>
          <motion.p
            key={titulo}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="truncate font-titulo text-subtitulo font-semibold text-canario"
          >
            {titulo}
          </motion.p>
        </div>
        <p className="font-titulo text-subtitulo font-semibold" aria-label={`${descobertas} de ${total} aves`}>
          {descobertas}/{total}
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={descobertas}
        aria-label="Aves descobertas"
        className="mt-3 h-4 overflow-hidden rounded-full bg-mata-950/60"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-folha-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: fracao }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="mt-2 text-corpo text-creme-100">{fraseProgresso(progresso)}</p>
    </section>
  );
}
