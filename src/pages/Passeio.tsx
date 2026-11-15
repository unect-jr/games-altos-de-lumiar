import { useEffect, useRef, useState } from "react";
import { DPad } from "../components/jogo/DPad";
import { EncounterSheet, type ResultadoEncontro } from "../components/jogo/EncounterSheet";
import { LevelIntro } from "../components/jogo/LevelIntro";
import { IconAlbum, IconPasseio } from "../components/ui/icons";
import { aves } from "../data/aves";
import type { Ave, Dificuldade } from "../data/types";
import { criarEncontros, verificarEncontro, type EstadoEncontros } from "../game/encontros";
import {
  atualizar,
  camera,
  criarEstado,
  posicaoVisual,
  retomar,
  segurar,
  soltar,
  soltarTudo,
  type Direcao,
  type EstadoPasseio,
  type Ponto,
} from "../game/engine";
import { infoEm } from "../game/map";
import { lerPaleta, type Paleta } from "../game/paleta";
import { criarSprites, spritesProntos, SPRITE_ALTURA } from "../game/sprites";
import { desenharTileBalancando, renderizarMapa } from "../game/tiles";
import { GameShell } from "../layouts/GameShell";
import { CONFIG_DIFICULDADE } from "../quiz/montarRodada";
import { useSessao } from "../store/sessao";

/** Tile base (px CSS) e quantos tiles cabem, no mínimo, no lado menor da tela. */
const TILE_BASE = 32;
const TILES_VISIVEIS = 10;
/** Duração do "arbusto balançando + !" antes de abrir o encontro. */
const ANIM_ENCONTRO_MS = 700;
const ANIM_ENCONTRO_REDUZIDA_MS = 350;

const TECLAS: Record<string, Direcao> = {
  ArrowUp: "cima",
  ArrowDown: "baixo",
  ArrowLeft: "esquerda",
  ArrowRight: "direita",
  w: "cima",
  s: "baixo",
  a: "esquerda",
  d: "direita",
};

function direcaoDaTecla(e: KeyboardEvent): Direcao | undefined {
  return TECLAS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
}

