// Montagem de rodadas e perguntas. Módulo puro (sem React).
import { aves as todasAsAves } from "../data/aves";
import type { Ave, Dificuldade, JogoQuiz, Pergunta, Rodada } from "../data/types";

export const PERGUNTAS_POR_RODADA = 5;

export type ConfigDificuldade = {
  rotulo: string;
  opcoes: number;
  tentativas: number;
  /** Prioriza aves parecidas (`semelhantes`) como distratores. */
  usarSemelhantes: boolean;
};

export const CONFIG_DIFICULDADE: Record<Dificuldade, ConfigDificuldade> = {
  facil: { rotulo: "Fácil", opcoes: 3, tentativas: 2, usarSemelhantes: false },
  medio: { rotulo: "Médio", opcoes: 4, tentativas: 1, usarSemelhantes: false },
  dificil: { rotulo: "Difícil", opcoes: 4, tentativas: 1, usarSemelhantes: true },
};

export const DIFICULDADE_PADRAO: Dificuldade = "facil";

/** Gerador de número aleatório em [0, 1). Injetável para testes à mão. */
export type Rng = () => number;

/** Embaralha (Fisher-Yates) sem alterar o array original. */
export function embaralhar<T>(lista: readonly T[], rng: Rng = Math.random): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Sorteia `quantidade` distratores entre as demais aves.
 * No Difícil, as `semelhantes` vêm primeiro; o resto completa ao acaso.
 */
export function escolherDistratores(
  alvo: Ave,
  quantidade: number,
  dificuldade: Dificuldade,
  aves: readonly Ave[] = todasAsAves,
  rng: Rng = Math.random,
): string[] {
  const outras = aves.filter((ave) => ave.id !== alvo.id).map((ave) => ave.id);
  const parecidas = CONFIG_DIFICULDADE[dificuldade].usarSemelhantes
    ? embaralhar(
        alvo.semelhantes.filter((id) => outras.includes(id)),
        rng,
      )
    : [];
  const resto = embaralhar(
    outras.filter((id) => !parecidas.includes(id)),
    rng,
  );
  return [...parecidas, ...resto].slice(0, quantidade);
}

/** Monta uma pergunta para a ave (também usada nos encontros do Passeio). */
export function montarPergunta(
  alvo: Ave,
  dificuldade: Dificuldade,
  aves: readonly Ave[] = todasAsAves,
  rng: Rng = Math.random,
): Pergunta {
  const { opcoes } = CONFIG_DIFICULDADE[dificuldade];
  const distratores = escolherDistratores(alvo, opcoes - 1, dificuldade, aves, rng);
  return {
    aveId: alvo.id,
    opcoes: embaralhar([alvo.id, ...distratores], rng),
    respostaId: alvo.id,
  };
}

/**
 * Monta uma rodada de 5 perguntas com aves diferentes.
 * No jogo Canto, usa só aves com canto quando há o suficiente;
 * senão usa todas (o player mostra aviso amigável se faltar o arquivo).
 */
export function montarRodada(
  jogo: JogoQuiz,
  dificuldade: Dificuldade,
  aves: readonly Ave[] = todasAsAves,
  rng: Rng = Math.random,
): Rodada {
  const comCanto = aves.filter((ave) => ave.midia.canto !== null);
  const candidatas =
    jogo === "canto" && comCanto.length >= PERGUNTAS_POR_RODADA ? comCanto : aves;
  const sorteadas = embaralhar(candidatas, rng).slice(0, PERGUNTAS_POR_RODADA);
  return {
    jogo,
    dificuldade,
    // distratores vêm de todas as aves, não só das candidatas
    perguntas: sorteadas.map((ave) => montarPergunta(ave, dificuldade, aves, rng)),
  };
}
