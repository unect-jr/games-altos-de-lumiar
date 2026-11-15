// Explorador (chapéu e binóculos) em SVG, com as cores dos tokens.
// "lado" olha para a esquerda; a direita é o mesmo desenho espelhado.
import type { Paleta } from "./paleta";

export type PoseSprite = "baixo" | "cima" | "lado";
export type Sprites = Record<PoseSprite, HTMLImageElement>;

/** Proporção do sprite: 1 tile de largura por 1,25 de altura (a cabeça passa do tile). */
export const SPRITE_ALTURA = 1.25;

function svg(conteudo: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="128" height="160">${conteudo}</svg>`;
}

function frente(p: Paleta): string {
  return svg(`
    <ellipse cx="16" cy="37" rx="9" ry="2.6" fill="${p.sombra}"/>
    <rect x="11" y="28" width="4" height="8" rx="2" fill="${p.madeiraEscura}"/>
    <rect x="17" y="28" width="4" height="8" rx="2" fill="${p.madeiraEscura}"/>
    <rect x="5.5" y="18.5" width="4" height="9" rx="2" fill="${p.folha700}"/>
    <rect x="22.5" y="18.5" width="4" height="9" rx="2" fill="${p.folha700}"/>
    <rect x="8" y="17" width="16" height="13" rx="5" fill="${p.folha600}"/>
    <path d="M10 18 L16 23.5 L22 18" fill="none" stroke="${p.tinta}" stroke-width="1"/>
    <rect x="12.6" y="23" width="6.8" height="3" rx="1.2" fill="${p.tinta}"/>
    <circle cx="13.8" cy="25.6" r="2.1" fill="${p.tinta}"/>
    <circle cx="18.2" cy="25.6" r="2.1" fill="${p.tinta}"/>
    <circle cx="13.8" cy="25.6" r="0.9" fill="${p.neblina}"/>
    <circle cx="18.2" cy="25.6" r="0.9" fill="${p.neblina}"/>
    <circle cx="16" cy="12.5" r="6.5" fill="${p.pele}"/>
    <circle cx="13.6" cy="13" r="1" fill="${p.tinta}"/>
    <circle cx="18.4" cy="13" r="1" fill="${p.tinta}"/>
    <path d="M14.2 15.8 Q16 17 17.8 15.8" fill="none" stroke="${p.tinta}" stroke-width="0.8" stroke-linecap="round"/>
    <circle cx="11.8" cy="15" r="1.1" fill="${p.sabia}" opacity="0.45"/>
    <circle cx="20.2" cy="15" r="1.1" fill="${p.sabia}" opacity="0.45"/>
    <ellipse cx="16" cy="8.6" rx="11" ry="3" fill="${p.pasto}"/>
    <rect x="10" y="2" width="12" height="7" rx="3" fill="${p.pasto}"/>
    <rect x="10" y="6.2" width="12" height="2" fill="${p.madeira}"/>
  `);
}

function costas(p: Paleta): string {
  return svg(`
    <ellipse cx="16" cy="37" rx="9" ry="2.6" fill="${p.sombra}"/>
    <rect x="11" y="28" width="4" height="8" rx="2" fill="${p.madeiraEscura}"/>
    <rect x="17" y="28" width="4" height="8" rx="2" fill="${p.madeiraEscura}"/>
    <rect x="5.5" y="18.5" width="4" height="9" rx="2" fill="${p.folha700}"/>
    <rect x="22.5" y="18.5" width="4" height="9" rx="2" fill="${p.folha700}"/>
    <rect x="8" y="17" width="16" height="13" rx="5" fill="${p.folha600}"/>
    <rect x="10.5" y="18.5" width="11" height="10" rx="3" fill="${p.terracota}"/>
    <rect x="12" y="23" width="8" height="3.5" rx="1.5" fill="${p.terracotaEscura}"/>
    <circle cx="16" cy="12.5" r="6.5" fill="${p.madeiraEscura}"/>
    <ellipse cx="16" cy="8.6" rx="11" ry="3.4" fill="${p.pasto}"/>
    <rect x="10" y="2" width="12" height="7" rx="3" fill="${p.pasto}"/>
    <rect x="10" y="6.2" width="12" height="2" fill="${p.madeira}"/>
  `);
}

function lado(p: Paleta): string {
  return svg(`
    <ellipse cx="16" cy="37" rx="8" ry="2.6" fill="${p.sombra}"/>
    <rect x="12" y="28" width="4" height="8" rx="2" fill="${p.madeiraEscura}"/>
    <rect x="16.5" y="28" width="4" height="8" rx="2" fill="${p.madeiraEscura}"/>
    <rect x="19" y="18.5" width="5" height="10" rx="2.5" fill="${p.terracota}"/>
    <rect x="10" y="17" width="12" height="13" rx="5" fill="${p.folha600}"/>
    <rect x="13" y="19" width="4" height="8" rx="2" fill="${p.folha700}"/>
    <rect x="8" y="22.5" width="6" height="3.6" rx="1.4" fill="${p.tinta}"/>
    <circle cx="8.4" cy="24.3" r="1" fill="${p.neblina}"/>
    <circle cx="16" cy="12.5" r="6.5" fill="${p.pele}"/>
    <path d="M17 7 Q22.5 8 22 14 Q20 12 17 12 Z" fill="${p.madeiraEscura}"/>
    <circle cx="12.4" cy="13" r="1" fill="${p.tinta}"/>
    <circle cx="9.7" cy="13.8" r="1.1" fill="${p.pele}"/>
    <circle cx="13.4" cy="15.2" r="1.1" fill="${p.sabia}" opacity="0.45"/>
    <ellipse cx="15" cy="8.6" rx="10" ry="2.6" fill="${p.pasto}"/>
    <rect x="10.5" y="2" width="11" height="7" rx="3" fill="${p.pasto}"/>
    <rect x="10.5" y="6.2" width="11" height="2" fill="${p.madeira}"/>
  `);
}

function imagem(conteudoSvg: string): HTMLImageElement {
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(conteudoSvg)}`;
  return img;
}

export function criarSprites(p: Paleta): Sprites {
  return { baixo: imagem(frente(p)), cima: imagem(costas(p)), lado: imagem(lado(p)) };
}

/** Promessa resolvida quando todos os sprites podem ser desenhados. */
export function spritesProntos(sprites: Sprites): Promise<void> {
  return Promise.all(Object.values(sprites).map((img) => img.decode())).then(() => undefined);
}
