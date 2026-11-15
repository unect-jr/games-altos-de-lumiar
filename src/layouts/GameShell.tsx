import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { SoundToggle } from "../components/ui/SoundToggle";
import { IconVoltar } from "../components/ui/icons";

type GameShellProps = {
  titulo: string;
  /** Pontos da rodada; omitido = sem placar no cabeçalho. */
  pontos?: number;
  children: ReactNode;
};

/** Moldura dos jogos: cabeçalho (voltar, título, pontos, som) e área em tela cheia, sem rolagem. */
export function GameShell({ titulo, pontos, children }: GameShellProps) {
  const navigate = useNavigate();
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="pt-safe px-safe bg-mata-900 pb-3 text-creme-50">
        <div className="mx-auto flex w-full max-w-conteudo items-center gap-3">
          <Button variante="secundario" onClick={() => navigate("/")} aria-label="Voltar ao início" className="px-0">
            <IconVoltar className="size-8" />
          </Button>
          <h1 className="flex-1 truncate text-subtitulo">{titulo}</h1>
          {pontos !== undefined && (
            <span
              className="rounded-full bg-canario px-4 py-2 font-titulo text-botao font-semibold text-mata-950"
              aria-label={`${pontos} pontos`}
            >
              ★ {pontos}
            </span>
          )}
          <SoundToggle />
        </div>
      </header>
      <main className="pb-safe px-safe mx-auto flex w-full max-w-conteudo flex-1 flex-col overflow-hidden pt-4 [touch-action:none]">
        {children}
      </main>
    </div>
  );
}
