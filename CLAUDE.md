# CLAUDE.md — Protótipo Jogos das Aves (Altos de Lumiar)

Protótipo **somente front-end**, com dados mockados, feito pela **Unect Jr.** (empresa júnior universitária)
para o **Altos de Lumiar Birding Lodge**, um lodge de observação de aves. São jogos de adivinhação de aves para **crianças e famílias**,
usados no lodge e levados a **eventos** (tablet/notebook/tela touch). Será publicado na **Vercel**.
É uma versão **demonstrativa**: 12 aves reais do lodge, não o catálogo completo.
Objetivo: mostrar, com jogos jogáveis de ponta a ponta e acabamento profissional, como o cliente engaja o público e ensina sobre as aves.

## Leia sob demanda (NÃO leia tudo toda vez)
- `docs/produto.md` — contexto, jogos, regras, dados das aves, conteúdo e licenças. Leia antes de implementar lógica, dados ou qualquer jogo.
- `docs/frontend.md` — direção visual, estrutura, mapa/Canvas, áudio, animações, acessibilidade, deploy. Leia antes de implementar UI.

## Comandos
- `npm run dev` — servidor Vite com HMR
- `npm run build` — `tsc -b` + build de produção em `dist/`
- `npm run lint` — ESLint
- `npm run preview` — serve o `dist/`
Sem test runner. Valide cada etapa com `npm run build`.

## Stack e armadilhas
- React 19 + TypeScript + Vite + `@vitejs/plugin-react`.
- Tailwind CSS v4 via `@tailwindcss/vite`. Não existe `tailwind.config.js`: tokens ficam em `src/index.css` com `@theme`.
- TypeScript estrito: sem locals/params não usados, `verbatimModuleSyntax` (use `import type`), `erasableSyntaxOnly` (sem `enum`, sem parameter properties, sem namespaces).
- Dependências permitidas além do template: `react-router`, `motion`. O jogo "Passeio" usa **Canvas 2D próprio, sem engine de jogo** (nada de Phaser/Pixi/Three). Qualquer outra dependência: pergunte antes.
- `src/App.css` e `src/assets/*` do template não são usados; remova quando for conveniente.

## Regras inegociáveis
1. **Não há Figma neste projeto.** A direção de arte e o mapa do lodge estão em `docs/frontend.md`; siga-os. Não use o MCP do Figma.
2. Todo texto em **pt-BR**, simples e curto (público infantil).
3. **Sem backend, sem login, sem coleta de dados pessoais** (público infantil). Progresso e som ficam em memória, com `localStorage` opcional (try/catch).
4. **Conteúdo é dado, não código:** aves, textos, sons e imagens vêm de `src/data/aves.ts` e `public/aves/<slug>/`. **Nunca invente fatos sobre aves** nem baixe/raspe áudio ou imagem de sites. Use só os dados e arquivos existentes; se faltar mídia, use o placeholder e **liste as pendências** na resposta final. Fotos do lodge (do cliente) ficam em `public/lodge/`.
5. **Áudio só toca após um gesto do usuário** (política dos navegadores). Há uma tela inicial "Toque para começar" que libera o áudio.
6. **Mobile/tablet primeiro, toque primeiro**: alvos ≥ 56 px, sem hover obrigatório. Funciona também com teclado e mouse.
7. Erro nunca é punitivo: feedback gentil, sem tela de "perdeu". Sem timer nos modos infantis (só no modo evento, se for pedido).
8. Código em inglês, nomes de domínio em português (`Ave`, `Rodada`, `Album`), comentários em português, sem `any`.

## Fluxo de trabalho (por jogo/tela)
1. Ler só a seção relevante de `docs/` para a tarefa (não há Figma).
2. Antes de codar algo grande, mostrar plano curto: componentes, rotas, dados, assets necessários. Esperar OK.
3. Implementar reaproveitando componentes de `src/components/` e a lógica compartilhada de quiz.
4. Validar com `npm run build` (e `npm run lint` ao fim). **O Nuno confere o visual e o som no navegador.**
5. Responder só com a lista de arquivos criados/alterados, assets pendentes e dúvidas.

## Economia de tokens
- **Nunca tire screenshots nem leia imagens** para conferir o visual: nada de prints do navegador, Playwright, extensão do Chrome ou leitura de PNG/JPG/SVG grandes. A conferência visual é do Nuno.
- **Não leia arquivos binários** (mp3, ogg, png, jpg, webp) nem abra `public/aves/` inteiro. Trabalhe pelos metadados em `src/data/aves.ts`.
- Uma tela ou jogo por sessão. Sugira `/clear` quando terminar.
- Não leia `node_modules/`, `dist/`, lockfiles nem arquivos grandes sem necessidade. Prefira Glob/Grep a ler arquivos inteiros.
- Não reescreva arquivos grandes para mudanças pequenas: edite só o trecho.
- Não crie documentação, testes ou arquivos extras que não foram pedidos.
- Não suba o dev server nem abra o navegador para "ver" o resultado.
- Respostas curtas; não repita o que já está nos docs.

## Git
Commits em português, conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`), um commit por jogo ou marco.