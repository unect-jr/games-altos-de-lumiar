// Jogos exibidos no menu da tela inicial.
export type JogoId = "silhueta" | "canto" | "passeio" | "album";

export type Jogo = {
  id: JogoId;
  rota: string;
  titulo: string;
  descricao: string;
  /** Cor de acento do cartão (token de cor do @theme). */
  cor: "saira" | "sabia" | "folha" | "terracota";
};

export const jogos: Jogo[] = [
  {
    id: "silhueta",
    rota: "/silhueta",
    titulo: "Silhueta",
    descricao: "Descubra a ave pela sombra",
    cor: "saira",
  },
  {
    id: "canto",
    rota: "/canto",
    titulo: "Canto",
    descricao: "Quem está cantando?",
    cor: "sabia",
  },
  {
    id: "passeio",
    rota: "/passeio",
    titulo: "Passeio",
    descricao: "Explore o lodge e ache aves",
    cor: "folha",
  },
  {
    id: "album",
    rota: "/album",
    titulo: "Álbum",
    descricao: "Veja as aves que você achou",
    cor: "terracota",
  },
];
