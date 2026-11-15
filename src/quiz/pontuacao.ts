// Pontuação e andamento de uma rodada. Módulo puro (sem React).
// Uso típico: useReducer(reduzirRodada, rodada, iniciarEstado).
import type { Rodada } from "../data/types";
import { CONFIG_DIFICULDADE } from "./montarRodada";

export const PONTOS_ACERTO = 10;
export const BONUS_POR_SEQUENCIA = 2;
export const BONUS_MAXIMO = 10;
/** Acerto na 2ª tentativa (Fácil): metade dos pontos, sem bônus. */
export const PONTOS_SEGUNDA_TENTATIVA = 5;

/** Pontos de um acerto de primeira. `sequencia` inclui o acerto atual (1, 2, 3...). */
export function pontosDoAcerto(sequencia: number): number {
  const bonus = Math.min(Math.max(sequencia - 1, 0) * BONUS_POR_SEQUENCIA, BONUS_MAXIMO);
  return PONTOS_ACERTO + bonus;
}

/** Estrelas do resumo (1 a 3). Nunca zero: erro não é punitivo. */
export function calcularEstrelas(acertos: number, total: number): 1 | 2 | 3 {
  if (total === 0) return 1;
  const taxa = acertos / total;
  if (taxa >= 0.8) return 3;
  if (taxa >= 0.4) return 2;
  return 1;
}

export type ResultadoPergunta = {
  aveId: string;
  acertou: boolean;
  /** Tentativas usadas (1 ou 2). */
  tentativas: number;
  pontos: number;
};

export type FaseRodada = "pergunta" | "feedback" | "fim";

/** Retorno da última resposta, para a UI animar. */
export type Retorno = "acerto" | "tente-de-novo" | "erro";

export type EstadoRodada = {
  rodada: Rodada;
  indice: number;
  fase: FaseRodada;
  tentativasRestantes: number;
  /** Opções já descartadas na pergunta atual (2ª tentativa do Fácil). */
  descartadas: string[];
  ultimoRetorno: Retorno | null;
  pontos: number;
  sequencia: number;
  melhorSequencia: number;
  resultados: ResultadoPergunta[];
};

export type AcaoRodada =
  | { tipo: "responder"; opcaoId: string }
  | { tipo: "avancar" }
  | { tipo: "reiniciar"; rodada: Rodada };

export function iniciarEstado(rodada: Rodada): EstadoRodada {
  return {
    rodada,
    indice: 0,
    fase: rodada.perguntas.length > 0 ? "pergunta" : "fim",
    tentativasRestantes: CONFIG_DIFICULDADE[rodada.dificuldade].tentativas,
    descartadas: [],
    ultimoRetorno: null,
    pontos: 0,
    sequencia: 0,
    melhorSequencia: 0,
    resultados: [],
  };
}

function responder(estado: EstadoRodada, opcaoId: string): EstadoRodada {
  if (estado.fase !== "pergunta") return estado;
  const pergunta = estado.rodada.perguntas[estado.indice];
  if (!pergunta.opcoes.includes(opcaoId) || estado.descartadas.includes(opcaoId)) {
    return estado;
  }
  const tentativasTotais = CONFIG_DIFICULDADE[estado.rodada.dificuldade].tentativas;
  const tentativa = tentativasTotais - estado.tentativasRestantes + 1;

  if (opcaoId === pergunta.respostaId) {
    const dePrimeira = tentativa === 1;
    const sequencia = dePrimeira ? estado.sequencia + 1 : 0;
    const pontos = dePrimeira ? pontosDoAcerto(sequencia) : PONTOS_SEGUNDA_TENTATIVA;
    return {
      ...estado,
      fase: "feedback",
      ultimoRetorno: "acerto",
      pontos: estado.pontos + pontos,
      sequencia,
      melhorSequencia: Math.max(estado.melhorSequencia, sequencia),
      resultados: [
        ...estado.resultados,
        { aveId: pergunta.aveId, acertou: true, tentativas: tentativa, pontos },
      ],
    };
  }

  if (estado.tentativasRestantes > 1) {
    return {
      ...estado,
      tentativasRestantes: estado.tentativasRestantes - 1,
      descartadas: [...estado.descartadas, opcaoId],
      ultimoRetorno: "tente-de-novo",
      sequencia: 0,
    };
  }

  return {
    ...estado,
    fase: "feedback",
    ultimoRetorno: "erro",
    sequencia: 0,
    resultados: [
      ...estado.resultados,
      { aveId: pergunta.aveId, acertou: false, tentativas: tentativa, pontos: 0 },
    ],
  };
}

function avancar(estado: EstadoRodada): EstadoRodada {
  if (estado.fase !== "feedback") return estado;
  const proximo = estado.indice + 1;
  if (proximo >= estado.rodada.perguntas.length) {
    return { ...estado, fase: "fim", ultimoRetorno: null };
  }
  return {
    ...estado,
    indice: proximo,
    fase: "pergunta",
    tentativasRestantes: CONFIG_DIFICULDADE[estado.rodada.dificuldade].tentativas,
    descartadas: [],
    ultimoRetorno: null,
  };
}

export function reduzirRodada(estado: EstadoRodada, acao: AcaoRodada): EstadoRodada {
  switch (acao.tipo) {
    case "responder":
      return responder(estado, acao.opcaoId);
    case "avancar":
      return avancar(estado);
    case "reiniciar":
      return iniciarEstado(acao.rodada);
  }
}

/** Ids das aves acertadas na rodada (contam como descoberta no Álbum). */
export function avesAcertadas(estado: EstadoRodada): string[] {
  return estado.resultados.filter((r) => r.acertou).map((r) => r.aveId);
}
