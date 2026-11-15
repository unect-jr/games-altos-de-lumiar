// Tiles do mapa desenhados por código (formas vetoriais simples).
// O mapa inteiro é pré-renderizado uma vez num canvas fora da tela;
// o loop só copia o recorte da câmera.
import { MAPA_ALTURA, MAPA_LARGURA, tileEm, type TileTipo } from "./map";
import type { Paleta } from "./paleta";

type Ctx = CanvasRenderingContext2D;

/** Ruído determinístico 0..1 por tile (variações sem sortear a cada desenho). */
function ruido(x: number, y: number, semente: number): number {
  let h = (x * 374761393 + y * 668265263 + semente * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function circulo(ctx: Ctx, cx: number, cy: number, r: number, cor: string) {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function elipse(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, cor: string) {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Preenche o tile arredondando só os cantos "de fora" (onde os dois vizinhos
 * do canto são diferentes), para trilhas e lago parecerem contínuos.
 */
function formaConectada(
  ctx: Ctx,
  x: number,
  y: number,
  t: number,
  mesmo: (tipo: TileTipo) => boolean,
  cor: string,
) {
  const cima = mesmo(tileEm(x, y - 1));
  const baixo = mesmo(tileEm(x, y + 1));
  const esq = mesmo(tileEm(x - 1, y));
  const dir = mesmo(tileEm(x + 1, y));
  const r = t * 0.4;
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.roundRect(x * t, y * t, t, t, [
    !cima && !esq ? r : 0,
    !cima && !dir ? r : 0,
    !baixo && !dir ? r : 0,
    !baixo && !esq ? r : 0,
  ]);
  ctx.fill();
}

const ehAgua = (tipo: TileTipo) => tipo === "agua" || tipo === "deck";
const ehTrilha = (tipo: TileTipo) => tipo === "trilha" || tipo === "inicio";

// ---------- Camada 1: chão ----------

function tufos(ctx: Ctx, p: Paleta, x: number, y: number, t: number) {
  ctx.strokeStyle = p.gramaEscura;
  ctx.lineWidth = Math.max(1, t * 0.035);
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    if (ruido(x, y, i) < 0.45) continue;
    const bx = x * t + t * (0.15 + ruido(x, y, i + 10) * 0.7);
    const by = y * t + t * (0.2 + ruido(x, y, i + 20) * 0.65);
    ctx.beginPath();
    ctx.moveTo(bx - t * 0.06, by - t * 0.08);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + t * 0.06, by - t * 0.08);
    ctx.stroke();
  }
}

function desenharChao(ctx: Ctx, p: Paleta, tipo: TileTipo, x: number, y: number, t: number) {
  const px = x * t;
  const py = y * t;

  if (tipo === "arvore") {
    ctx.fillStyle = p.gramaEscura;
    ctx.fillRect(px, py, t, t);
    return;
  }

  if (tipo === "campo") {
    ctx.fillStyle = p.campo;
    ctx.fillRect(px, py, t, t);
    ctx.strokeStyle = p.pasto;
    ctx.lineWidth = Math.max(1, t * 0.04);
    ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      const bx = px + t * (0.1 + ruido(x, y, i) * 0.8);
      const by = py + t * (0.25 + ruido(x, y, i + 5) * 0.7);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + t * 0.04, by - t * 0.16);
      ctx.stroke();
    }
    return;
  }

  // Grama de base para todos os demais (inclusive sob lago e trilha).
  ctx.fillStyle = p.grama;
  ctx.fillRect(px, py, t, t);

  if (ehAgua(tipo)) {
    formaConectada(ctx, x, y, t, ehAgua, p.agua);
    if (tipo === "agua") {
      // Reflexos simples: tracinhos claros.
      ctx.strokeStyle = p.aguaReflexo;
      ctx.lineWidth = Math.max(1, t * 0.045);
      ctx.lineCap = "round";
      if (ruido(x, y, 7) > 0.4) {
        const rx = px + t * (0.2 + ruido(x, y, 8) * 0.4);
        const ry = py + t * (0.3 + ruido(x, y, 9) * 0.4);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + t * 0.28, ry);
        ctx.stroke();
      }
      // Margem mais funda junto à terra (lado de baixo), dá volume.
      if (!ehAgua(tileEm(x, y + 1))) {
        ctx.fillStyle = p.aguaFunda;
        ctx.fillRect(px, py + t * 0.82, t, t * 0.18);
      }
    }
    return;
  }

  if (ehTrilha(tipo)) {
    formaConectada(ctx, x, y, t, ehTrilha, p.trilha);
    for (let i = 0; i < 2; i++) {
      if (ruido(x, y, i + 30) < 0.5) continue;
      circulo(
        ctx,
        px + t * (0.2 + ruido(x, y, i + 31) * 0.6),
        py + t * (0.2 + ruido(x, y, i + 32) * 0.6),
        t * 0.04,
        p.trilhaEscura,
      );
    }
    if (tipo === "inicio") {
      // Marquinha do ponto de partida.
      ctx.strokeStyle = p.creme50;
      ctx.lineWidth = Math.max(1, t * 0.05);
      ctx.setLineDash([t * 0.08, t * 0.08]);
      ctx.beginPath();
      ctx.arc(px + t / 2, py + t / 2, t * 0.32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    return;
  }

  tufos(ctx, p, x, y, t);
}

// ---------- Camada 2: objetos (de cima para baixo, para sobrepor certo) ----------

function araucaria(ctx: Ctx, p: Paleta, px: number, py: number, t: number) {
  const cx = px + t / 2;
  elipse(ctx, cx, py + t * 0.9, t * 0.3, t * 0.08, p.sombra);
  ctx.fillStyle = p.madeira;
  ctx.fillRect(cx - t * 0.05, py + t * 0.15, t * 0.1, t * 0.78);
  // Copa em guarda-chuva, em camadas (pode passar um pouco para o tile de cima).
  elipse(ctx, cx, py + t * 0.42, t * 0.32, t * 0.1, p.mata900);
  elipse(ctx, cx, py + t * 0.16, t * 0.5, t * 0.17, p.mata700);
  elipse(ctx, cx, py + t * 0.08, t * 0.36, t * 0.1, p.mata500);
}

function folhosa(ctx: Ctx, p: Paleta, px: number, py: number, t: number) {
  const cx = px + t / 2;
  elipse(ctx, cx, py + t * 0.9, t * 0.36, t * 0.09, p.sombra);
  ctx.fillStyle = p.madeira;
  ctx.fillRect(cx - t * 0.06, py + t * 0.5, t * 0.12, t * 0.42);
  circulo(ctx, cx - t * 0.2, py + t * 0.42, t * 0.26, p.mata700);
  circulo(ctx, cx + t * 0.2, py + t * 0.42, t * 0.26, p.mata700);
  circulo(ctx, cx, py + t * 0.28, t * 0.34, p.mata500);
  circulo(ctx, cx - t * 0.1, py + t * 0.18, t * 0.12, p.folha600);
}

function moita(ctx: Ctx, p: Paleta, cx: number, cy: number, r: number, cor: string) {
  elipse(ctx, cx, cy + r * 0.7, r * 1.1, r * 0.35, p.sombra);
  circulo(ctx, cx - r * 0.55, cy + r * 0.1, r * 0.7, cor);
  circulo(ctx, cx + r * 0.55, cy + r * 0.1, r * 0.7, cor);
  circulo(ctx, cx, cy - r * 0.25, r * 0.8, cor);
  circulo(ctx, cx - r * 0.25, cy - r * 0.45, r * 0.25, p.folha400);
}

function mato(ctx: Ctx, p: Paleta, x: number, y: number, t: number) {
  const px = x * t;
  const py = y * t;
  moita(ctx, p, px + t * 0.3, py + t * 0.35, t * 0.18, p.mata500);
  moita(ctx, p, px + t * 0.68, py + t * 0.62, t * 0.2, p.folha600);
  if (ruido(x, y, 40) > 0.5) moita(ctx, p, px + t * 0.28, py + t * 0.78, t * 0.13, p.mata700);
}

function jardim(ctx: Ctx, p: Paleta, x: number, y: number, t: number) {
  const px = x * t;
  const py = y * t;
  moita(ctx, p, px + t * 0.5, py + t * 0.52, t * 0.26, p.folha600);
  // Bolinhas de hortênsia em cachos azuis e lilás.
  const cachos = [
    [0.32, 0.42],
    [0.66, 0.4],
    [0.5, 0.64],
  ] as const;
  cachos.forEach(([fx, fy], i) => {
    const cor = ruido(x, y, 50 + i) > 0.5 ? p.hortensia : p.hortensiaLilas;
    const cx = px + t * fx;
    const cy = py + t * fy;
    const r = t * 0.05;
    circulo(ctx, cx - r, cy, r, cor);
    circulo(ctx, cx + r, cy, r, cor);
    circulo(ctx, cx, cy - r, r, cor);
    circulo(ctx, cx, cy + r * 0.6, r, cor);
  });
}

function pedra(ctx: Ctx, p: Paleta, px: number, py: number, t: number) {
  elipse(ctx, px + t * 0.52, py + t * 0.8, t * 0.42, t * 0.12, p.sombra);
  elipse(ctx, px + t * 0.5, py + t * 0.58, t * 0.42, t * 0.3, p.pedraEscura);
  elipse(ctx, px + t * 0.46, py + t * 0.5, t * 0.36, t * 0.24, p.pedra);
  elipse(ctx, px + t * 0.36, py + t * 0.42, t * 0.12, t * 0.06, p.creme100);
}

function comedouro(ctx: Ctx, p: Paleta, px: number, py: number, t: number) {
  const cx = px + t / 2;
  elipse(ctx, cx, py + t * 0.88, t * 0.22, t * 0.06, p.sombra);
  ctx.fillStyle = p.madeiraEscura;
  ctx.fillRect(cx - t * 0.035, py + t * 0.4, t * 0.07, t * 0.5);
  // Bandeja com sementes.
  ctx.fillStyle = p.madeira;
  ctx.beginPath();
  ctx.roundRect(cx - t * 0.26, py + t * 0.36, t * 0.52, t * 0.12, t * 0.03);
  ctx.fill();
  for (let i = 0; i < 4; i++) circulo(ctx, cx - t * 0.15 + i * t * 0.1, py + t * 0.37, t * 0.03, p.pasto);
  // Telhadinho.
  ctx.fillStyle = p.terracota;
  ctx.beginPath();
  ctx.moveTo(cx - t * 0.32, py + t * 0.24);
  ctx.lineTo(cx, py + t * 0.06);
  ctx.lineTo(cx + t * 0.32, py + t * 0.24);
  ctx.closePath();
  ctx.fill();
}

function deck(ctx: Ctx, p: Paleta, x: number, y: number, t: number) {
  const px = x * t;
  const py = y * t;
  ctx.fillStyle = p.madeira;
  ctx.fillRect(px, py, t, t);
  ctx.strokeStyle = p.madeiraEscura;
  ctx.lineWidth = Math.max(1, t * 0.03);
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(px, py + (t * i) / 4);
    ctx.lineTo(px + t, py + (t * i) / 4);
    ctx.stroke();
  }
  // Estacas nas bordas que dão para a água.
  const estaca = t * 0.12;
  if (tileEm(x, y - 1) === "agua") {
    ctx.fillStyle = p.madeiraEscura;
    ctx.fillRect(px + t * 0.1, py - estaca * 0.3, estaca, estaca);
    ctx.fillRect(px + t * 0.78, py - estaca * 0.3, estaca, estaca);
  }
  if (tileEm(x, y + 1) === "agua") {
    ctx.fillStyle = p.madeiraEscura;
    ctx.fillRect(px + t * 0.1, py + t - estaca * 0.7, estaca, estaca);
    ctx.fillRect(px + t * 0.78, py + t - estaca * 0.7, estaca, estaca);
  }
}

