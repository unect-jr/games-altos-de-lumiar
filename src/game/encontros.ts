// Encontros do Passeio: chance por passo, habitat do tile e raridade (sem React).
import { avesDoHabitat } from "../data/aves";
import type { Ave, Habitat, Raridade } from "../data/types";
import type { Rng } from "../quiz/montarRodada";

/** Chance de encontro ao entrar num tile com habitat. */
export const CHANCE_ENCONTRO = 0.13;
/** No comedouro as aves aparecem mais. */
export const CHANCE_COMEDOURO = 0.25;
/** Passos mínimos entre um encontro e outro. */
export const PASSOS_MINIMOS = 3;
/** Passos em tiles com habitat que garantem um encontro. */
export const PASSOS_GARANTIA = 12;

/** Peso no sorteio: comum aparece mais que incomum, que aparece mais que rara. */
export const PESO_RARIDADE: Record<Raridade, number> = {
  comum: 6,
  incomum: 3,
  rara: 1,
};

export type EstadoEncontros = {
  /** Passos desde o último encontro (qualquer tile). */
  passosDesde: number;
  /** Passos em tiles com habitat desde o último encontro. */
  passosNoHabitat: number;
  /** Última ave que apareceu (evita repetir logo em seguida). */
  ultimaAveId: string | null;
};

export function criarEncontros(): EstadoEncontros {
  return { passosDesde: 0, passosNoHabitat: 0, ultimaAveId: null };
}

/** Sorteia uma ave do habitat, ponderada pela raridade. */
export function sortearAve(habitat: Habitat, evitarId: string | null, rng: Rng = Math.random): Ave | null {
  const todas = avesDoHabitat(habitat);
  const candidatas = todas.length > 1 ? todas.filter((ave) => ave.id !== evitarId) : todas;
  const total = candidatas.reduce((soma, ave) => soma + PESO_RARIDADE[ave.raridade], 0);
  let sorteio = rng() * total;
  for (const ave of candidatas) {
    sorteio -= PESO_RARIDADE[ave.raridade];
    if (sorteio < 0) return ave;
  }
  return candidatas[candidatas.length - 1] ?? null;
}

/**
 * Chamado a cada passo concluído. Retorna a ave encontrada (e zera os contadores)
 * ou `null` se nada apareceu.
 */
export function verificarEncontro(
  estado: EstadoEncontros,
  habitat: Habitat | undefined,
  rng: Rng = Math.random,
): Ave | null {
  estado.passosDesde++;
  if (!habitat) return null;
  estado.passosNoHabitat++;
  if (estado.passosDesde < PASSOS_MINIMOS) return null;

  const garantido = estado.passosNoHabitat >= PASSOS_GARANTIA;
  const chance = habitat === "comedouro" ? CHANCE_COMEDOURO : CHANCE_ENCONTRO;
  if (!garantido && rng() >= chance) return null;

  const ave = sortearAve(habitat, estado.ultimaAveId, rng);
  if (!ave) return null;
  estado.passosDesde = 0;
  estado.passosNoHabitat = 0;
  estado.ultimaAveId = ave.id;
  return ave;
}
