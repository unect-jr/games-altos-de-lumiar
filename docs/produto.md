# Produto — contexto, jogos e conteúdo

> **[CONFIRMAR]** = premissa razoável, ainda não validada com o cliente. **[PREENCHER]** = depende de informação do time/cliente.

## 1. Contexto da Unect Jr.
- A Unect Jr. é uma empresa júnior universitária que desenvolve soluções de software para clientes reais.
- Diretorias envolvidas: Comercial (relacionamento com o cliente), Design, Desenvolvimento (implementa o front), Projetos e Presidência (alinhamento).
- Este protótipo **não é o produto final**: é uma prova de conceito jogável para o cliente enxergar o potencial e aprovar o escopo. [PREENCHER] data da apresentação e o que a Unect quer fechar.

## 2. O cliente: Altos de Lumiar Birding Lodge
- Um **lodge de observação de aves** em região de montanha com Mata Atlântica (as fotos mostram morros, araucárias, pasto, lago com deck e jardim de hortênsias). [PREENCHER] localização exata e perfil do público.
- O cliente tem as **listas oficiais de aves** do lodge (PDFs "Refúgio das Aves" e "Recanto das Aves", maio/2026) e **fotos do espaço**. **Não tem** sons de aves nem Figma/identidade visual pronta: o design e o mapa serão criados do zero pela Unect.
- O cliente quer **vários jogos de adivinhação de aves**, para (a) **crianças** e famílias no lodge e (b) **eventos** que ele frequenta.
- Ideias do cliente: **silhueta + som** para adivinhar o nome, e um jogo **estilo Pokémon** em que um bonequinho anda pelo lodge e encontra aves para adivinhar. Aberto a outras ideias.
- [PREENCHER] logo e cores do lodge, se existirem.

## 3. Objetivo e valor
Transformar o aprendizado sobre aves em brincadeira, de modo que o jogo: (1) prenda crianças e famílias, (2) ensine a reconhecer aves pela forma e pelo canto, (3) seja um atrativo no estande dos eventos, (4) divulgue o lodge e incentive a visita. [CONFIRMAR] metas e métricas com o cliente.

## 4. Viabilidade (resumo)
| Jogo | Viável no protótipo? | Observação |
|---|---|---|
| Silhueta (adivinhar pela forma) | Sim | Depende de silhuetas boas e distintas por espécie |
| Canto (adivinhar pelo som) | Sim | Depende de gravações **com licença adequada** |
| Passeio estilo Pokémon | Sim, em 2D simples | Custo de arte (mapa e personagem) é o que mais pesa; lógica é simples |
| Álbum de aves (coleção) | Sim | Dá sentido de progresso e "quero jogar de novo" |
Riscos: (1) **assets** (silhuetas, fotos, sons) e suas licenças; (2) arte do mapa/personagem; (3) áudio exige toque inicial no celular/tablet; (4) **internet instável em eventos** (por isso os assets ficam dentro do app, sem chamadas externas); (5) **crianças**: sem login nem coleta de dados; (6) **correção biológica**: validar espécies, nomes e curiosidades com o guia/ornitólogo do lodge.

## 5. Público e princípios
- Foco em crianças de ~6 a 12 anos e suas famílias; adultos devem se divertir também.
- Frases curtas, vocabulário simples, ícones grandes. Sem tela de derrota: errar mostra a ave certa de forma gentil e ensina algo.
- Sessões curtas (2 a 5 min), com vontade de repetir. Uso em evento: aparelho compartilhado, então nada exige login ou digitação.

## 6. Jogos no escopo do protótipo
**Home (hub):** tela inicial "Toque para começar" (libera áudio) → menu com os jogos, progresso do Álbum e controle de som.

**Jogo 1 — Silhueta:** uma **rodada = 5 perguntas**. Mostra a silhueta da ave; o jogador escolhe o nome entre as opções. Acerto: a silhueta "ganha cor" (revela a foto), mostra nome e uma curiosidade, e toca o canto. Erro: mostra a ave certa e a curiosidade, sem punição.

**Jogo 2 — Canto:** mesma estrutura, mas toca o canto (botão grande de ouvir de novo, com animação de som) e as opções mostram **foto + nome** (ou só o nome nos níveis difíceis).

