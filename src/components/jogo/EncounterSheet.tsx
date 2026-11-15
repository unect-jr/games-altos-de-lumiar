import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getAve } from "../../data/aves";
import type { Ave, Dificuldade } from "../../data/types";
import { pararAudio, precarregarAudio, tocarAudio } from "../../lib/audio";
import { CONFIG_DIFICULDADE, montarPergunta } from "../../quiz/montarRodada";
import { PONTOS_SEGUNDA_TENTATIVA, pontosDoAcerto } from "../../quiz/pontuacao";
import { useSessao } from "../../store/sessao";
import { AnswerButton, type EstadoOpcao } from "../ui/AnswerButton";
import { Button } from "../ui/Button";
import { IconAvancar, IconNova } from "../ui/icons";
import { Toast } from "../ui/Toast";
import { AudioButton } from "./AudioButton";
import { BirdCard } from "./BirdCard";
import { Confetti } from "./Confetti";
import { SilhouetteStage } from "./SilhouetteStage";

export type ResultadoEncontro =
  | { tipo: "registrou"; pontos: number; dePrimeira: boolean }
  | { tipo: "voou" }
  | { tipo: "deixou-ir" };

type EncounterSheetProps = {
  ave: Ave;
  dificuldade: Dificuldade;
  /** Acertos seguidos antes deste encontro (para o bônus). */
  sequencia: number;
  onFim: (resultado: ResultadoEncontro) => void;
};

type Fase = "pergunta" | "acerto" | "voou";

const EASE = [0.22, 1, 0.36, 1] as const;
/** Tempo para ver o ✓ antes do cartão da ave aparecer. */
const ESPERA_CARTAO_MS = 700;

/**
 * Tela de encontro do Passeio, por cima do mapa. Acerto: registra no Álbum + confete.
 * Erro: "A ave voou!" e ela some sem revelar o nome (o mistério continua).
 */
