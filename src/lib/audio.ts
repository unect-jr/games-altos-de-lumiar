// Player de áudio único (Web Audio API). Módulo sem React.
// - Um canto por vez: tocar outro para o anterior.
// - Pré-carga com cache (decodifica antes da pergunta aparecer).
// - Para ao ocultar a aba. Componentes chamam `pararAudio()` ao desmontar.
// - Falha nunca trava o jogo: o status vira "erro" e a UI oferece tentar de novo.

export type StatusAudio = "parado" | "carregando" | "tocando" | "erro" | "bloqueado";

export type EstadoAudio = {
  status: StatusAudio;
  /** Arquivo atual (ou o último que falhou). */
  src: string | null;
};

let contexto: AudioContext | null = null;
let ganho: GainNode | null = null;
let fonteAtual: AudioBufferSourceNode | null = null;
let mudo = false;
/** Incrementa a cada tocar/parar; descarta carregamentos que ficaram velhos. */
let geracao = 0;
let estado: EstadoAudio = { status: "parado", src: null };

const cache = new Map<string, Promise<AudioBuffer>>();
const ouvintes = new Set<() => void>();

function definirEstado(novo: EstadoAudio): void {
  if (novo.status === estado.status && novo.src === estado.src) return;
  estado = novo;
  ouvintes.forEach((ouvinte) => ouvinte());
}

/** Contexto de áudio compartilhado, criado sob demanda. */
export function getAudioContext(): AudioContext | null {
  if (contexto) return contexto;
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  contexto = new AudioContext();
  ganho = contexto.createGain();
  ganho.connect(contexto.destination);
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

function carregar(ctx: AudioContext, src: string): Promise<AudioBuffer> {
  const existente = cache.get(src);
  if (existente) return existente;
  const promessa = fetch(src)
    .then((resposta) => {
      if (!resposta.ok) throw new Error(`Falha ao carregar ${src} (${resposta.status})`);
      return resposta.arrayBuffer();
    })
    .then((dados) => ctx.decodeAudioData(dados));
  // falhou: tira do cache para o "tentar de novo" buscar outra vez
  promessa.catch(() => cache.delete(src));
  cache.set(src, promessa);
  return promessa;
}

/** Carrega e decodifica o arquivo antes de precisar dele. Nunca rejeita. */
export function precarregarAudio(src: string | null): void {
  const ctx = getAudioContext();
  if (!ctx || !src) return;
  carregar(ctx, src).catch(() => undefined);
}

function pararFonte(): void {
  if (!fonteAtual) return;
  fonteAtual.onended = null;
  try {
    fonteAtual.stop();
  } catch {
    // já tinha parado
  }
  fonteAtual.disconnect();
  fonteAtual = null;
}

/** Para o canto atual (e cancela um carregamento em andamento). */
export function pararAudio(): void {
  geracao++;
  pararFonte();
  definirEstado({ status: "parado", src: null });
}

/**
 * Toca um canto, parando o anterior. Com o som desligado, não toca.
 * Resolve com o status final ("tocando", "parado", "erro" ou "bloqueado").
 */
export async function tocarAudio(src: string | null): Promise<StatusAudio> {
  pararFonte();
  const minhaGeracao = ++geracao;

  if (mudo) {
    definirEstado({ status: "parado", src: null });
    return "parado";
  }
  const ctx = getAudioContext();
  if (!ctx || !ganho || !src) {
    definirEstado({ status: "erro", src });
    return "erro";
  }

  definirEstado({ status: "carregando", src });
  try {
    if (ctx.state === "suspended") await ctx.resume();
    const buffer = await carregar(ctx, src);
    if (minhaGeracao !== geracao) return estado.status; // outro canto pediu a vez
    if (ctx.state !== "running") {
      definirEstado({ status: "bloqueado", src });
      return "bloqueado";
    }
    const fonte = ctx.createBufferSource();
    fonte.buffer = buffer;
    fonte.connect(ganho);
    fonte.onended = () => {
      if (fonteAtual !== fonte) return;
      fonteAtual = null;
      definirEstado({ status: "parado", src: null });
    };
    fonte.start();
    fonteAtual = fonte;
    definirEstado({ status: "tocando", src });
    return "tocando";
  } catch {
    if (minhaGeracao !== geracao) return estado.status;
    definirEstado({ status: "erro", src });
    return "erro";
  }
}

/** Liga/desliga o som. Desligar para o canto atual. */
export function definirMudo(valor: boolean): void {
  mudo = valor;
  if (mudo) pararAudio();
}

/** Para `useSyncExternalStore`: assina mudanças de estado. */
export function assinarAudio(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function getEstadoAudio(): EstadoAudio {
  return estado;
}

// para ao ocultar a aba (troca de app, tela bloqueada)
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") pararAudio();
  });
}
