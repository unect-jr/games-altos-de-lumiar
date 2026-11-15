# Frontend — direção visual, jogos e qualidade

## 1. Fonte visual
- **Não há Figma.** A direção de arte (seção 2) e o mapa (seção 5) são a fonte da verdade. A skill `frontend-design` ajuda no acabamento, mas **sem trocar** a identidade descrita aqui.
- Declare tudo em tokens `@theme` em `src/index.css` antes de codar as telas (cores, tipografia, raios, sombras, espaçamentos). Proibido valor "mágico" repetido nos componentes.
- Não use screenshots para conferir; o Nuno confere no navegador.

## 2. Direção de arte
Tema: **Mata Atlântica ilustrada, calorosa e viva**, com acabamento de produto de verdade (não parecer template genérico).
- **Paleta (inspirada nas fotos do lodge):** verde-mata profundo (fundos e títulos), verde-folha (ações), creme de papel (superfícies), terracota do telhado, marrom-madeira do deck, azul-hortênsia e azul-neblina das montanhas, dourado do pasto; acentos tirados das aves: laranja-sabiá, azul-saíra, amarelo-canário e vermelho-tiê (usados com moderação). Feedback: acerto em verde com ícone ✓, "quase" em âmbar com ícone, nunca vermelho agressivo.
- **Tipografia:** títulos arredondados e amigáveis (ex.: Fredoka ou Baloo 2) e texto muito legível (ex.: Nunito ou Atkinson Hyperlegible), via Google Fonts, com fallback. Tamanhos generosos.
- **Textura e forma:** ilustração vetorial flat, cantos bem arredondados, textura de papel/grão sutil no fundo, folhagens como moldura (SVG simples). Botões grandes, "gordinhos", com sombra suave de profundidade.
- **Mapa do Passeio:** vista de cima, vetorial flat, tiles simples e coloridos (grama, trilha de terra, arbustos, água, deck do lodge, árvores). Personagem em SVG ou sprite simples com 4 direções.
- **Home:** usar uma foto do lodge (fornecida pelo cliente, em `public/lodge/`, em `.webp`) como destaque, com sobreposição escura/gradiente para o texto ficar legível.
- Tom: curioso, acolhedor, científico sem ser sério demais.

## 3. Estrutura
```
src/
  components/   ui/ (Button, AnswerButton, Modal, Toast, ProgressDots, SoundToggle...) e jogo (SilhouetteStage, BirdCard, AudioButton, EncounterSheet, DPad, Confetti)
  pages/        Inicio, Silhueta, Canto, Passeio, Album, Creditos
  layouts/      GameShell (cabeçalho: voltar, pontos, som)
  game/         map.ts (mapa em dados), engine.ts (loop, movimento, encontros), sprites.ts
  quiz/         montarRodada.ts, pontuacao.ts (lógica compartilhada, pura e sem React)
  store/        Context + useReducer (progresso, dificuldade, som)
  data/         types.ts, aves.ts
  lib/          audio.ts (player único), format.ts
public/aves/<slug>/   silhueta, foto, canto
public/lodge/         fotos do lodge (cliente)
```
Componentes pequenos e tipados, um por arquivo. Lógica de quiz e de encontro ficam em módulos **puros** (sem React), fáceis de ler e de testar à mão.

## 4. Mobile/tablet primeiro
- Layout pensado para **tablet e celular**, retrato e paisagem. Desktop usa o mesmo layout centralizado com limite de largura.
- Alvos de toque ≥ 56 px; sem dependência de hover. `touch-action: none` e sem rolagem/zoom acidental dentro dos jogos; respeitar safe areas (`viewport-fit=cover`, `env(safe-area-inset-*)`).
- Jogos usam a altura inteira da tela (`dvh`), sem barra de rolagem.

