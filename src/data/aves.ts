import type { Ave, Habitat } from "./types";

// 12 aves reais do lodge (versão demonstrativa). Fonte: docs/produto.md, seção 9.
// Não acrescente fatos além dos que estão aqui sem validar com o guia do lodge.
//
// Mídias: quando o arquivo existir em `public/aves/<slug>/`, troque o `null`
// pelo caminho (ex.: "/aves/bem-te-vi/foto.webp") e registre o crédito.

/** Imagem neutra usada enquanto a foto/silhueta real não existe. */
export const PLACEHOLDER_AVE = "/aves/placeholder.svg";

const semMidia = () => ({ silhueta: null, foto: null, canto: null, creditos: [] });

export const aves: Ave[] = [
  {
    id: "tucanucu",
    slug: "tucanucu",
    nomePopular: "Tucanuçu",
    nomeCientifico: "Ramphastos toco",
    familia: null,
    habitats: ["mata", "comedouro"],
    raridade: "incomum",
    semelhantes: [],
    curiosidade: "É o maior dos tucanos, e o bico enorme é leve por dentro.",
    midia: semMidia(),
  },
  {
    id: "beija-flor-tesoura",
    slug: "beija-flor-tesoura",
    nomePopular: "Beija-flor-tesoura",
    nomeCientifico: "Eupetomena macroura",
    familia: null,
    habitats: ["jardim", "comedouro"],
    raridade: "comum",
    semelhantes: [],
    curiosidade: "A cauda comprida lembra uma tesoura.",
    midia: semMidia(),
  },
  {
    id: "quero-quero",
    slug: "quero-quero",
    nomePopular: "Quero-quero",
    nomeCientifico: "Vanellus chilensis",
    familia: null,
    habitats: ["campo", "agua"],
    raridade: "comum",
    semelhantes: ["seriema"],
    curiosidade: "Grita para avisar quando há perigo por perto.",
    midia: semMidia(),
  },
  {
    id: "joao-de-barro",
    slug: "joao-de-barro",
    nomePopular: "João-de-barro",
    nomeCientifico: "Furnarius rufus",
    familia: null,
    habitats: ["campo", "jardim"],
    raridade: "comum",
    semelhantes: ["bem-te-vi", "sabia-laranjeira"],
    curiosidade: "Constrói a casa de barro, parecida com um forninho.",
    midia: semMidia(),
  },
  {
    id: "bem-te-vi",
    slug: "bem-te-vi",
    nomePopular: "Bem-te-vi",
    nomeCientifico: "Pitangus sulphuratus",
    familia: null,
    habitats: ["jardim", "campo"],
    raridade: "comum",
    semelhantes: ["sabia-laranjeira", "joao-de-barro"],
    curiosidade: "O canto parece dizer o próprio nome.",
    midia: semMidia(),
  },
  {
    id: "sabia-laranjeira",
    slug: "sabia-laranjeira",
    nomePopular: "Sabiá-laranjeira",
    nomeCientifico: "Turdus rufiventris",
    familia: null,
    habitats: ["jardim", "comedouro"],
    raridade: "comum",
    semelhantes: ["bem-te-vi", "joao-de-barro"],
    curiosidade: "É a ave símbolo do Brasil e canta ao amanhecer.",
    midia: semMidia(),
  },
  {
    id: "araponga",
    slug: "araponga",
    nomePopular: "Araponga",
    nomeCientifico: "Procnias nudicollis",
    familia: null,
    habitats: ["mata"],
    raridade: "rara",
    semelhantes: ["tangara", "saira-sete-cores"],
    curiosidade: "O canto metálico parece marteladas numa bigorna e ecoa pela mata.",
    midia: semMidia(),
  },
  {
    id: "tangara",
    slug: "tangara",
    nomePopular: "Tangará",
    nomeCientifico: "Chiroxiphia caudata",
    familia: null,
    habitats: ["mata"],
    raridade: "rara",
    semelhantes: ["saira-sete-cores", "araponga"],
    curiosidade: "Os machos dançam juntos para impressionar as fêmeas.",
    midia: semMidia(),
  },
  {
    id: "corujinha-do-mato",
    slug: "corujinha-do-mato",
    nomePopular: "Corujinha-do-mato",
    nomeCientifico: "Megascops choliba",
    familia: null,
    habitats: ["mata"],
    raridade: "incomum",
    semelhantes: [],
    curiosidade: "Pequena, com \"orelhas\" de penas, vive de noite.",
    midia: semMidia(),
  },
  {
    id: "seriema",
    slug: "seriema",
    nomePopular: "Seriema",
    nomeCientifico: "Cariama cristata",
    familia: null,
    habitats: ["campo"],
    raridade: "incomum",
    semelhantes: ["quero-quero"],
    curiosidade: "Corre muito e dá um grito forte que se ouve de longe.",
    midia: semMidia(),
  },
  {
    id: "martim-pescador-grande",
    slug: "martim-pescador-grande",
    nomePopular: "Martim-pescador-grande",
    nomeCientifico: "Megaceryle torquata",
    familia: null,
    habitats: ["agua"],
    raridade: "incomum",
    semelhantes: [],
    curiosidade: "Mergulha na água para pegar peixes.",
    midia: semMidia(),
  },
  {
    id: "saira-sete-cores",
    slug: "saira-sete-cores",
    nomePopular: "Saíra-sete-cores",
    nomeCientifico: "Tangara seledon",
    familia: null,
    habitats: ["jardim", "comedouro", "mata"],
    raridade: "incomum",
    semelhantes: ["tangara", "araponga"],
    curiosidade: "Tem penas de muitas cores e adora frutas.",
    midia: semMidia(),
  },
];

const porId = new Map(aves.map((ave) => [ave.id, ave]));

/** Busca a ave pelo id. Lança erro se o id não existir (bug de dados). */
export function getAve(id: string): Ave {
  const ave = porId.get(id);
  if (!ave) throw new Error(`Ave desconhecida: ${id}`);
  return ave;
}

export function avesDoHabitat(habitat: Habitat): Ave[] {
  return aves.filter((ave) => ave.habitats.includes(habitat));
}

/** Foto da ave ou o placeholder. */
export function fotoDe(ave: Ave): string {
  return ave.midia.foto ?? PLACEHOLDER_AVE;
}

/** Silhueta da ave; sem silhueta, a foto (escurecida por CSS); senão o placeholder. */
export function silhuetaDe(ave: Ave): string {
  return ave.midia.silhueta ?? ave.midia.foto ?? PLACEHOLDER_AVE;
}
