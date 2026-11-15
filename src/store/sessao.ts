import { createContext, useContext } from "react";
import type { Dificuldade, Progresso } from "../data/types";
import { DIFICULDADE_PADRAO } from "../quiz/montarRodada";

// Store da sessão: Context + useReducer. Tudo em memória;
// só a escolha de som é lembrada (localStorage, no Provider).

export type EstadoSessao = {
  /** O usuário já tocou em "Toque para começar" nesta sessão. */
  iniciado: boolean;
  progresso: Progresso;
  /** Aves já vistas no Álbum (as outras ganham o selo "Nova!"). */
  vistas: string[];
};

export type AcaoSessao =
  | { tipo: "iniciar" }
  | { tipo: "alternarSom" }
  | { tipo: "definirDificuldade"; dificuldade: Dificuldade }
  | { tipo: "descobrir"; aveIds: string[]; data: string }
  | { tipo: "marcarVistas" }
  | { tipo: "somarRodada"; pontos: number; melhorSequencia: number };

export function estadoInicial(somLigado: boolean): EstadoSessao {
  return {
    iniciado: false,
    progresso: {
      descobertas: {},
      pontuacao: 0,
      melhorSequencia: 0,
      dificuldade: DIFICULDADE_PADRAO,
      somLigado,
    },
    vistas: [],
  };
}

export function reduzirSessao(estado: EstadoSessao, acao: AcaoSessao): EstadoSessao {
  const { progresso } = estado;
  switch (acao.tipo) {
    case "iniciar":
      return estado.iniciado ? estado : { ...estado, iniciado: true };
    case "alternarSom":
      return { ...estado, progresso: { ...progresso, somLigado: !progresso.somLigado } };
    case "definirDificuldade":
      return { ...estado, progresso: { ...progresso, dificuldade: acao.dificuldade } };
    case "descobrir": {
      const novas = acao.aveIds.filter((id) => !(id in progresso.descobertas));
      if (novas.length === 0) return estado;
      const descobertas = { ...progresso.descobertas };
      novas.forEach((id) => (descobertas[id] = acao.data));
      return { ...estado, progresso: { ...progresso, descobertas } };
    }
    case "marcarVistas": {
      const ids = Object.keys(progresso.descobertas);
      if (ids.length === estado.vistas.length) return estado;
      return { ...estado, vistas: ids };
    }
    case "somarRodada":
      return {
        ...estado,
        progresso: {
          ...progresso,
          pontuacao: progresso.pontuacao + acao.pontos,
          melhorSequencia: Math.max(progresso.melhorSequencia, acao.melhorSequencia),
        },
      };
  }
}

export type Sessao = {
  iniciado: boolean;
  progresso: Progresso;
  vistas: string[];
  /** Atalho para `progresso.somLigado`. */
  somLigado: boolean;
  iniciar: () => void;
  alternarSom: () => void;
  definirDificuldade: (dificuldade: Dificuldade) => void;
  /** Registra aves no Álbum (ignora as já descobertas). */
  descobrir: (aveIds: string[]) => void;
  /** Marca todas as descobertas como vistas no Álbum. */
  marcarVistas: () => void;
  /** Soma os pontos de uma rodada/encontro ao total da sessão. */
  somarRodada: (pontos: number, melhorSequencia: number) => void;
};

export const SessaoContext = createContext<Sessao | null>(null);

export function useSessao(): Sessao {
  const sessao = useContext(SessaoContext);
  if (!sessao) throw new Error("useSessao precisa estar dentro de <SessaoProvider>");
  return sessao;
}
