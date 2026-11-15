import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { Dificuldade } from "../../data/types";
import { Button } from "../ui/Button";
import { IconAvancar } from "../ui/icons";
import { DifficultyPicker } from "./DifficultyPicker";

type LevelIntroProps = {
  icone: ReactNode;
  pergunta: string;
  texto: string;
  dificuldade: Dificuldade;
  onMudarDificuldade: (dificuldade: Dificuldade) => void;
  onComecar: () => void;
  rotuloComecar?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Tela de entrada de um jogo: ícone, chamada, escolha do nível e "Começar". */
export function LevelIntro({
  icone,
  pergunta,
  texto,
  dificuldade,
  onMudarDificuldade,
  onComecar,
  rotuloComecar = "Começar",
}: LevelIntroProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex size-28 items-center justify-center rounded-full bg-neblina text-mata-950 shadow-cartao"
      >
        {icone}
      </motion.div>
      <div>
        <h2 className="text-titulo text-mata-900">{pergunta}</h2>
        <p className="mt-2 text-corpo text-tinta-suave">{texto}</p>
      </div>
      <DifficultyPicker valor={dificuldade} onChange={onMudarDificuldade} />
      <Button onClick={onComecar} className="w-full sm:w-auto sm:px-12">
        {rotuloComecar} <IconAvancar className="size-7" />
      </Button>
    </div>
  );
}
