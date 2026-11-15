import { useEffect, useState } from "react";
import { fotoDe, PLACEHOLDER_AVE } from "../../data/aves";
import { ESTRELAS_RARIDADE, ROTULO_HABITAT, ROTULO_RARIDADE } from "../../data/rotulos";
import type { Ave } from "../../data/types";
import { pararAudio } from "../../lib/audio";
import { AudioButton } from "../jogo/AudioButton";
import { BirdCard } from "../jogo/BirdCard";
import { Modal } from "../ui/Modal";
import { IconEstrela } from "../ui/icons";

type BirdDetailProps = { ave: Ave; onFechar: () => void };

/** Cartão completo da ave descoberta: foto, nomes, curiosidade, habitat, raridade e canto. */
export function BirdDetail({ ave, onFechar }: BirdDetailProps) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const estrelas = ESTRELAS_RARIDADE[ave.raridade];

  // o canto para quando o cartão fecha
  useEffect(() => () => pararAudio(), []);

  return (
    <Modal rotulo={`Cartão: ${ave.nomePopular}`} onFechar={onFechar}>
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-cartao bg-linear-to-b from-neblina to-creme-100">
        <img
          src={fotoFalhou ? PLACEHOLDER_AVE : fotoDe(ave)}
          alt={`Foto de ${ave.nomePopular}`}
          draggable={false}
          onError={() => setFotoFalhou(true)}
          className="size-full object-contain"
        />
      </div>

      <BirdCard ave={ave} className="mt-3">
        <dl className="flex w-full flex-col gap-3">
          <div>
            <dt className="text-corpo font-semibold text-tinta-suave">Onde vive</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {ave.habitats.map((habitat) => (
                <span
                  key={habitat}
                  className="rounded-full bg-folha-600 px-3 py-1 font-titulo text-corpo font-semibold text-creme-50"
                >
                  {ROTULO_HABITAT[habitat]}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-corpo font-semibold text-tinta-suave">Raridade</dt>
            <dd className="mt-1 inline-flex items-center gap-2 rounded-full bg-creme-200 px-3 py-1">
              <span className="flex text-pasto" aria-hidden>
                {[1, 2, 3].map((n) => (
                  <IconEstrela key={n} cheia={n <= estrelas} className="size-5" />
                ))}
              </span>
              <span className="font-titulo text-corpo font-semibold text-mata-900">
                {ROTULO_RARIDADE[ave.raridade]}
              </span>
            </dd>
          </div>
        </dl>
        <AudioButton src={ave.midia.canto} />
      </BirdCard>
    </Modal>
  );
}