**Jogo 3 — Passeio (estilo Pokémon):** mapa 2D visto de cima do lodge e arredores. O personagem anda pelo mapa (teclado, setas na tela ou arrasto). Ao pisar em áreas de **mato/arbusto/comedouro**, há chance de **uma ave aparecer**. Na tela de encontro: silhueta (e botão de ouvir o canto como dica) + opções. Acerto → a ave é **registrada no Álbum** (confete). Erro → "A ave voou!": ela some e pode aparecer de novo depois. A ave sorteada depende do **habitat** da área e da **raridade**. O mapa é uma versão **estilizada** inspirada nas fotos do lodge (casa de telhado de telha, lago com deck, jardim de hortênsias, mata com araucárias, campo e estrada de terra); o desenho completo está em `docs/frontend.md` (seção 5). [CONFIRMAR] posição real de comedouros e pontos de observação.

**Jogo 4 — Álbum de aves:** grade com todas as aves; as não descobertas aparecem como silhueta com "?". Cartão da ave descoberta: foto, nome popular, nome científico, curiosidade, habitat, botão de ouvir o canto, raridade. Mostra progresso (ex.: 7/12) e títulos por faixa (ex.: Aprendiz, Observador, Guia, Mestre das aves).

**Regras comuns (quiz):**
- Dificuldade: **Fácil** (3 opções, 2 tentativas), **Médio** (4 opções), **Difícil** (4 opções com aves parecidas, via `semelhantes`). Padrão: Fácil.
- Pontos: acerto = 10; bônus de sequência (+2 por acerto seguido, até +10). Fim da rodada: resumo com as aves da rodada, estrelas (1 a 3) e botão "Jogar de novo".
- Distratores: sorteados entre as demais aves; no Difícil, priorizar `semelhantes`.
- Aves acertadas em qualquer jogo contam para o Álbum (descoberta).

## 7. Ideias para a proposta (NÃO construir agora; apresentar ao cliente)
1. **Quem sou eu?** — pistas progressivas (tamanho, cor, habitat, alimentação); menos pistas = mais pontos.
2. **Jogo da memória** — parear ave com seu canto ou sua silhueta (ótimo para os menores).
3. **Bingo das Aves** — cartela para eventos: marcar as aves que o grupo identifica.
4. **Modo Evento (quiosque)** — tela cheia, reinício automático por inatividade, **desafio de 60 s** e ranking do dia (local).
5. **Trilha com QR Codes no lodge** — cada ponto da trilha libera uma ave e uma pergunta.
6. **Sons do próprio lodge** — o cliente grava as aves reais do local (conteúdo exclusivo e sem problema de licença).
7. **Ave do dia** e selos de conquista para compartilhar.
8. Versão **offline/PWA** para eventos sem internet; integração com o app de avistamento da Unect (se o cliente for o mesmo). [CONFIRMAR]

## 8. Dados (`src/data/types.ts` e `src/data/aves.ts`)
- `Ave`: id, slug, nomePopular, nomeCientifico, familia, habitats (`'jardim' | 'mata' | 'agua' | 'campo' | 'comedouro'`), raridade (`'comum' | 'incomum' | 'rara'`), semelhantes (ids), curiosidade, midia { silhueta, foto, canto, creditos[] }.
- `Progresso`: descobertas (id da ave → data), pontuacao, melhorSequencia, dificuldade, somLigado.
- `Rodada`: jogo (`'silhueta' | 'canto'`), perguntas[{ aveId, opcoes[], respostaId }].
Sem `enum`: use union types.
Credenciais de mídia (autor, licença, fonte) ficam em `midia.creditos` e aparecem na página **Créditos**.

