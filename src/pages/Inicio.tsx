import { motion } from "motion/react";
import { Link } from "react-router";
import { GameCard } from "../components/ui/GameCard";
import { SoundToggle } from "../components/ui/SoundToggle";
import { jogos } from "../data/jogos";
import { useSessao } from "../store/sessao";

const FOTO_LODGE = "/lodge/lodge-1.webp";
const ALT_FOTO = "Vista do Altos de Lumiar Birding Lodge";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Tela inicial: "Toque para começar" (libera o áudio) e depois o menu dos jogos. */
export function Inicio() {
  const { iniciado, iniciar } = useSessao();
  return iniciado ? <Menu /> : <TelaToque onComecar={iniciar} />;
}

function TelaToque({ onComecar }: { onComecar: () => void }) {
  return (
    <button
      type="button"
      onClick={onComecar}
      aria-label="Toque para começar"
      className="relative flex h-dvh w-full flex-col items-center justify-end overflow-hidden text-creme-50 [touch-action:none]"
    >
      <img src={FOTO_LODGE} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-mata-950 via-mata-900/60 to-mata-900/10" />

      <div className="pb-safe px-safe relative flex flex-col items-center gap-3 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="font-titulo text-subtitulo font-medium text-canario"
        >
          Altos de Lumiar
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
          className="text-display font-bold drop-shadow-md"
        >
          Jogos das Aves
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="max-w-sm text-corpo text-creme-100"
        >
          Descubra as aves que vivem aqui com a gente!
        </motion.p>
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: [1, 1.05, 1] }}
          transition={{
            opacity: { duration: 0.3, delay: 0.3 },
            scale: { duration: 1.6, delay: 0.6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="mt-6 inline-flex min-h-toque items-center rounded-full bg-folha-500 px-10 py-4 font-titulo text-botao font-semibold shadow-botao"
        >
          Toque para começar
        </motion.span>
      </div>
    </button>
  );
}

function Menu() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="relative h-[34dvh] min-h-56 overflow-hidden text-creme-50">
        <img src={FOTO_LODGE} alt={ALT_FOTO} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-mata-950/90 via-mata-900/40 to-mata-900/20" />
        <div className="pt-safe px-safe relative mx-auto flex h-full w-full max-w-conteudo flex-col pb-8">
          <div className="flex justify-end">
            <SoundToggle />
          </div>
          <div className="mt-auto">
            <p className="font-titulo text-botao font-medium text-canario">Altos de Lumiar</p>
            <h1 className="text-titulo font-bold drop-shadow-md">Escolha um jogo</h1>
          </div>
        </div>
      </header>

      <main className="px-safe relative mx-auto -mt-4 w-full max-w-conteudo flex-1">
        <ul className="grid grid-cols-2 gap-4">
          {jogos.map((jogo, indice) => (
            <li key={jogo.id} className="flex">
              <GameCard jogo={jogo} indice={indice} />
            </li>
          ))}
        </ul>
      </main>

      <footer className="pb-safe px-safe flex justify-center pt-6">
        <Link
          to="/creditos"
          className="inline-flex min-h-toque items-center rounded-botao px-4 text-corpo text-tinta-suave underline underline-offset-4"
        >
          Créditos
        </Link>
      </footer>
    </div>
  );
}
