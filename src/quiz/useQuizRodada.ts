// Andamento de uma rodada de quiz na tela (Silhueta e Canto).
import { useEffect, useReducer, useState } from "react";
import type { TipoToast } from "../components/ui/Toast";
import type { EstadoOpcao } from "../components/ui/AnswerButton";
import { getAve } from "../data/aves";
import type { Dificuldade, JogoQuiz } from "../data/types";
import { pararAudio, precarregarAudio, tocarAudio } from "../lib/audio";
import { useSessao } from "../store/sessao";
import { CONFIG_DIFICULDADE, montarRodada } from "./montarRodada";
import { iniciarEstado, reduzirRodada, type EstadoRodada } from "./pontuacao";

export type EtapaQuiz = "nivel" | "jogo";

type OpcoesQuiz = {
  /** Toca o canto quando a pergunta aparece (Canto). Sempre dentro de um gesto. */
  tocarAoPerguntar?: boolean;
  /** Toca o canto quando a ave é revelada (Silhueta). */
  tocarAoRevelar?: boolean;
};

/** Tempo para ver o ✓ / a resposta certa antes do cartão da ave aparecer. */
const ESPERA_CARTAO_MS = 700;

function mensagemDoRetorno(estado: EstadoRodada): { texto: string; tipo: TipoToast } | null {
  switch (estado.ultimoRetorno) {
    case "acerto": {
      const ultimo = estado.resultados[estado.resultados.length - 1];
      const extra = estado.sequencia >= 2 ? ` · ${estado.sequencia} seguidas!` : "";
      return { texto: `Acertou! +${ultimo?.pontos ?? 0}${extra}`, tipo: "acerto" };
    }
    case "tente-de-novo":
      return { texto: "Quase! Tente de novo.", tipo: "quase" };
    case "erro":
      return { texto: "Olha quem era!", tipo: "info" };
    default:
      return null;
  }
}

function cantoDe(aveId: string | undefined): string | null {
  return aveId ? getAve(aveId).midia.canto : null;
}

export function useQuizRodada(jogo: JogoQuiz, { tocarAoPerguntar = false, tocarAoRevelar = false }: OpcoesQuiz = {}) {
  const { progresso, definirDificuldade, descobrir, somarRodada } = useSessao();
  const [etapa, setEtapa] = useState<EtapaQuiz>("nivel");
  const [estado, dispatch] = useReducer(reduzirRodada, progresso.dificuldade, (d: Dificuldade) =>
    iniciarEstado(montarRodada(jogo, d)),
  );
  /** Última opção tocada (para marcar o erro final, que não entra em `descartadas`). */
  const [escolhida, setEscolhida] = useState<string | null>(null);
  /** Índice da pergunta cujo cartão da ave já pode aparecer. */
  const [cartaoDe, setCartaoDe] = useState<number | null>(null);

  const { rodada, indice, fase } = estado;
  const pergunta = rodada.perguntas[indice];
  const ave = getAve(pergunta.aveId);
  const revelada = fase === "feedback";
  const mostrarCartao = revelada && cartaoDe === indice;
  const ultima = indice === rodada.perguntas.length - 1;

  // pré-carrega o canto atual e o da próxima pergunta; para o som ao sair da tela
  const proximoCanto = cantoDe(rodada.perguntas[indice + 1]?.aveId);
  useEffect(() => {
    precarregarAudio(ave.midia.canto);
    precarregarAudio(proximoCanto);
  }, [ave, proximoCanto]);
  useEffect(() => pararAudio, []);

  // depois do ✓, mostra o cartão da ave
  useEffect(() => {
    if (fase !== "feedback") return;
    const timer = window.setTimeout(() => setCartaoDe(indice), ESPERA_CARTAO_MS);
    return () => window.clearTimeout(timer);
  }, [fase, indice]);

  function responder(opcaoId: string) {
    if (fase !== "pergunta" || estado.descartadas.includes(opcaoId)) return;
    setEscolhida(opcaoId);
    const acertou = opcaoId === pergunta.respostaId;
    if (acertou) descobrir([pergunta.aveId]); // acerto conta para o Álbum na hora
    // revela a ave (acerto ou última tentativa): toca o canto dentro do gesto
    const revela = acertou || estado.tentativasRestantes <= 1;
    if (tocarAoRevelar && revela && ave.midia.canto) void tocarAudio(ave.midia.canto);
    dispatch({ tipo: "responder", opcaoId });
  }

  function avancar() {
    pararAudio();
    if (ultima) somarRodada(estado.pontos, estado.melhorSequencia);
    else if (tocarAoPerguntar && proximoCanto) void tocarAudio(proximoCanto);
    setEscolhida(null);
    dispatch({ tipo: "avancar" });
  }

  function comecar(dificuldade: Dificuldade) {
    const nova = montarRodada(jogo, dificuldade);
    const primeiroCanto = cantoDe(nova.perguntas[0]?.aveId);
    if (tocarAoPerguntar && primeiroCanto) void tocarAudio(primeiroCanto);
    setEscolhida(null);
    setCartaoDe(null);
    dispatch({ tipo: "reiniciar", rodada: nova });
    setEtapa("jogo");
  }

  // atalhos 1–4 para as opções (teclado)
  useEffect(() => {
    if (etapa !== "jogo" || fase !== "pergunta") return;
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.repeat || evento.ctrlKey || evento.metaKey || evento.altKey) return;
      const numero = Number(evento.key);
      const opcaoId = pergunta.opcoes[numero - 1];
      if (Number.isInteger(numero) && opcaoId) responder(opcaoId);
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  });

  function estadoDaOpcao(id: string): EstadoOpcao {
    if (fase === "pergunta") return estado.descartadas.includes(id) ? "descartada" : "livre";
    if (id === pergunta.respostaId) return "certa";
    if (id === escolhida || estado.descartadas.includes(id)) return "descartada";
    return "apagada";
  }

  return {
    etapa,
    setEtapa,
    estado,
    pergunta,
    ave,
    revelada,
    mostrarCartao,
    ultima,
    retorno: mensagemDoRetorno(estado),
    nivel: CONFIG_DIFICULDADE[rodada.dificuldade].rotulo,
    dificuldadeSalva: progresso.dificuldade,
    definirDificuldade,
    responder,
    avancar,
    comecar,
    estadoDaOpcao,
  };
}

export type QuizRodada = ReturnType<typeof useQuizRodada>;
