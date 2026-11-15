import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { fotoDe, getAve } from "../../data/aves";
import { GameShell } from "../../layouts/GameShell";
import type { QuizRodada } from "../../quiz/useQuizRodada";
import { AnswerButton } from "../ui/AnswerButton";
import { Button } from "../ui/Button";
import { IconAvancar } from "../ui/icons";
import { ProgressDots } from "../ui/ProgressDots";
import { Toast } from "../ui/Toast";
import { AudioButton } from "./AudioButton";
import { BirdCard } from "./BirdCard";
import { DifficultyPicker } from "./DifficultyPicker";
import { RoundSummary } from "./RoundSummary";

type QuizLayoutProps = {
  titulo: string;
  quiz: QuizRodada;
  /** Tela de escolha de nível. */
  intro: { icone: ReactNode; pergunta: string; texto: string };
  /** Palco da pergunta; recebe o Toast para sobrepor no topo. */
  renderPalco: (toast: ReactNode) => ReactNode;
  /** Mostra a foto da ave nas opções. */
  opcoesComFoto?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Esqueleto comum dos quizzes: nível → perguntas (palco + opções/cartão) → resumo. */
export function QuizLayout({ titulo, quiz, intro, renderPalco, opcoesComFoto = false }: QuizLayoutProps) {
  const { etapa, estado, pergunta, ave, mostrarCartao, ultima, retorno, nivel } = quiz;
  const { rodada, indice, fase } = estado;

  const primeiraOpcaoRef = useRef<HTMLButtonElement>(null);
  const proximaRef = useRef<HTMLButtonElement>(null);

  // foco: "Próxima" quando o cartão aparece; 1ª opção na pergunta seguinte
  useEffect(() => {
    if (mostrarCartao) proximaRef.current?.focus();
  }, [mostrarCartao]);
  useEffect(() => {
    if (etapa === "jogo" && fase === "pergunta" && indice > 0) primeiraOpcaoRef.current?.focus();
  }, [etapa, fase, indice]);

  if (etapa === "nivel") {
    return (
      <GameShell titulo={titulo}>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex size-28 items-center justify-center rounded-full bg-neblina text-mata-950 shadow-cartao"
          >
            {intro.icone}
          </motion.div>
          <div>
            <h2 className="text-titulo text-mata-900">{intro.pergunta}</h2>
            <p className="mt-2 text-corpo text-tinta-suave">{intro.texto}</p>
          </div>
          <DifficultyPicker valor={quiz.dificuldadeSalva} onChange={quiz.definirDificuldade} />
          <Button onClick={() => quiz.comecar(quiz.dificuldadeSalva)} className="w-full sm:w-auto sm:px-12">
            Começar <IconAvancar className="size-7" />
          </Button>
        </div>
      </GameShell>
    );
  }

  if (fase === "fim") {
    return (
      <GameShell titulo={titulo} pontos={estado.pontos}>
        <RoundSummary
          resultados={estado.resultados}
          pontos={estado.pontos}
          melhorSequencia={estado.melhorSequencia}
          nivel={nivel}
          onJogarDeNovo={() => quiz.comecar(rodada.dificuldade)}
          onTrocarNivel={() => quiz.setEtapa("nivel")}
        />
      </GameShell>
    );
  }

  const toast = (
    <AnimatePresence mode="wait">
      {retorno && (
        <Toast
          key={`${indice}-${estado.ultimoRetorno}-${estado.descartadas.length}`}
          mensagem={retorno.texto}
          tipo={retorno.tipo}
        />
      )}
    </AnimatePresence>
  );

  return (
    <GameShell titulo={titulo} pontos={estado.pontos}>
      <div className="flex min-h-0 flex-1 flex-col gap-3 landscape:flex-row landscape:gap-5">
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <ProgressDots total={rodada.perguntas.length} atual={indice} />
          {renderPalco(toast)}
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
                <Button ref={proximaRef} onClick={quiz.avancar} className="w-full">
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
                {pergunta.opcoes.map((id, i) => {
                  const opcao = getAve(id);
                  return (
                    <AnswerButton
                      key={id}
                      ref={i === 0 ? primeiraOpcaoRef : undefined}
                      rotulo={opcao.nomePopular}
                      imagem={opcoesComFoto ? fotoDe(opcao) : undefined}
                      estado={quiz.estadoDaOpcao(id)}
                      indice={i}
                      onEscolher={() => quiz.responder(id)}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameShell>
  );
}