## 5. Passeio (Canvas 2D, sem engine de jogo)
- Mapa como **grade de tiles** em `game/map.ts` (24 × 16). Tile base 32 px, escalado por `devicePixelRatio` e para caber na tela. **Os tiles são desenhados por código** (formas vetoriais simples com cores dos tokens), sem sprites nem imagens de mapa.
- **Mapa demonstrativo do lodge** (estilizado, inspirado nas fotos: casa com telhado de telha, lago com deck, hortênsias, mata com araucárias, campo e estrada de terra). Use esta matriz como está; todas as casas andáveis são alcançáveis a partir do início `S`:
```
TTmmmmmmTTTTTTmmmmmmmmTT
TmmmmmmmmmTTTmmmmmmmmmmT
Tmmm....mm.,,.mm...mmmmT
Tm.....R...,,.........mT
T..~~~~~...,,..HHHHH..jT
T.~~~~~~~..,,..HHHHH.jjT
T.~~~~~dddd,,..,,,,,,.jT
T.~~~~~dddd,,.S,,,,,,.jT
T.~~~~~~~..,,..jjjj..ggT
T..~~~~~...,,..jjjjjjggT
T...~~~....,,..cj.c..ggT
T..........,,.........gT
Tgg.......,,,,,,,,,..ggT
Tggg.....,,.......,,,.gT
TT,,,,,,,,,..gg...,,,,,T
TTTTTTTTTTTTTTTTTTTTTTTT
```
  Legenda — **bloqueados:** `T` árvore/araucária, `~` água do lago, `H` casa, `R` pedra grande. **Andáveis sem encontro:** `.` grama, `,` trilha/estrada de terra, `S` início. **Andáveis com encontro (habitat):** `m` mato → `mata`; `j` jardim de hortênsias → `jardim`; `g` campo → `campo`; `d` deck/píer do lago → `agua`; `c` comedouro → `comedouro` (chance maior; [CONFIRMAR] posição real).
  Desenho: casa `H` com telhado terracota e varanda de madeira; lago `~` em azul-esverdeado com reflexos simples; deck `d` em madeira com um guarda-sol amarelo; `T` desenhadas como araucárias (copa em guarda-chuva) e árvores; hortênsias `j` com bolinhas azuis e lilás; campo `g` em dourado-esverdeado.
- Movimento **por tile**, como Pokémon: um passo por vez, com interpolação suave (~120–160 ms). Colisão com árvores, água, paredes e limites. A câmera acompanha o personagem.
- **Controles:** setas/WASD, **D-pad virtual** na tela (touch) e opcionalmente deslizar. Segurar a direção continua andando.
- **Encontros:** ao entrar num tile de arbusto/comedouro/jardim, sorteia com chance ~12–15% (com mínimo de passos entre encontros e garantia de um encontro após N passos). A ave sai do conjunto do **habitat da área**, ponderada pela raridade (comum > incomum > rara). Animação: o arbusto balança, a silhueta da ave aparece e a tela de encontro abre.
- **Tela de encontro** (React por cima do Canvas, `EncounterSheet`): silhueta, botão de ouvir o canto como dica, opções. Acerto: registra no Álbum + confete. Erro: "A ave voou!" e ela some.
- Loop com `requestAnimationFrame` e estado do jogo em `ref` (React cuida só da UI); pausar quando a aba ficar oculta; limpar listeners e o loop ao sair da tela.
- **Personagem:** um explorador/observador de aves (chapéu e binóculos) desenhado em SVG, com 4 direções simples e leve balanço ao andar. Nada de sprites complexos nem de arte externa nesta versão.

## 6. Áudio
- Um **player único** (`lib/audio.ts`): carregar o próximo canto antes da pergunta, parar o anterior ao trocar, parar ao sair da tela e ao ocultar a aba.
- Liberar o áudio no gesto inicial ("Toque para começar"). Controle de som (ligar/desligar) sempre visível; lembrar a escolha.
- Se o arquivo falhar ou o aparelho estiver mudo, mostrar aviso amigável e botão de tentar de novo, nunca travar o jogo.
- Enquanto toca, animação de "ondas/equalizador" no botão de ouvir.

## 7. Silhueta e revelação
- Silhueta: imagem com fundo transparente + `filter: brightness(0)` (ou máscara). Revelar: transição para a foto colorida (fade + leve escala).
- Acessibilidade: antes de revelar, `aria-label` genérico ("silhueta de uma ave"); o nome só entra no texto alternativo **depois** de revelado.

