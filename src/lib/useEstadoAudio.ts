import { useSyncExternalStore } from "react";
import { assinarAudio, getEstadoAudio, type EstadoAudio } from "./audio";

/** Estado atual do player único (tocando, carregando, erro...). */
export function useEstadoAudio(): EstadoAudio {
  return useSyncExternalStore(assinarAudio, getEstadoAudio, getEstadoAudio);
}
