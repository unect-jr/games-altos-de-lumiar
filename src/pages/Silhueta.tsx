import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AudioButton } from "../components/jogo/AudioButton";
import { BirdCard } from "../components/jogo/BirdCard";
import { DifficultyPicker } from "../components/jogo/DifficultyPicker";
import { RoundSummary } from "../components/jogo/RoundSummary";
import { SilhouetteStage } from "../components/jogo/SilhouetteStage";
import { AnswerButton, type EstadoOpcao } from "../components/ui/AnswerButton";
import { Button } from "../components/ui/Button";
import { IconAvancar, IconSilhueta } from "../components/ui/icons";
import { ProgressDots } from "../components/ui/ProgressDots";
import { Toast, type TipoToast } from "../components/ui/Toast";
import { getAve } from "../data/aves";
import type { Dificuldade } from "../data/types";
import { GameShell } from "../layouts/GameShell";
import { pararAudio, precarregarAudio, tocarAudio } from "../lib/audio";
import { CONFIG_DIFICULDADE, montarRodada } from "../quiz/montarRodada";
import { iniciarEstado, reduzirRodada, type EstadoRodada } from "../quiz/pontuacao";
import { useSessao } from "../store/sessao";

type Etapa = "nivel" | "jogo";

/** Tempo para ver o ✓ / a resposta certa antes do cartão da ave aparecer. */
const ESPERA_CARTAO_MS = 700;
const EASE = [0.22, 1, 0.36, 1] as const;

function novaRodada(dificuldade: Dificuldade): EstadoRodada {
  return iniciarEstado(montarRodada("silhueta", dificuldade));
}

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

