import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { Direcao } from "../../game/engine";
import { IconAvancar, IconSetaBaixo, IconSetaCima, IconVoltar } from "../ui/icons";

type DPadProps = {
  onSegurar: (direcao: Direcao) => void;
  onSoltar: (direcao: Direcao) => void;
  className?: string;
};

const BOTOES: { direcao: Direcao; rotulo: string; icone: ReactNode; posicao: string }[] = [
  { direcao: "cima", rotulo: "Andar para cima", icone: <IconSetaCima className="size-8" />, posicao: "col-start-2 row-start-1" },
  { direcao: "esquerda", rotulo: "Andar para a esquerda", icone: <IconVoltar className="size-8" />, posicao: "col-start-1 row-start-2" },
  { direcao: "direita", rotulo: "Andar para a direita", icone: <IconAvancar className="size-8" />, posicao: "col-start-3 row-start-2" },
  { direcao: "baixo", rotulo: "Andar para baixo", icone: <IconSetaBaixo className="size-8" />, posicao: "col-start-2 row-start-3" },
];

/** D-pad virtual: segurar um botão continua andando. */
export function DPad({ onSegurar, onSoltar, className = "" }: DPadProps) {
  const [apertado, setApertado] = useState<Direcao | null>(null);

  function comecar(direcao: Direcao) {
    setApertado(direcao);
    onSegurar(direcao);
  }

  function parar(direcao: Direcao) {
    setApertado((atual) => (atual === direcao ? null : atual));
    onSoltar(direcao);
  }

  return (
    <div
      role="group"
      aria-label="Controles de direção"
      className={`grid grid-cols-[repeat(3,var(--spacing-dpad))] grid-rows-[repeat(3,var(--spacing-dpad))] select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {BOTOES.map(({ direcao, rotulo, icone, posicao }) => (
        <button
          key={direcao}
          type="button"
          aria-label={rotulo}
          className={`${posicao} flex items-center justify-center rounded-botao text-mata-900 transition-[transform,box-shadow] duration-150 ease-suave [touch-action:none] ${
            apertado === direcao
              ? "translate-y-1 bg-creme-100 shadow-botao-pressionado"
              : "bg-creme-50/90 shadow-botao"
          }`}
          onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            comecar(direcao);
          }}
          onPointerUp={() => parar(direcao)}
          onPointerCancel={() => parar(direcao)}
          onLostPointerCapture={() => parar(direcao)}
          onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
            if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
              e.preventDefault();
              comecar(direcao);
            }
          }}
          onKeyUp={(e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "Enter" || e.key === " ") parar(direcao);
          }}
          onBlur={() => parar(direcao)}
        >
          {icone}
        </button>
      ))}
    </div>
  );
}
