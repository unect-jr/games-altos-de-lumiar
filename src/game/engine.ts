// Lógica pura do Passeio: movimento por tile, colisão e câmera (sem React).
import { INICIO, MAPA_ALTURA, MAPA_LARGURA, podeAndar } from "./map";

export type Direcao = "cima" | "baixo" | "esquerda" | "direita";

const DELTA: Record<Direcao, { dx: number; dy: number }> = {
  cima: { dx: 0, dy: -1 },
  baixo: { dx: 0, dy: 1 },
  esquerda: { dx: -1, dy: 0 },
  direita: { dx: 1, dy: 0 },
};

/** Duração de um passo (ms). */
export const DURACAO_PASSO = 140;

export type EstadoPasseio = {
  /** Tile atual (é o destino enquanto anda). */
  x: number;
  y: number;
  /** Tile de onde saiu no passo atual. */
  deX: number;
  deY: number;
  /** 0..1 dentro do passo; 1 = parado. */
  progresso: number;
  direcao: Direcao;
  /** Direções seguradas agora; a última pressionada vence. */
  segurando: Direcao[];
  /** Toque rápido (apertou e soltou antes do passo começar) ainda vale um passo. */
  pedido: Direcao | null;
  passos: number;
  /** Durante um encontro o personagem não anda. */
  pausado: boolean;
};

export function criarEstado(): EstadoPasseio {
  return {
    x: INICIO.x,
    y: INICIO.y,
    deX: INICIO.x,
    deY: INICIO.y,
    progresso: 1,
    direcao: "baixo",
    segurando: [],
    pedido: null,
    passos: 0,
    pausado: false,
  };
}

export function segurar(estado: EstadoPasseio, direcao: Direcao) {
  if (!estado.segurando.includes(direcao)) estado.segurando.push(direcao);
  estado.pedido = direcao;
}

export function soltar(estado: EstadoPasseio, direcao: Direcao) {
  const i = estado.segurando.indexOf(direcao);
  if (i >= 0) estado.segurando.splice(i, 1);
}

export function soltarTudo(estado: EstadoPasseio) {
  estado.segurando.length = 0;
  estado.pedido = null;
}

/** Volta a andar depois de um encontro. */
export function retomar(estado: EstadoPasseio) {
  estado.pausado = false;
}

/** Tenta começar um passo; se bloqueado, só vira para a direção. */
function tentarPasso(estado: EstadoPasseio, direcao: Direcao): boolean {
  estado.direcao = direcao;
  const { dx, dy } = DELTA[direcao];
  if (!podeAndar(estado.x + dx, estado.y + dy)) return false;
  estado.deX = estado.x;
  estado.deY = estado.y;
  estado.x += dx;
  estado.y += dy;
  estado.progresso = 0;
  return true;
}

/**
 * Avança a simulação. Retorna true se algo mudou (precisa redesenhar).
 * `aoChegar` roda ao fim de cada passo; se retornar true, o personagem pausa ali.
 */
export function atualizar(
  estado: EstadoPasseio,
  dtMs: number,
  aoChegar?: (x: number, y: number) => boolean,
): boolean {
  if (estado.pausado) return false;
  let mudou = false;
  let sobra = 0;

  if (estado.progresso < 1) {
    estado.progresso += dtMs / DURACAO_PASSO;
    mudou = true;
    if (estado.progresso >= 1) {
      sobra = (estado.progresso - 1) * DURACAO_PASSO;
      estado.progresso = 1;
      estado.passos++;
      if (aoChegar?.(estado.x, estado.y)) {
        estado.pausado = true;
        soltarTudo(estado);
        return true;
      }
    }
  }

  if (estado.progresso >= 1) {
    const direcao = estado.segurando[estado.segurando.length - 1] ?? estado.pedido;
    estado.pedido = null;
    if (direcao) {
      const virou = estado.direcao !== direcao;
      if (tentarPasso(estado, direcao)) {
        // Aproveita o tempo que sobrou para o andar contínuo não "engasgar".
        estado.progresso = Math.min(sobra / DURACAO_PASSO, 0.99);
        mudou = true;
      } else if (virou) {
        mudou = true;
      }
    }
  }

  return mudou;
}

export type Ponto = { x: number; y: number };

/** Posição desenhada do personagem, em tiles (interpolada). Escreve em `saida` para não alocar. */
export function posicaoVisual(estado: EstadoPasseio, saida: Ponto): Ponto {
  const k = estado.progresso;
  saida.x = estado.deX + (estado.x - estado.deX) * k;
  saida.y = estado.deY + (estado.y - estado.deY) * k;
  return saida;
}

/**
 * Canto superior esquerdo da câmera, em px, centrada no personagem e presa às
 * bordas do mapa. Se o mapa for menor que a tela naquele eixo, centraliza o mapa.
 */
export function camera(alvo: Ponto, tilePx: number, larguraTela: number, alturaTela: number, saida: Ponto): Ponto {
  saida.x = eixoCamera(alvo.x, tilePx, larguraTela, MAPA_LARGURA * tilePx);
  saida.y = eixoCamera(alvo.y, tilePx, alturaTela, MAPA_ALTURA * tilePx);
  return saida;
}

function eixoCamera(alvoTiles: number, tilePx: number, tela: number, mapa: number): number {
  if (mapa <= tela) return Math.round((mapa - tela) / 2);
  const centro = alvoTiles * tilePx + tilePx / 2 - tela / 2;
  return Math.round(Math.min(Math.max(centro, 0), mapa - tela));
}
