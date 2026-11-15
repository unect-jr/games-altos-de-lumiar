// Mapa demonstrativo do lodge (docs/frontend.md §5), em dados.
import type { Habitat } from "../data/types";

export type TileTipo =
  | "arvore"
  | "agua"
  | "casa"
  | "pedra"
  | "grama"
  | "trilha"
  | "inicio"
  | "mato"
  | "jardim"
  | "campo"
  | "deck"
  | "comedouro";

type InfoTile = {
  tipo: TileTipo;
  andavel: boolean;
  /** Habitat do tile; só os que têm habitat geram encontros. */
  habitat?: Habitat;
};

const LEGENDA: Record<string, InfoTile> = {
  T: { tipo: "arvore", andavel: false },
  "~": { tipo: "agua", andavel: false },
  H: { tipo: "casa", andavel: false },
  R: { tipo: "pedra", andavel: false },
  ".": { tipo: "grama", andavel: true },
  ",": { tipo: "trilha", andavel: true },
  S: { tipo: "inicio", andavel: true },
  m: { tipo: "mato", andavel: true, habitat: "mata" },
  j: { tipo: "jardim", andavel: true, habitat: "jardim" },
  g: { tipo: "campo", andavel: true, habitat: "campo" },
  d: { tipo: "deck", andavel: true, habitat: "agua" },
  c: { tipo: "comedouro", andavel: true, habitat: "comedouro" },
};

// Matriz da seção 5, usada como está.
const MATRIZ = [
  "TTmmmmmmTTTTTTmmmmmmmmTT",
  "TmmmmmmmmmTTTmmmmmmmmmmT",
  "Tmmm....mm.,,.mm...mmmmT",
  "Tm.....R...,,.........mT",
  "T..~~~~~...,,..HHHHH..jT",
  "T.~~~~~~~..,,..HHHHH.jjT",
  "T.~~~~~dddd,,..,,,,,,.jT",
  "T.~~~~~dddd,,.S,,,,,,.jT",
  "T.~~~~~~~..,,..jjjj..ggT",
  "T..~~~~~...,,..jjjjjjggT",
  "T...~~~....,,..cj.c..ggT",
  "T..........,,.........gT",
  "Tgg.......,,,,,,,,,..ggT",
  "Tggg.....,,.......,,,.gT",
  "TT,,,,,,,,,..gg...,,,,,T",
  "TTTTTTTTTTTTTTTTTTTTTTTT",
];

export const MAPA_LARGURA = MATRIZ[0].length;
export const MAPA_ALTURA = MATRIZ.length;

const tiles: InfoTile[][] = MATRIZ.map((linha) =>
  [...linha].map((simbolo) => {
    const info = LEGENDA[simbolo];
    if (!info) throw new Error(`Símbolo desconhecido no mapa: "${simbolo}"`);
    return info;
  }),
);

/** Info do tile; fora do mapa conta como árvore (bloqueado). */
export function infoEm(x: number, y: number): InfoTile {
  return tiles[y]?.[x] ?? LEGENDA.T;
}

export function tileEm(x: number, y: number): TileTipo {
  return infoEm(x, y).tipo;
}

export function podeAndar(x: number, y: number): boolean {
  return infoEm(x, y).andavel;
}

function acharInicio(): { x: number; y: number } {
  for (let y = 0; y < MAPA_ALTURA; y++) {
    const x = MATRIZ[y].indexOf("S");
    if (x >= 0) return { x, y };
  }
  throw new Error("Mapa sem início (S)");
}

export const INICIO = acharInicio();
