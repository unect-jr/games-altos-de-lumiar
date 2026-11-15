import { createContext, useContext } from "react";

// Estado da sessão (em memória). No marco 2 vira parte do store com useReducer.
export type Sessao = {
  /** O usuário já tocou em "Toque para começar" nesta sessão. */
  iniciado: boolean;
  somLigado: boolean;
  iniciar: () => void;
  alternarSom: () => void;
};

export const SessaoContext = createContext<Sessao | null>(null);

export function useSessao(): Sessao {
  const sessao = useContext(SessaoContext);
  if (!sessao) throw new Error("useSessao precisa estar dentro de <SessaoProvider>");
  return sessao;
}
