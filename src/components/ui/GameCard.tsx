import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { aves } from "../../data/aves";
import type { Jogo, JogoId } from "../../data/jogos";
import { useSessao } from "../../store/sessao";
import { IconAlbum, IconCanto, IconPasseio, IconSilhueta } from "./icons";

const icones: Record<JogoId, typeof IconSilhueta> = {
  silhueta: IconSilhueta,
  canto: IconCanto,
  passeio: IconPasseio,
  album: IconAlbum,
};

const cores: Record<Jogo["cor"], string> = {
  saira: "bg-saira",
  sabia: "bg-sabia",
  folha: "bg-folha-600",
  terracota: "bg-terracota",
};

type GameCardProps = { jogo: Jogo; indice: number };

/** Cartão grande do menu de jogos. */
export function GameCard({ jogo, indice }: GameCardProps) {
  const navigate = useNavigate();
  const { progresso } = useSessao();
  const Icone = icones[jogo.id];
  const totalAves = aves.length;
  const descobertas = aves.filter((ave) => ave.id in progresso.descobertas).length;
  return (
    <motion.button
      type="button"
      onClick={() => navigate(jogo.rota)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 * indice, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.96 }}
      className="flex min-h-40 flex-col items-start gap-3 rounded-cartao bg-creme-50 p-5 text-left shadow-cartao ring-2 ring-creme-200"
    >
      <span className={`flex size-16 items-center justify-center rounded-botao text-creme-50 ${cores[jogo.cor]}`}>
        <Icone className="size-10" />
      </span>
      <span className="font-titulo text-subtitulo font-semibold text-mata-900">{jogo.titulo}</span>
      <span className="text-corpo leading-snug text-tinta-suave">{jogo.descricao}</span>
      {jogo.id === "album" && (
        <span
          className="mt-auto rounded-full bg-mata-900 px-3 py-1 font-titulo text-corpo font-semibold text-creme-50"
          aria-label={`${descobertas} de ${totalAves} aves descobertas`}
        >
          {descobertas}/{totalAves} aves
        </span>
      )}
    </motion.button>
  );
}
