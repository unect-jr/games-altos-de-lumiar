import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Dificuldade } from "../data/types";
import { definirMudo, unlockAudio } from "../lib/audio";
import { SessaoContext, estadoInicial, reduzirSessao, type Sessao } from "./sessao";

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
  const [estado, dispatch] = useReducer(reduzirSessao, undefined, () =>
    estadoInicial(lerSomSalvo()),
  );
  const { iniciado, progresso } = estado;
  const { somLigado } = progresso;

  // mantém o player e o localStorage em dia com a escolha de som
  useEffect(() => {
    definirMudo(!somLigado);
    salvarSom(somLigado);
  }, [somLigado]);

  const iniciar = useCallback(() => {
    unlockAudio(); // precisa rodar dentro do gesto
    dispatch({ tipo: "iniciar" });
  }, []);

  const alternarSom = useCallback(() => {
    unlockAudio(); // o toque no botão de som também é um gesto válido
    dispatch({ tipo: "alternarSom" });
  }, []);

  const definirDificuldade = useCallback((dificuldade: Dificuldade) => {
    dispatch({ tipo: "definirDificuldade", dificuldade });
  }, []);

  const descobrir = useCallback((aveIds: string[]) => {
    dispatch({ tipo: "descobrir", aveIds, data: new Date().toISOString() });
  }, []);

  const somarRodada = useCallback((pontos: number, melhorSequencia: number) => {
    dispatch({ tipo: "somarRodada", pontos, melhorSequencia });
  }, []);

  const valor = useMemo<Sessao>(
    () => ({
      iniciado,
      progresso,
      somLigado,
      iniciar,
      alternarSom,
      definirDificuldade,
      descobrir,
      somarRodada,
    }),
    [iniciado, progresso, somLigado, iniciar, alternarSom, definirDificuldade, descobrir, somarRodada],
  );

  return <SessaoContext value={valor}>{children}</SessaoContext>;
}
