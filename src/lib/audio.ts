// Player de áudio único. Neste marco só existe o desbloqueio;
// o player completo (pré-carga, parar ao trocar, aba oculta) vem no marco 3.

let contexto: AudioContext | null = null;

/** Contexto de áudio compartilhado, criado sob demanda. */
export function getAudioContext(): AudioContext | null {
  if (contexto) return contexto;
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  contexto = new AudioContext();
  return contexto;
}

/**
 * Libera o áudio do navegador. Precisa ser chamada dentro de um gesto
 * do usuário (toque, clique ou tecla), como no "Toque para começar".
 */
export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
  // um buffer silencioso garante o desbloqueio no iOS
  const buffer = ctx.createBuffer(1, 1, 22050);
  const fonte = ctx.createBufferSource();
  fonte.buffer = buffer;
  fonte.connect(ctx.destination);
  fonte.start(0);
}