export function EncounterSheet({ ave, dificuldade, sequencia, onFim }: EncounterSheetProps) {
  const { progresso, descobrir } = useSessao();
  const [pergunta] = useState(() => montarPergunta(ave, dificuldade));
  const [nova] = useState(() => !(ave.id in progresso.descobertas));
  const [fase, setFase] = useState<Fase>("pergunta");
  const [tentativas, setTentativas] = useState(CONFIG_DIFICULDADE[dificuldade].tentativas);
  const [descartadas, setDescartadas] = useState<string[]>([]);
  const [pontos, setPontos] = useState(0);
  const [mostrarCartao, setMostrarCartao] = useState(false);
  const [aviso, setAviso] = useState<{ texto: string; tipo: "acerto" | "quase" | "info"; chave: number } | null>(null);

  const primeiraOpcaoRef = useRef<HTMLButtonElement>(null);
  const continuarRef = useRef<HTMLButtonElement>(null);

  const resultado: ResultadoEncontro =
    fase === "acerto"
      ? { tipo: "registrou", pontos, dePrimeira: descartadas.length === 0 }
      : fase === "voou"
        ? { tipo: "voou" }
        : { tipo: "deixou-ir" };

  function terminar() {
    pararAudio();
    onFim(resultado);
  }

  useEffect(() => {
    precarregarAudio(ave.midia.canto);
    primeiraOpcaoRef.current?.focus();
    return pararAudio;
  }, [ave]);

  // depois do ✓ (ou do voo), mostra o cartão / o botão de continuar
  useEffect(() => {
    if (fase === "pergunta") return;
    const timer = window.setTimeout(() => setMostrarCartao(true), ESPERA_CARTAO_MS);
    return () => window.clearTimeout(timer);
  }, [fase]);
  useEffect(() => {
    if (mostrarCartao) continuarRef.current?.focus();
  }, [mostrarCartao]);

  function responder(opcaoId: string) {
    if (fase !== "pergunta" || descartadas.includes(opcaoId)) return;
    if (opcaoId === pergunta.respostaId) {
      const dePrimeira = descartadas.length === 0;
      const ganhos = dePrimeira ? pontosDoAcerto(sequencia + 1) : PONTOS_SEGUNDA_TENTATIVA;
      descobrir([ave.id]);
      if (ave.midia.canto) void tocarAudio(ave.midia.canto); // dentro do gesto
      setPontos(ganhos);
      setFase("acerto");
      setAviso({ texto: `Registrada! +${ganhos}`, tipo: "acerto", chave: Date.now() });
      return;
    }
    setDescartadas((atuais) => [...atuais, opcaoId]);
    if (tentativas > 1) {
      setTentativas(tentativas - 1);
      setAviso({ texto: "Quase! Tente de novo.", tipo: "quase", chave: Date.now() });
    } else {
      pararAudio();
      setFase("voou");
      setAviso({ texto: "A ave voou!", tipo: "info", chave: Date.now() });
    }
  }

  // atalhos: 1–4 escolhem; Esc deixa a ave ir (ou continua depois da resposta)
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.repeat || evento.ctrlKey || evento.metaKey || evento.altKey) return;
      if (evento.key === "Escape") {
        evento.preventDefault();
        if (fase === "pergunta" || mostrarCartao) terminar();
        return;
      }
      if (fase !== "pergunta") return;
      const opcaoId = pergunta.opcoes[Number(evento.key) - 1];
      if (opcaoId) responder(opcaoId);
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  });

  function estadoDaOpcao(id: string): EstadoOpcao {
    if (descartadas.includes(id)) return "descartada";
    if (fase === "pergunta") return "livre";
    // no voo, a certa NÃO é marcada: o mistério continua
    if (fase === "acerto" && id === pergunta.respostaId) return "certa";
    return "apagada";
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Uma ave apareceu!"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-10 flex bg-mata-950/60 p-2 sm:p-3"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-cartao bg-creme-100 p-3 shadow-cartao landscape:flex-row landscape:gap-5"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <h2 className="text-subtitulo text-mata-900">
            {fase === "voou" ? "A ave voou!" : fase === "acerto" ? "Você encontrou!" : "Uma ave apareceu!"}
          </h2>
          <SilhouetteStage ave={ave} revelada={fase === "acerto"} voou={fase === "voou"} className="min-h-32 flex-1">
            <AnimatePresence mode="wait">
              {aviso && <Toast key={aviso.chave} mensagem={aviso.texto} tipo={aviso.tipo} />}
            </AnimatePresence>
          </SilhouetteStage>
          {fase === "pergunta" && <AudioButton src={ave.midia.canto} rotulo="Dica: ouvir o canto" />}
        </div>

        <div className="flex min-h-0 flex-col justify-center pb-1 landscape:w-[45%] landscape:shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {mostrarCartao ? (
              <motion.div
                key="fim"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex min-h-0 flex-col gap-3"
              >
                {fase === "acerto" ? (
                  <BirdCard
                    ave={ave}
                    chamada="Registrada no Álbum:"
                    className="min-h-0 overflow-y-auto [touch-action:pan-y]"
                  >
                    {nova && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-canario px-4 py-2 font-titulo text-botao font-semibold text-mata-950">
                        <IconNova className="size-6" /> Nova!
                      </span>
                    )}
                    {ave.midia.canto && <AudioButton src={ave.midia.canto} />}
                  </BirdCard>
                ) : (
                  <p className="rounded-cartao bg-creme-50 p-5 text-corpo text-tinta shadow-cartao">
                    Ela pode aparecer de novo. Continue procurando!
                  </p>
                )}
                <Button ref={continuarRef} onClick={terminar} className="w-full">
                  Continuar passeio <IconAvancar className="size-7" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="opcoes"
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="flex flex-col gap-3"
              >
                <div role="group" aria-label="Escolha o nome da ave" className="grid gap-3 sm:grid-cols-2 landscape:grid-cols-1">
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
                </div>
                {fase === "pergunta" && (
                  <Button variante="fantasma" onClick={terminar} className="w-full text-mata-900">
                    Deixar a ave ir
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {fase === "acerto" && <Confetti />}
      </motion.div>
    </motion.div>
  );
}