## 9. Aves do protótipo (12 espécies reais do lodge)
Fonte: listas oficiais do lodge (PDFs "Refúgio das Aves" e "Recanto das Aves", maio/2026). Versão **demonstrativa**: 12 espécies escolhidas por terem **silhueta e canto bem distintos** e por constarem nas listas. [CONFIRMAR] com o cliente quais são as mais icônicas do lodge. A "raridade" abaixo é só de **equilíbrio do jogo**, não científica. O Claude **não deve acrescentar fatos além dos curtos abaixo** (validar com o guia do lodge).
| Nome popular | Científico | Nas listas | Habitats no Passeio | Raridade (jogo) | Curiosidade (curta) |
|---|---|---|---|---|---|
| Tucanuçu | Ramphastos toco | Refúgio e Recanto | mata, comedouro | incomum | É o maior dos tucanos, e o bico enorme é leve por dentro. |
| Beija-flor-tesoura | Eupetomena macroura | Refúgio e Recanto | jardim, comedouro | comum | A cauda comprida lembra uma tesoura. |
| Quero-quero | Vanellus chilensis | Refúgio e Recanto | campo, água | comum | Grita para avisar quando há perigo por perto. |
| João-de-barro | Furnarius rufus | Refúgio e Recanto | campo, jardim | comum | Constrói a casa de barro, parecida com um forninho. |
| Bem-te-vi | Pitangus sulphuratus | Refúgio e Recanto | jardim, campo | comum | O canto parece dizer o próprio nome. |
| Sabiá-laranjeira | Turdus rufiventris | Refúgio e Recanto | jardim, comedouro | comum | É a ave símbolo do Brasil e canta ao amanhecer. |
| Araponga | Procnias nudicollis | Refúgio e Recanto | mata | rara | O canto metálico parece marteladas numa bigorna e ecoa pela mata. |
| Tangará | Chiroxiphia caudata | Refúgio e Recanto | mata | rara | Os machos dançam juntos para impressionar as fêmeas. |
| Corujinha-do-mato | Megascops choliba | Refúgio e Recanto | mata | incomum | Pequena, com "orelhas" de penas, vive de noite. |
| Seriema | Cariama cristata | só Refúgio | campo | incomum | Corre muito e dá um grito forte que se ouve de longe. |
| Martim-pescador-grande | Megaceryle torquata | Refúgio e Recanto | água | incomum | Mergulha na água para pegar peixes. |
| Saíra-sete-cores | Tangara seledon | Refúgio e Recanto | jardim, comedouro, mata | incomum | Tem penas de muitas cores e adora frutas. |
`semelhantes` (para o nível Difícil): quero-quero ↔ seriema; bem-te-vi ↔ sabiá-laranjeira ↔ joão-de-barro; tangará ↔ saíra-sete-cores ↔ araponga.
Habitats possíveis: `'jardim' | 'mata' | 'agua' | 'campo' | 'comedouro'`.

## 10. Conteúdo e licenças (decisão crítica)
**Escopo demonstrativo:** 1 canto + 1 foto + 1 silhueta por espécie (12 de cada), mais as fotos do lodge fornecidas pelo cliente.
- **Sons:** o Xeno-canto publica cada gravação sob uma licença Creative Commons escolhida pelo gravador; é preciso exibir o gravador, a licença e o número XC. Como o cliente é um negócio e o áudio será **cortado**, evite **NC** (não comercial) e **ND** (sem derivadas). Prefira **CC BY, CC BY-SA ou domínio público/CC0** e confira a licença **de cada arquivo**. Para a versão final, o ideal é o cliente **gravar as aves do próprio lodge** (ou obter autorização direta dos gravadores).
- **Silhuetas:** (a) PhyloPic, biblioteca de silhuetas livres (cada imagem tem sua licença; filtrar "livre para uso comercial"); (b) recorte de foto com licença adequada, com fundo transparente, exibido como silhueta por CSS (`brightness(0)`). Devem ser **distintas** entre as espécies.
- **Fotos das aves:** do próprio lodge/guia ou de fontes com licença que permita o uso (ex.: Wikimedia Commons, conferindo cada imagem). **Fotos do lodge:** fornecidas pelo cliente, em `public/lodge/`.
- **Arquivos:** áudio `.mp3` de 6 a 12 s, mono, normalizado, ≤ 150 KB; imagens `.webp`; tudo em `public/aves/<slug>/` (`silhueta.png|svg`, `foto.webp`, `canto.mp3`) e `public/lodge/`. Sem chamadas a serviços externos em tempo de execução.
- **Créditos:** cada mídia registra `{ tipo, autor, licenca, fonte }` em `midia.creditos` (para sons: autor, licença e número/URL do XC), exibidos na página **Créditos**. Antes de apresentar ao cliente, **todos** os arquivos usados precisam estar creditados.
- Se faltar algum arquivo, use o placeholder e liste a pendência; nunca baixe nem gere mídia por conta própria.

## 11. Fora de escopo
Autenticação, backend/API, cadastro de usuários, ranking online, coleta de dados pessoais ou de menores, pagamentos, geolocalização, reconhecimento de aves por câmera/microfone, testes automatizados.