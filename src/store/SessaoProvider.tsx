import { useCallback, useMemo, useState, type ReactNode } from "react";
import { unlockAudio } from "../lib/audio";
import { SessaoContext, type Sessao } from "./sessao";

const CHAVE_SOM = "aves:som";

function lerSomSalvo(): boolean {
  try {
    return localStorage.getItem(CHAVE_SOM) !== "desligado";
  } catch {
    return true;
  }
}

function salvarSom(ligado: boolean): void {
  try {
    localStorage.setItem(CHAVE_SOM, ligado ? "ligado" : "desligado");
  } catch {
    // sem localStorage (aba anônima, bloqueio): segue só em memória
  }
}

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [iniciado, setIniciado] = useState(false);
  const [somLigado, setSomLigado] = useState(lerSomSalvo);

  const iniciar = useCallback(() => {
    unlockAudio();
    setIniciado(true);
  }, []);

  const alternarSom = useCallback(() => {
    setSomLigado((atual) => {
      salvarSom(!atual);
      return !atual;
    });
  }, []);

  const valor = useMemo<Sessao>(
    () => ({ iniciado, somLigado, iniciar, alternarSom }),
    [iniciado, somLigado, iniciar, alternarSom],
  );

  return <SessaoContext value={valor}>{children}</SessaoContext>;
}
