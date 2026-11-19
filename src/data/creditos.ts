import type { Credito } from "./types";

// Créditos que não são de uma ave. Preencha `creditos` quando a origem for confirmada.

export type MidiaLodge = {
  arquivo: string;
  creditos: Credito[];
};

/** Fotos do lodge em `public/lodge/` (fornecidas pelo cliente). */
export const fotosLodge: MidiaLodge[] = [
  { arquivo: "/lodge/lodge-1.webp", creditos: [] },
  { arquivo: "/lodge/lodge-2.webp", creditos: [] },
  { arquivo: "/lodge/lodge-3.webp", creditos: [] },
];

export const ROTULO_TIPO_CREDITO: Record<Credito["tipo"], string> = {
  canto: "Canto",
  foto: "Foto",
  silhueta: "Silhueta",
};
