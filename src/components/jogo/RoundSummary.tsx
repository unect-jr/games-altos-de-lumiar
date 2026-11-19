import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { fotoDe, getAve, PLACEHOLDER_AVE } from "../../data/aves";
import type { ResultadoPergunta } from "../../quiz/pontuacao";
import { calcularEstrelas } from "../../quiz/pontuacao";
import { Button } from "../ui/Button";
import { IconCerto, IconEstrela, IconRepetir, IconSilhueta } from "../ui/icons";

type RoundSummaryProps = {
  resultados: ResultadoPergunta[];
  pontos: number;
  melhorSequencia: number;
  nivel: string;
  onJogarDeNovo: () => void;
  onTrocarNivel: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const MENSAGENS: Record<1 | 2 | 3, string> = {
  3: "Incrível! Você conhece as aves!",
  2: "Muito bem! Está pegando o jeito.",
  1: "Boa! Cada ave é uma descoberta.",
};

/** Resumo do fim da rodada: estrelas (1 a 3), pontos e as aves da rodada. */
export function RoundSummary({
  resultados,
  pontos,
  melhorSequencia,
  nivel,
  onJogarDeNovo,
  onTrocarNivel,
}: RoundSummaryProps) {
  const acertos = resultados.filter((r) => r.acertou).length;
  const estrelas = calcularEstrelas(acertos, resultados.length);
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    botaoRef.current?.focus();
  }, []);

  return (
    <section aria-labelledby="titulo-resumo" className="flex min-h-0 flex-1 flex-col items-center gap-4">
      <div className="flex gap-2 text-canario" role="img" aria-label={`${estrelas} de 3 estrelas`}>
        {[1, 2, 3].map((n) => (
          <motion.span
            key={n}
            initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.45, delay: 0.15 + n * 0.15, ease: EASE }}
          >
            <IconEstrela cheia={n <= estrelas} className={`size-16 ${n === 2 ? "-translate-y-3" : ""}`} />
          </motion.span>
        ))}
      </div>

      <div className="text-center">
        <h2 id="titulo-resumo" className="text-titulo text-mata-900">
          {MENSAGENS[estrelas]}
        </h2>
        <p className="mt-1 text-corpo text-tinta-suave">
          {acertos} de {resultados.length} aves · ★ {pontos} pontos
          {melhorSequencia >= 2 && ` · sequência de ${melhorSequencia}`} · {nivel}
        </p>
      </div>

      <ul
        aria-label="Aves da rodada"
        className="grid min-h-0 w-full flex-1 auto-rows-min gap-2 overflow-y-auto [touch-action:pan-y] sm:grid-cols-2"
      >
        {resultados.map((r, i) => {
          const ave = getAve(r.aveId);
          return (
            <motion.li
              key={r.aveId}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.07, ease: EASE }}
              className="flex items-center gap-3 rounded-botao bg-creme-50 p-2 pr-4 shadow-cartao"
            >
              <img
                src={fotoDe(ave)}
                alt=""
                loading="lazy"
                onError={(evento) => {
                  // imagem quebrada: troca pelo desenho neutro (uma vez só)
                  if (!evento.currentTarget.src.endsWith(PLACEHOLDER_AVE)) evento.currentTarget.src = PLACEHOLDER_AVE;
                }}
                className="size-12 shrink-0 rounded-xl bg-creme-100 object-cover"
              />
              <span className="flex-1 font-titulo text-botao font-semibold text-mata-900">{ave.nomePopular}</span>
              {r.acertou ? (
                <span className="inline-flex items-center gap-1 text-corpo font-bold text-acerto">
                  <IconCerto className="size-6" /> Acertou
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-corpo font-bold text-tinta-suave">
                  <IconSilhueta className="size-6" /> Aprendeu
                </span>
              )}
            </motion.li>
          );
        })}
      </ul>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button ref={botaoRef} onClick={onJogarDeNovo}>
          <IconRepetir className="size-7" /> Jogar de novo
        </Button>
        <Button variante="secundario" onClick={onTrocarNivel}>
          Trocar nível
        </Button>
      </div>
    </section>
  );
}
