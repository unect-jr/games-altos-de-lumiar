import type { Habitat, Raridade } from "./types";

// Textos de tela para os valores de domínio.

export const ROTULO_HABITAT: Record<Habitat, string> = {
  jardim: "Jardim",
  mata: "Mata",
  agua: "Água",
  campo: "Campo",
  comedouro: "Comedouro",
};

export const ROTULO_RARIDADE: Record<Raridade, string> = {
  comum: "Comum",
  incomum: "Incomum",
  rara: "Rara",
};

/** Estrelas mostradas junto da raridade (não depende só de cor). */
export const ESTRELAS_RARIDADE: Record<Raridade, 1 | 2 | 3> = {
  comum: 1,
  incomum: 2,
  rara: 3,
};