function guardaSol(ctx: Ctx, p: Paleta, cx: number, cy: number, t: number) {
  const r = t * 0.42;
  elipse(ctx, cx + t * 0.12, cy + t * 0.14, r, r * 0.8, p.sombra);
  circulo(ctx, cx, cy, r, p.canario);
  ctx.strokeStyle = p.creme50;
  ctx.lineWidth = Math.max(1, t * 0.04);
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.stroke();
  }
  circulo(ctx, cx, cy, t * 0.06, p.madeiraEscura);
}

/** Casa inteira desenhada a partir do canto superior esquerdo do bloco de H. */
function casa(ctx: Ctx, p: Paleta, x: number, y: number, t: number) {
  let largura = 0;
  while (tileEm(x + largura, y) === "casa") largura++;
  let altura = 0;
  while (tileEm(x, y + altura) === "casa") altura++;

  const px = x * t;
  const py = y * t;
  const w = largura * t;
  const h = altura * t;
  const topoParede = py + h * 0.55;
  const topoVaranda = py + h * 0.8;

  // Sombra.
  ctx.fillStyle = p.sombra;
  ctx.fillRect(px + t * 0.15, py + h - t * 0.05, w, t * 0.15);

  // Parede da frente com janelas e porta.
  ctx.fillStyle = p.creme100;
  ctx.fillRect(px + t * 0.08, topoParede, w - t * 0.16, topoVaranda - topoParede);
  const alturaJanela = (topoVaranda - topoParede) * 0.5;
  const yJanela = topoParede + (topoVaranda - topoParede) * 0.22;
  for (let i = 0; i < largura; i++) {
    const jx = px + i * t + t * 0.3;
    if (i === Math.floor(largura / 2)) {
      ctx.fillStyle = p.madeiraEscura;
      ctx.fillRect(jx, topoParede + (topoVaranda - topoParede) * 0.15, t * 0.4, (topoVaranda - topoParede) * 0.85);
    } else {
      ctx.fillStyle = p.madeira;
      ctx.fillRect(jx - t * 0.04, yJanela - t * 0.04, t * 0.48, alturaJanela + t * 0.08);
      ctx.fillStyle = p.neblina;
      ctx.fillRect(jx, yJanela, t * 0.4, alturaJanela);
    }
  }

  // Varanda de madeira com pilares.
  ctx.fillStyle = p.madeira;
  ctx.fillRect(px, topoVaranda, w, py + h - topoVaranda);
  ctx.fillStyle = p.madeiraEscura;
  ctx.fillRect(px, py + h - t * 0.06, w, t * 0.06);
  for (let i = 0; i <= largura; i++) {
    const colX = Math.min(px + i * t, px + w - t * 0.08);
    ctx.fillRect(colX, topoParede, t * 0.08, py + h - topoParede);
  }

  // Telhado de telha (passa um pouco para cima, como visto de cima/frente).
  const topoTelhado = py - t * 0.25;
  const baseTelhado = topoParede + t * 0.08;
  ctx.fillStyle = p.terracota;
  ctx.beginPath();
  ctx.roundRect(px - t * 0.12, topoTelhado, w + t * 0.24, baseTelhado - topoTelhado, t * 0.12);
  ctx.fill();
  // Fileiras de telhas, desencontradas.
  ctx.strokeStyle = p.terracotaEscura;
  ctx.lineWidth = Math.max(1, t * 0.035);
  const passo = t * 0.22;
  let fileira = 0;
  for (let ly = topoTelhado + passo; ly < baseTelhado - passo * 0.3; ly += passo, fileira++) {
    ctx.beginPath();
    ctx.moveTo(px - t * 0.05, ly);
    ctx.lineTo(px + w + t * 0.05, ly);
    ctx.stroke();
    const desloca = fileira % 2 === 0 ? 0 : passo * 0.75;
    for (let lx = px + desloca; lx < px + w; lx += passo * 1.5) {
      ctx.beginPath();
      ctx.moveTo(lx, ly - passo);
      ctx.lineTo(lx, ly);
      ctx.stroke();
    }
  }
  // Cumeeira.
  ctx.fillStyle = p.terracotaEscura;
  ctx.fillRect(px + t * 0.2, topoTelhado + t * 0.02, w - t * 0.4, t * 0.09);
}