/** Balão de "!" sobre o personagem; `escala` 0..1 para o "pop". */
function desenharBalao(ctx: CanvasRenderingContext2D, p: Paleta, cx: number, base: number, t: number, escala: number) {
  const w = t * 0.46;
  const h = t * 0.56;
  ctx.save();
  ctx.translate(cx, base);
  ctx.scale(escala, escala);
  ctx.fillStyle = p.creme50;
  ctx.strokeStyle = p.mata900;
  ctx.lineWidth = Math.max(2, t * 0.04);
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h - t * 0.1, w, h, t * 0.1);
  ctx.moveTo(-t * 0.07, -t * 0.1);
  ctx.lineTo(0, 0);
  ctx.lineTo(t * 0.07, -t * 0.1);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = p.tinta;
  ctx.beginPath();
  ctx.roundRect(-t * 0.045, -h - t * 0.02, t * 0.09, h * 0.52, t * 0.04);
  ctx.arc(0, -t * 0.23, t * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

type MapaPasseioProps = {
  estado: EstadoPasseio;
  encontros: EstadoEncontros;
  dificuldade: Dificuldade;
  sequencia: number;
  onResultado: (resultado: ResultadoEncontro) => void;
  onTrocarNivel: () => void;
};

function MapaPasseio({ estado, encontros, dificuldade, sequencia, onResultado, onTrocarNivel }: MapaPasseioProps) {
  const { progresso } = useSessao();
  const areaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [encontro, setEncontro] = useState<{ ave: Ave; chave: number } | null>(null);
  const descobertas = Object.keys(progresso.descobertas).length;

  useEffect(() => {
    const area = areaRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!area || !canvas || !ctx) return;

    const paleta = lerPaleta();
    const sprites = criarSprites(paleta);
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duracaoAnim = reduzir ? ANIM_ENCONTRO_REDUZIDA_MS : ANIM_ENCONTRO_MS;

    // Tudo em pixels do aparelho (já escalado pelo devicePixelRatio).
    let t = TILE_BASE;
    let mapa: HTMLCanvasElement | null = null;
    let precisaDesenhar = true;
    let raf = 0;
    let ultimo = 0;
    let ativo = true;
    /** Encontro sorteado, mostrando a animação antes de abrir a tela. */
    let surgindo: { ave: Ave; x: number; y: number; inicio: number } | null = null;
    const pos: Ponto = { x: 0, y: 0 };
    const cam: Ponto = { x: 0, y: 0 };

    function aoChegar(x: number, y: number): boolean {
      const ave = verificarEncontro(encontros, infoEm(x, y).habitat);
      if (!ave) return false;
      surgindo = { ave, x, y, inicio: performance.now() };
      return true;
    }

    function redimensionar() {
      if (!area || !canvas) return;
      const { width, height } = area.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const tileCss = Math.max(TILE_BASE, Math.floor(Math.min(width, height) / TILES_VISIVEIS));
      const novoT = Math.round(tileCss * dpr);
      if (novoT !== t || !mapa) {
        t = novoT;
        mapa = renderizarMapa(paleta, t);
      }
      precisaDesenhar = true;
    }

    function desenhar(agora: number) {
      if (!ctx || !canvas || !mapa) return;
      posicaoVisual(estado, pos);
      camera(pos, t, canvas.width, canvas.height, cam);

      ctx.fillStyle = paleta.mata950;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(mapa, -cam.x, -cam.y);

      // Encontro: o arbusto do tile balança (amortecido).
      const k = surgindo ? Math.min((agora - surgindo.inicio) / duracaoAnim, 1) : 0;
      if (surgindo && !reduzir) {
        const dx = Math.sin(k * Math.PI * 6) * t * 0.08 * (1 - k);
        ctx.save();
        ctx.translate(-cam.x, -cam.y);
        desenharTileBalancando(ctx, paleta, surgindo.x, surgindo.y, t, dx);
        ctx.restore();
      }

      // Personagem: base no pé do tile, com balanço leve enquanto anda.
      const andando = estado.progresso < 1;
      const fase = Math.sin(estado.progresso * Math.PI);
      const pulo = andando ? fase * t * 0.07 : 0;
      const giro = andando ? fase * 0.07 * (estado.passos % 2 === 0 ? 1 : -1) : 0;
      const larguraSprite = t;
      const alturaSprite = t * SPRITE_ALTURA;
      const baseX = Math.round(pos.x * t - cam.x + t / 2);
      const baseY = Math.round(pos.y * t - cam.y + t - pulo);
      const img =
        estado.direcao === "cima" ? sprites.cima : estado.direcao === "baixo" ? sprites.baixo : sprites.lado;

      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.rotate(giro);
      if (estado.direcao === "direita") ctx.scale(-1, 1);
      ctx.drawImage(img, -larguraSprite / 2, -alturaSprite, larguraSprite, alturaSprite);
      ctx.restore();

      if (surgindo) {
        const pop = reduzir ? 1 : Math.min(k / 0.25, 1);
        desenharBalao(ctx, paleta, baseX, baseY - alturaSprite - t * 0.05, t, pop);
      }
    }

    function quadro(agora: number) {
      const dt = Math.min(agora - ultimo, 50);
      ultimo = agora;
      if (atualizar(estado, dt, aoChegar)) precisaDesenhar = true;
      if (surgindo) {
        precisaDesenhar = true;
        if (agora - surgindo.inicio >= duracaoAnim) {
          const { ave } = surgindo;
          surgindo = null;
          if (ativo) setEncontro({ ave, chave: agora });
        }
      }
      if (precisaDesenhar) {
        desenhar(agora);
        precisaDesenhar = false;
      }
      raf = requestAnimationFrame(quadro);
    }

    function iniciarLoop() {
      cancelAnimationFrame(raf);
      ultimo = performance.now();
      raf = requestAnimationFrame(quadro);
    }

    function aoMudarVisibilidade() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        soltarTudo(estado);
      } else {
        precisaDesenhar = true;
        iniciarLoop();
      }
    }

    function aoApertar(e: KeyboardEvent) {
      if (estado.pausado) return;
      const direcao = direcaoDaTecla(e);
      if (!direcao) return;
      e.preventDefault();
      if (!e.repeat) segurar(estado, direcao);
    }

    function aoSoltar(e: KeyboardEvent) {
      const direcao = direcaoDaTecla(e);
      if (direcao) soltar(estado, direcao);
    }

    function aoPerderFoco() {
      soltarTudo(estado);
    }

    const observador = new ResizeObserver(redimensionar);
    observador.observe(area);
    redimensionar();
    spritesProntos(sprites)
      .catch(() => undefined)
      .then(() => {
        if (ativo) precisaDesenhar = true;
      });

    window.addEventListener("keydown", aoApertar);
    window.addEventListener("keyup", aoSoltar);
    window.addEventListener("blur", aoPerderFoco);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    if (!document.hidden) iniciarLoop();

    return () => {
      ativo = false;
      cancelAnimationFrame(raf);
      observador.disconnect();
      window.removeEventListener("keydown", aoApertar);
      window.removeEventListener("keyup", aoSoltar);
      window.removeEventListener("blur", aoPerderFoco);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
      soltarTudo(estado);
      // saiu no meio da animação: o encontro some e o personagem volta a andar
      retomar(estado);
    };
  }, [estado, encontros]);

  function fecharEncontro(resultado: ResultadoEncontro) {
    setEncontro(null);
    retomar(estado);
    onResultado(resultado);
  }

  return (
    <div ref={areaRef} className="relative mb-2 flex-1 overflow-hidden rounded-cartao bg-mata-950 shadow-cartao">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Mapa do lodge visto de cima. Use as setas para andar. Aves aparecem no mato, no jardim, no campo e no deck do lago."
        className="absolute inset-0 size-full"
      />

      {encontro ? (
        <EncounterSheet
          key={encontro.chave}
          ave={encontro.ave}
          dificuldade={dificuldade}
          sequencia={sequencia}
          onFim={fecharEncontro}
        />
      ) : (
        <>
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onTrocarNivel}
              aria-label={`Nível ${CONFIG_DIFICULDADE[dificuldade].rotulo}. Trocar nível`}
              className="inline-flex min-h-toque items-center rounded-full bg-creme-50 px-4 font-titulo text-botao font-semibold text-mata-900 shadow-botao active:shadow-botao-pressionado"
            >
              {CONFIG_DIFICULDADE[dificuldade].rotulo}
            </button>
            <span
              aria-label={`Álbum: ${descobertas} de ${aves.length} aves`}
              className="inline-flex min-h-toque items-center gap-2 rounded-full bg-mata-900/85 px-4 font-titulo text-botao font-semibold text-creme-50"
            >
              <IconAlbum className="size-6" /> {descobertas}/{aves.length}
            </span>
          </div>
          <DPad
            className="absolute right-3 bottom-3"
            onSegurar={(direcao) => segurar(estado, direcao)}
            onSoltar={(direcao) => soltar(estado, direcao)}
          />
        </>
      )}
    </div>
  );
}

