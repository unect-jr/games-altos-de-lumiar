// Progresso e títulos do Álbum. Lógica pura, sem React.

type FaixaTitulo = {
  nome: string;
  /** Fração mínima do álbum (0 a 1). Com 12 aves: 0, 4, 8 e 12. */
  fracao: number;
};

/** Faixas em ordem crescente. A última exige o álbum completo. */
const FAIXAS: readonly FaixaTitulo[] = [
  { nome: "Aprendiz", fracao: 0 },
  { nome: "Observador", fracao: 1 / 3 },
  { nome: "Guia", fracao: 2 / 3 },
  { nome: "Mestre das aves", fracao: 1 },
];

export type ProgressoAlbum = {
  descobertas: number;
  total: number;
  /** 0 a 1, para a barra. */
  fracao: number;
  titulo: string;
  /** Próximo título e quantas aves faltam; `null` com o álbum completo. */
  proximo: { titulo: string; faltam: number } | null;
};

function minimoDaFaixa(faixa: FaixaTitulo, total: number): number {
  return Math.ceil(faixa.fracao * total);
}

/** Calcula o progresso contando só ids que existem no catálogo. */
export function progressoAlbum(
  descobertas: Record<string, string>,
  idsCatalogo: readonly string[],
): ProgressoAlbum {
  const total = idsCatalogo.length;
  const qtd = idsCatalogo.filter((id) => id in descobertas).length;

  let atual = FAIXAS[0];
  let proxima: FaixaTitulo | null = null;
  for (const faixa of FAIXAS) {
    if (qtd >= minimoDaFaixa(faixa, total)) atual = faixa;
    else {
      proxima = faixa;
      break;
    }
  }

  return {
    descobertas: qtd,
    total,
    fracao: total === 0 ? 0 : qtd / total,
    titulo: atual.nome,
    proximo: proxima ? { titulo: proxima.nome, faltam: minimoDaFaixa(proxima, total) - qtd } : null,
  };
}

/** Frase curta de incentivo para a criança. */
export function fraseProgresso(p: ProgressoAlbum): string {
  if (p.descobertas === 0) return "Acerte aves nos jogos para encher o álbum!";
  if (!p.proximo) return "Você encontrou todas as aves!";
  const { faltam, titulo } = p.proximo;
  return faltam === 1 ? `Falta 1 ave para ${titulo}!` : `Faltam ${faltam} aves para ${titulo}!`;
}