function desenharObjeto(ctx: Ctx, p: Paleta, tipo: TileTipo, x: number, y: number, t: number) {
  const px = x * t;
  const py = y * t;
  switch (tipo) {
    case "arvore":
      if (ruido(x, y, 60) < 0.55) araucaria(ctx, p, px, py, t);
      else folhosa(ctx, p, px, py, t);
      break;
    case "mato":
      mato(ctx, p, x, y, t);
      break;
    case "jardim":
      jardim(ctx, p, x, y, t);
      break;
    case "pedra":
      pedra(ctx, p, px, py, t);
      break;
    case "comedouro":
      comedouro(ctx, p, px, py, t);
      break;
    case "deck":
      deck(ctx, p, x, y, t);
      break;
    case "casa":
      if (tileEm(x - 1, y) !== "casa" && tileEm(x, y - 1) !== "casa") casa(ctx, p, x, y, t);
      break;
    default:
      break;
  }
}

/** Guarda-sol amarelo no segundo tile do deck (lido em ordem de leitura). */
function desenharGuardaSol(ctx: Ctx, p: Paleta, t: number) {
  let encontrados = 0;
  for (let y = 0; y < MAPA_ALTURA; y++) {
    for (let x = 0; x < MAPA_LARGURA; x++) {
      if (tileEm(x, y) !== "deck") continue;
      encontrados++;
      if (encontrados === 2) {
        guardaSol(ctx, p, x * t + t, y * t + t * 0.5, t);
        return;
      }
    }
  }
}