export function Passeio() {
  const { progresso, definirDificuldade, somarRodada } = useSessao();
  const [etapa, setEtapa] = useState<"nivel" | "mapa">("nivel");
  // posição e contadores sobrevivem à troca de nível
  const [estado] = useState(criarEstado);
  const [encontros] = useState(criarEncontros);
  const [pontos, setPontos] = useState(0);
  const [sequencia, setSequencia] = useState(0);

  function aoResultado(resultado: ResultadoEncontro) {
    if (resultado.tipo === "registrou") {
      const novaSequencia = resultado.dePrimeira ? sequencia + 1 : 0;
      setPontos((atual) => atual + resultado.pontos);
      setSequencia(novaSequencia);
      somarRodada(resultado.pontos, novaSequencia);
    } else if (resultado.tipo === "voou") {
      setSequencia(0);
    }
  }

  return (
    <GameShell titulo="Passeio" pontos={etapa === "mapa" ? pontos : undefined}>
      {etapa === "nivel" ? (
        <LevelIntro
          icone={<IconPasseio className="size-20" />}
          pergunta="Vamos passear!"
          texto="Ande pelo lodge e procure aves no mato, no jardim, no campo e no lago."
          dificuldade={progresso.dificuldade}
          onMudarDificuldade={definirDificuldade}
          onComecar={() => setEtapa("mapa")}
          rotuloComecar={pontos > 0 ? "Continuar" : "Começar"}
        />
      ) : (
        <MapaPasseio
          estado={estado}
          encontros={encontros}
          dificuldade={progresso.dificuldade}
          sequencia={sequencia}
          onResultado={aoResultado}
          onTrocarNivel={() => setEtapa("nivel")}
        />
      )}
    </GameShell>
  );
}