export function Silhueta() {
  const { progresso, definirDificuldade, descobrir, somarRodada } = useSessao();
  const [etapa, setEtapa] = useState<Etapa>("nivel");
  const [estado, dispatch] = useReducer(reduzirRodada, progresso.dificuldade, novaRodada);
  /** Última opção tocada (para marcar o erro final, que não entra em `descartadas`). */
  const [escolhida, setEscolhida] = useState<string | null>(null);
  /** Índice da pergunta cujo cartão da ave já pode aparecer. */
  const [cartaoDe, setCartaoDe] = useState<number | null>(null);

  const primeiraOpcaoRef = useRef<HTMLButtonElement>(null);
  const proximaRef = useRef<HTMLButtonElement>(null);

  const { rodada, indice, fase } = estado;
  const pergunta = rodada.perguntas[indice];
  const ave = getAve(pergunta.aveId);
  const revelada = fase === "feedback";
  const mostrarCartao = revelada && cartaoDe === indice;
  const ultima = indice === rodada.perguntas.length - 1;

  // pré-carrega o canto da pergunta atual; para o som ao sair da tela
  useEffect(() => {
    precarregarAudio(ave.midia.canto);
  }, [ave]);
  useEffect(() => pararAudio, []);

  // depois do ✓, mostra o cartão da ave
  useEffect(() => {
    if (fase !== "feedback") return;
    const timer = window.setTimeout(() => setCartaoDe(indice), ESPERA_CARTAO_MS);
    return () => window.clearTimeout(timer);
  }, [fase, indice]);

  // foco: "Próxima" quando o cartão aparece; 1ª opção na pergunta seguinte
  useEffect(() => {
    if (mostrarCartao) proximaRef.current?.focus();
  }, [mostrarCartao]);
  useEffect(() => {
    if (etapa === "jogo" && fase === "pergunta" && indice > 0) primeiraOpcaoRef.current?.focus();
  }, [etapa, fase, indice]);

  function responder(opcaoId: string) {
    if (fase !== "pergunta" || estado.descartadas.includes(opcaoId)) return;
    setEscolhida(opcaoId);
    const acertou = opcaoId === pergunta.respostaId;
    if (acertou) descobrir([pergunta.aveId]); // acerto conta para o Álbum na hora
    // revela a ave (acerto ou última tentativa): toca o canto dentro do gesto
    if (ave.midia.canto && (acertou || estado.tentativasRestantes <= 1)) void tocarAudio(ave.midia.canto);
    dispatch({ tipo: "responder", opcaoId });
  }

  function avancar() {
    pararAudio();
    if (ultima) somarRodada(estado.pontos, estado.melhorSequencia);
    setEscolhida(null);
    dispatch({ tipo: "avancar" });
  }

  function comecar(dificuldade: Dificuldade) {
    setEscolhida(null);
    setCartaoDe(null);
    dispatch({ tipo: "reiniciar", rodada: montarRodada("silhueta", dificuldade) });
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

  const retorno = mensagemDoRetorno(estado);
  const nivel = CONFIG_DIFICULDADE[rodada.dificuldade].rotulo;

  if (etapa === "nivel") {
    return (
      <GameShell titulo="Silhueta">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex size-28 items-center justify-center rounded-full bg-neblina text-mata-950 shadow-cartao"
          >
            <IconSilhueta className="size-20" />
          </motion.div>
          <div>
            <h2 className="text-titulo text-mata-900">Que ave é essa?</h2>
            <p className="mt-2 text-corpo text-tinta-suave">Olhe a sombra e escolha o nome. São 5 aves!</p>
          </div>
          <DifficultyPicker valor={progresso.dificuldade} onChange={definirDificuldade} />
          <Button onClick={() => comecar(progresso.dificuldade)} className="w-full sm:w-auto sm:px-12">
            Começar <IconAvancar className="size-7" />
          </Button>
        </div>
      </GameShell>
    );
  }

  if (fase === "fim") {
    return (
      <GameShell titulo="Silhueta" pontos={estado.pontos}>
        <RoundSummary
          resultados={estado.resultados}
          pontos={estado.pontos}
          melhorSequencia={estado.melhorSequencia}
          nivel={nivel}
          onJogarDeNovo={() => comecar(rodada.dificuldade)}
          onTrocarNivel={() => setEtapa("nivel")}
        />
      </GameShell>
    );
  }

  return (
    <GameShell titulo="Silhueta" pontos={estado.pontos}>
      <div className="flex min-h-0 flex-1 flex-col gap-3 landscape:flex-row landscape:gap-5">
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <ProgressDots total={rodada.perguntas.length} atual={indice} />
          <SilhouetteStage key={`${indice}-${ave.id}`} ave={ave} revelada={revelada} className="flex-1">
            <AnimatePresence mode="wait">
              {retorno && (
                <Toast
                  key={`${indice}-${estado.ultimoRetorno}-${estado.descartadas.length}`}
                  mensagem={retorno.texto}
                  tipo={retorno.tipo}
                />
              )}
            </AnimatePresence>
          </SilhouetteStage>
        </div>

        <div className="flex min-h-0 flex-col justify-center pb-1 landscape:w-[45%] landscape:shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {mostrarCartao ? (
              <motion.div
                key={`cartao-${indice}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex min-h-0 flex-col gap-3"
              >
                <BirdCard
                  ave={ave}
                  chamada={estado.ultimoRetorno === "acerto" ? "Você descobriu:" : "Esta é a ave certa:"}
                  className="min-h-0 overflow-y-auto [touch-action:pan-y]"
                >
                  {ave.midia.canto && <AudioButton src={ave.midia.canto} />}
                </BirdCard>
                <Button ref={proximaRef} onClick={avancar} className="w-full">
                  {ultima ? "Ver resultado" : "Próxima"} <IconAvancar className="size-7" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key={`opcoes-${indice}`}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2, ease: EASE }}
                role="group"
                aria-label="Escolha o nome da ave"
                className="grid gap-3 sm:grid-cols-2 landscape:grid-cols-1"
              >
                {pergunta.opcoes.map((id, i) => (
                  <AnswerButton
                    key={id}
                    ref={i === 0 ? primeiraOpcaoRef : undefined}
                    rotulo={getAve(id).nomePopular}
                    estado={estadoDaOpcao(id)}
                    indice={i}
                    onEscolher={() => responder(id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameShell>
  );
}