/** Renderiza o mapa inteiro num canvas fora da tela, com `t` px por tile. */
export function renderizarMapa(p: Paleta, t: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = MAPA_LARGURA * t;
  canvas.height = MAPA_ALTURA * t;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  for (let y = 0; y < MAPA_ALTURA; y++) {
    for (let x = 0; x < MAPA_LARGURA; x++) desenharChao(ctx, p, tileEm(x, y), x, y, t);
  }
  for (let y = 0; y < MAPA_ALTURA; y++) {
    for (let x = 0; x < MAPA_LARGURA; x++) desenharObjeto(ctx, p, tileEm(x, y), x, y, t);
  }
  desenharGuardaSol(ctx, p, t);
  return canvas;
}

/**
 * Redesenha um tile por cima do mapa já renderizado, deslocado em `dx` px
 * e recortado no próprio tile (o balanço do arbusto no encontro).
 * `ctx` deve estar no sistema de coordenadas do mapa.
 */
export function desenharTileBalancando(ctx: Ctx, p: Paleta, x: number, y: number, t: number, dx: number) {
  const tipo = tileEm(x, y);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x * t, y * t, t, t);
  ctx.clip();
  ctx.translate(dx, 0);
  desenharChao(ctx, p, tipo, x, y, t);
  desenharObjeto(ctx, p, tipo, x, y, t);
  ctx.restore();
}
