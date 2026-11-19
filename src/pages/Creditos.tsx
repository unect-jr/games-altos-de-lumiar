import { motion } from "motion/react";
import { aves } from "../data/aves";
import { fotosLodge, ROTULO_TIPO_CREDITO } from "../data/creditos";
import type { Ave, Credito } from "../data/types";
import { IconCerto, IconQuase } from "../components/ui/icons";
import { GameShell } from "../layouts/GameShell";

const TIPOS: Credito["tipo"][] = ["canto", "foto", "silhueta"];
const EASE = [0.22, 1, 0.36, 1] as const;

type Linha = {
  rotulo: string;
  /** Arquivo em `public/`; `null` = ainda não existe. */
  arquivo: string | null;
  credito: Credito | undefined;
};

function linhasDaAve(ave: Ave): Linha[] {
  return TIPOS.map((tipo) => ({
    rotulo: ROTULO_TIPO_CREDITO[tipo],
    arquivo: ave.midia[tipo],
    credito: ave.midia.creditos.find((c) => c.tipo === tipo),
  }));
}

const linhasLodge: Linha[] = fotosLodge.map((foto, i) => ({
  rotulo: `Foto ${i + 1}`,
  arquivo: foto.arquivo,
  credito: foto.creditos[0],
}));

const todasAsLinhas = [...aves.flatMap(linhasDaAve), ...linhasLodge];
const pendentes = todasAsLinhas.filter((l) => !l.arquivo || !l.credito).length;

/** Página para adultos: autor, licença e fonte de cada mídia usada. */
export function Creditos() {
  return (
    <GameShell titulo="Créditos" rolavel>
      <div className="flex flex-col gap-6 pb-8">
        <section className="rounded-cartao bg-creme-100 p-5">
          <h2 className="text-subtitulo text-mata-900">Para adultos</h2>
          <p className="mt-2 text-corpo text-tinta">
            Aqui estão a origem e a licença dos sons e imagens usados nos jogos.
          </p>
          <p className="mt-2 text-corpo text-tinta">
            Jogos feitos pela Unect Jr. para o Altos de Lumiar Birding Lodge. Versão de demonstração.
          </p>
          {pendentes > 0 && (
            <p role="status" className="mt-3 inline-flex items-center gap-2 text-corpo font-bold text-tinta">
              <IconQuase className="size-6 shrink-0 text-quase" />
              {pendentes === 1 ? "1 crédito pendente" : `${pendentes} créditos pendentes`}
            </p>
          )}
        </section>

        <section aria-labelledby="titulo-aves" className="flex flex-col gap-3">
          <h2 id="titulo-aves" className="text-subtitulo text-mata-900">
            Aves
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {aves.map((ave, i) => (
              <motion.li
                key={ave.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.04, ease: EASE }}
                className="rounded-cartao bg-creme-50 p-4 shadow-cartao"
              >
                <h3 className="font-titulo text-botao font-semibold text-mata-900">{ave.nomePopular}</h3>
                <p className="text-corpo text-tinta-suave italic">{ave.nomeCientifico}</p>
                <ListaCreditos linhas={linhasDaAve(ave)} />
              </motion.li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="titulo-lodge" className="rounded-cartao bg-creme-50 p-4 shadow-cartao">
          <h2 id="titulo-lodge" className="text-subtitulo text-mata-900">
            Fotos do lodge
          </h2>
          <p className="mt-1 text-corpo text-tinta-suave">Cedidas pelo Altos de Lumiar Birding Lodge.</p>
          <ListaCreditos linhas={linhasLodge} />
        </section>
      </div>
    </GameShell>
  );
}

function ListaCreditos({ linhas }: { linhas: Linha[] }) {
  return (
    <dl className="mt-3 flex flex-col gap-2">
      {linhas.map((linha) => (
        <div key={linha.rotulo} className="flex gap-2">
          {linha.arquivo && linha.credito ? (
            <IconCerto className="mt-1 size-5 shrink-0 text-acerto" />
          ) : (
            <IconQuase className="mt-1 size-5 shrink-0 text-quase" />
          )}
          <div className="min-w-0">
            <dt className="text-corpo font-bold text-tinta">{linha.rotulo}</dt>
            <dd className="text-corpo break-words text-tinta-suave">
              {!linha.arquivo ? (
                "Arquivo pendente"
              ) : linha.credito ? (
                <>
                  {linha.credito.autor} · {linha.credito.licenca}
                  <br />
                  <span className="break-all">{linha.credito.fonte}</span>
                </>
              ) : (
                "Crédito pendente"
              )}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
