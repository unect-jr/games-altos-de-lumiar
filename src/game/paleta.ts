// Cores do Canvas lidas dos tokens @theme (src/index.css), sem hex duplicado aqui.
const TOKENS = {
  grama: "--color-mapa-grama",
  gramaEscura: "--color-mapa-grama-escura",
  trilha: "--color-mapa-trilha",
  trilhaEscura: "--color-mapa-trilha-escura",
  agua: "--color-mapa-agua",
  aguaFunda: "--color-mapa-agua-funda",
  aguaReflexo: "--color-mapa-agua-reflexo",
  campo: "--color-mapa-campo",
  pedra: "--color-mapa-pedra",
  pedraEscura: "--color-mapa-pedra-escura",
  pele: "--color-mapa-pele",
  sombra: "--color-mapa-sombra",
  mata950: "--color-mata-950",
  mata900: "--color-mata-900",
  mata700: "--color-mata-700",
  mata500: "--color-mata-500",
  folha400: "--color-folha-400",
  folha600: "--color-folha-600",
  folha700: "--color-folha-700",
  creme50: "--color-creme-50",
  creme100: "--color-creme-100",
  terracota: "--color-terracota",
  terracotaEscura: "--color-terracota-escura",
  madeira: "--color-madeira",
  madeiraEscura: "--color-madeira-escura",
  hortensia: "--color-hortensia",
  hortensiaLilas: "--color-hortensia-lilas",
  neblina: "--color-neblina",
  pasto: "--color-pasto",
  canario: "--color-canario",
  sabia: "--color-sabia",
  tinta: "--color-tinta",
} as const;

export type Paleta = Record<keyof typeof TOKENS, string>;

export function lerPaleta(): Paleta {
  const estilo = getComputedStyle(document.documentElement);
  const paleta = {} as Paleta;
  for (const nome of Object.keys(TOKENS) as (keyof typeof TOKENS)[]) {
    paleta[nome] = estilo.getPropertyValue(TOKENS[nome]).trim();
  }
  return paleta;
}
