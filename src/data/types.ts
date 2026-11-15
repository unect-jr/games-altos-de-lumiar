// Tipos de domínio. Sem enum: só union types.

export type Habitat = "jardim" | "mata" | "agua" | "campo" | "comedouro";
export type Raridade = "comum" | "incomum" | "rara";
export type Dificuldade = "facil" | "medio" | "dificil";
export type JogoQuiz = "silhueta" | "canto";

export type Credito = {
  tipo: "canto" | "foto" | "silhueta";
  autor: string;
  licenca: string;
  /** URL ou referência (para sons: número/URL do XC). */
  fonte: string;
};

/** Caminhos em `public/`. `null` = arquivo ainda não existe (usa placeholder). */
export type Midia = {
  silhueta: string | null;
  foto: string | null;
  canto: string | null;
  creditos: Credito[];
};

export type Ave = {
  id: string;
  slug: string;
  nomePopular: string;
  nomeCientifico: string;
  /** `null` até ser validada com o guia do lodge. */
  familia: string | null;
  habitats: Habitat[];
  raridade: Raridade;
  /** Ids de aves parecidas (distratores do nível Difícil). */
  semelhantes: string[];
  curiosidade: string;
  midia: Midia;
};

export type Progresso = {
  /** id da ave → data da descoberta (ISO). */
  descobertas: Record<string, string>;
  pontuacao: number;
  melhorSequencia: number;
  dificuldade: Dificuldade;
  somLigado: boolean;
};

export type Pergunta = {
  aveId: string;
  /** Ids das opções, já embaralhadas (inclui a resposta). */
  opcoes: string[];
  respostaId: string;
};

export type Rodada = {
  jogo: JogoQuiz;
  dificuldade: Dificuldade;
  perguntas: Pergunta[];
};