## 8. Animações (biblioteca `motion`, `import { motion } from "motion/react"`)
Objetivo: sensação viva e divertida **sem atrapalhar o jogo**. Só `motion`; **não** usar GSAP, Lenis nem 3D.
- Transição entre telas: fade + leve deslocamento, 200–300 ms.
- Opções de resposta: entrada em cascata; `whileTap` com escala 0.96; acerto com pulo suave e ✓, "quase" com balanço leve (sem vermelho forte).
- Revelação da ave: silhueta → cor, nome surge deslizando, ave "pula" levemente.
- Encontro: arbusto balança, ave entra voando (curva suave) e sai voando quando erra.
- Álbum: cartão novo "vira" para revelar; confete leve (feito à mão, poucas partículas) ao registrar ave; barra de progresso animada.
- Easing suave (ex.: `[0.22, 1, 0.36, 1]`), durações entre 150 e 450 ms. Animar só `transform` e `opacity` quando possível.
- Respeitar `prefers-reduced-motion`: envolver o app em `<MotionConfig reducedMotion="user">` e reduzir confete/balanço.

## 9. Acessibilidade e público infantil
- Texto curto e grande; contraste suficiente; **não depender só de cor** (ícone + texto no acerto/erro).
- Suporte a teclado em tudo (Tab, Enter, setas no Passeio); foco visível; `button` de verdade; `aria-label` em ícones.
- O jogo de Canto precisa de som: se o som estiver desligado, avisar e sugerir os outros jogos. Os botões de ouvir têm rótulo claro.
- Sem coleta de dados, sem links externos soltos nas telas das crianças, sem propaganda. Página **Créditos** acessível por um botão discreto (adultos).

## 10. Performance (aparelhos modestos e eventos)
- Imagens `.webp` otimizadas, áudio curto, `loading="lazy"` fora das telas de jogo; orçamento total de assets pequeno.
- Tudo local (nada de CDN de mídia em tempo de execução). Preparar para uso **offline** depois (PWA), mas não implementar agora.
- Canvas: redesenhar só o necessário; evitar alocações dentro do loop.

## 11. Ordem de implementação (um commit por marco)
1. Tokens + layout base (GameShell), rotas, tela inicial "Toque para começar" e menu.
2. `data/types.ts`, `data/aves.ts` (12 aves), `quiz/` (rodada, distratores, pontuação) e store.
3. `lib/audio.ts` e componentes base (AnswerButton, AudioButton, SilhouetteStage, BirdCard, Toast).
4. Jogo **Silhueta** completo (rodada de 5, revelação, resumo, dificuldades).
5. Jogo **Canto** reaproveitando o quiz.
6. **Álbum** (grade, cartão, progresso, títulos) e persistência opcional.
7. **Passeio**: mapa, movimento, D-pad, encontros, tela de encontro, registro no Álbum.
8. Página **Créditos**, estados de erro (áudio/imagem), polimento de animações e acessibilidade.
9. Deploy na Vercel.

## 12. Deploy (Vercel)
- App estático (SPA). Criar `vercel.json` para o React Router funcionar ao recarregar a página:
  `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- Build: `npm run build`, saída `dist/`, framework "Vite". Conectar o repositório do GitHub e deploy a cada `push` na `main`.
- Antes do deploy: `npm run build` e `npm run lint` sem erros; ajustar `<title>`, `lang="pt-BR"` e ícone; percorrer os 4 jogos em um celular/tablet de verdade (som incluído).

## 13. Checklist de pronto (por jogo)
- [ ] Usa só tokens do `@theme`; visual conforme a direção de arte.
- [ ] Conteúdo vem de `src/data/aves.ts`; nenhum fato inventado; créditos registrados.
- [ ] Funciona por toque e teclado; alvos grandes; sem rolagem acidental.
- [ ] Áudio liberado por gesto, com fallback de erro; som ligável/desligável.
- [ ] Erro gentil, sem punição; feedback não depende só de cor.
- [ ] Animações aplicadas e respeitando reduced motion.
- [ ] `npm run build` passa. (Conferência visual e sonora: Nuno.)