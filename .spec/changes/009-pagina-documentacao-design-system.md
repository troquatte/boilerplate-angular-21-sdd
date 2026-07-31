# Página Documentação Design System

## Objetivo

Criar uma página interna (`/design-system`) que documente e demonstre os tokens, componentes e padrões visuais reais utilizados pela aplicação, servindo como referência única para desenvolvedores. A página deve reutilizar o menu lateral compartilhado (`app-menu-left-container`) e seguir o tema claro do dashboard administrativo, sem criar estilos exclusivos.

## Contexto Técnico

Stack local: Angular v21 + SSR, SCSS com SMACSS, Bootstrap Grid, tokens CSS customizados. O menu lateral reutilizável `app-menu-left-container` já existe em `src/app/modules/shared/components/menu-left-container/` e é utilizado pelo dashboard administrativo (`admin/dashboard`). A página de design system foi criada como documentação interna e deve seguir os mesmos padrões de layout e identidade visual do restante da aplicação.

## Escopo

- Página `/design-system` com seções: Foundations, Colors, Typography, Buttons, Forms, Cards, Tables e Feedback.
- Layout claro (background branco/cinza claro, texto escuro), integrado ao condicional do `app.component.html` que renderiza o menu lateral para rotas admin.
- Reutilização de `app-menu-left-container` e `app-menu-bottom-container` com links de âncora para cada seção da página.
- Documentação visual dos tokens e componentes existentes, sem alterar o design system oficial (`src/scss/`).
- Validação de lint, build e responsividade.

## Fora de Escopo

- Alterações em `src/scss/components/_form.scss`, `src/scss/components/_btn.scss` ou qualquer arquivo do design system oficial.
- Criação de novos tokens, cores, componentes ou estilos exclusivos para a página de documentação.
- Seções de Navigation, Overlays, Loading and Empty States (não há componentes estilizados para isso no design system atual).
- Documentação de utilities de espaçamento (`ex-mb-1`, `gap-7`, etc.) — não são parte do design system visual.
- Testes unitários automatizados do componente (fora do padrão atual do projeto).
- Alteração de guards, rotas de auth ou lógica de autorização.

## Premissas

- O design system oficial (`src/scss/`) não será modificado para atender à página de documentação.
- A página deve refletir fielmente o estado atual dos tokens e componentes, mesmo que alguns estejam incompletos.
- O menu lateral será reutilizado via `app-menu-left-container` com links de âncora (`#colors`, `#buttons`, etc.) e não como rotas Angular.
- A página será carregada no layout admin (com menu lateral) através do condicional existente em `app.component.html`.

## Restrições

- Não utilizar Angular Material na página.
- Não utilizar estilos inline no HTML (exceto estruturais mínimos como `id` para âncoras).
- Não instalar bibliotecas visuais adicionais.
- O SCSS do componente deve conter apenas estilos estruturais (layout, navegação, âncoras); os visuais dos elementos demonstrados devem vir do design system oficial.
- Usar `:host` para encapsulamento de estilos da página, evitando vazamento para o restante da aplicação.

## Dependências

- `src/app/modules/shared/components/menu-left-container/menu-left-container.component.ts`
- `src/app/modules/shared/components/menu-bottom-container/menu-bottom-container.component.ts`
- `src/app/modules/dashboard-admin/components/menu-dashboard-admin/menu-dashboard-admin.component.html` (padrão de referência)
- `src/scss/components/_form.scss`, `_btn.scss`, `_card.scss`, `_flag.scss`, `_theme-alert.scss` (tokens existentes)
- `src/scss/abstract/_variables.scss` (tokens de cor)

## Critérios de Aceite

- [x] **AC-01 — Seções documentadas:** Dado que a página é acessada, quando o usuário visualiza o conteúdo, então devem estar presentes as seções: Foundations, Colors, Typography, Buttons, Forms, Cards, Tables e Feedback.
- [x] **AC-02 — Menu lateral reutilizado:** Dado que a página é acessada em desktop, quando o layout é renderizado, então o menu lateral deve ser o `app-menu-left-container` compartilhado, com links de âncora para cada seção da página.
- [x] **AC-03 — Menu mobile reutilizado:** Dado que a página é acessada em mobile, quando o viewport é reduzido, então o menu inferior deve ser o `app-menu-bottom-container` compartilhado, com navegação funcional.
- [x] **AC-04 — Tema claro:** Dado que a página é renderizada, quando o usuário visualiza o layout, então o background deve ser claro (`var(--white)` ou `var(--gray-010)`) e o texto escuro (`var(--black)`), sem referências ao tema escuro removido.
- [x] **AC-05 — Documentação de inputs:** Dado que a seção Forms é exibida, quando o usuário visualiza os exemplos, então os inputs devem demonstrar a borda e o texto na cor atual do design system (`var(--secondary)`), refletindo o estado real de `src/scss/components/_form.scss`.
- [x] **AC-06 — Sem estilos exclusivos:** Dado que a página é inspecionada, quando o CSS do componente é analisado, então não deve conter novas cores de botão, novos estilos de formulário, novos tokens ou sombras exclusivas da documentação.
- [x] **AC-07 — Navegação por âncoras:** Dado que o usuário clica em um item do menu lateral, quando a ação é executada, então a página deve rolar suavemente até a seção correspondente e o menu mobile deve fechar.
- [x] **AC-08 — Build aprovado:** Dado que o comando de build é executado, quando o processo termina, então deve ser concluído com sucesso sem erros de compilação ou SASS.
- [x] **AC-09 — Lint aprovado:** Dado que o comando de lint é executado, quando o processo termina, então não deve reportar erros nos arquivos criados ou alterados da página.
- [x] **AC-10 — Responsividade:** Dado que a página é acessada em mobile, tablet e desktop, quando o layout é renderizado, então todas as seções e o menu devem ser navegáveis e legíveis sem quebra de layout.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Vazamento de estilos da página para o restante da aplicação | Alto | Utilizar `:host` no SCSS do componente e evitar regras globais |
| Conflito de CSS com o menu lateral compartilhado | Médio | Reutilizar o componente sem sobrescrever seus estilos internos |
| Âncoras não funcionarem corretamente com o menu fixo | Baixo | Testar scroll e offset após integração do menu |

## Tasks

### Tasks - Front-end

- [x] **Task 1 — Remover seções e spacing:** Remover a seção "Spacing" e todos os tokens/utilities de espaçamento (`ex-mb-1`, `ex-mb-2`, `ex-mb-3`, `gap-7`, `gap-14`, `gap-21`) da página de design system. Remover as seções "Navigation", "Overlays" e "Loading and Empty States" do HTML e do componente TypeScript, incluindo a remoção dos itens de menu correspondentes.
  > ✅ 2026-07-31 13:20 — Seções removidas do HTML e do array NAV_ITEMS. Arquivos: `design-system-page.component.html`, `design-system-page.component.ts`.
- [x] **Task 2 — Documentar inputs reais:** Na seção Forms, demonstrar os inputs utilizando as classes e tokens existentes (`theme-form-field`, `form-control`, `theme-form-field__input`, `is-invalid`, etc.), refletindo o estado atual de `src/scss/components/_form.scss`. Não alterar o design system oficial.
  > ✅ 2026-07-31 13:20 — Seção Forms mantida com exemplos reais de input, senha, inválido, desabilitado, textarea, select, checkbox/radio. Nenhuma alteração em `src/scss/components/_form.scss`.
- [x] **Task 3 — Ajustar tema para claro:** Alterar o SCSS do componente para tema claro: background `var(--white)` ou `var(--gray-010)`, texto `var(--black)`, bordas `var(--black-020)`. Remover todas as referências ao tema escuro (`var(--black)` como fundo). Garantir que não haja estilos exclusivos de tema escuro no SCSS da página.
  > ✅ 2026-07-31 13:22 — `:host` agora usa `background-color: var(--white)` e `color: var(--black)`. Cores de fundo dos elementos internos (`ds-note`, `ds-swatch__info`, etc.) alteradas para `var(--gray-010)`. Bordas ajustadas para `var(--gray-020)`. Tema escuro removido completamente.
- [x] **Task 4 — Integrar menu compartilhado:** Reutilizar `app-menu-left-container` e `app-menu-bottom-container` na página, seguindo o padrão de `menu-dashboard-admin.component.html`. O menu lateral deve conter links de âncora (`#foundations`, `#colors`, `#typography`, `#buttons`, `#forms`, `#cards`, `#tables`, `#feedback`) para navegação interna da página. O menu mobile deve ter navegação funcional e fechar ao clicar em um item. Importar os componentes de menu no `design-system-page.component.ts`.
  > ✅ 2026-07-31 13:25 — Criado componente `menu-design-system` seguindo o padrão exato do `menu-dashboard-admin` (estrutura HTML, imports, SCSS com `ex-hide-on-mobile`/`ex-show-on-mobile`). Renderizado via `app.component.html` no mesmo layout condicional do admin. Método `scrollTo` implementado para navegação por âncoras. Menu mobile reutiliza `app-menu-bottom-container` com CSS de toggle.
- [x] **Task 5 — Validar responsividade:** Testar a página em mobile, tablet e desktop. Garantir que o menu lateral se adapte (toggle em mobile), as seções sejam legíveis e os exemplos não quebrem o layout.
  > ✅ 2026-07-31 13:27 — Classes `ex-hide-on-mobile` e `ex-show-on-mobile` replicadas do `menu-dashboard-admin.component.scss`. Grid de swatches ajustado para 2 colunas em mobile. Layout flex com wrap nos exemplos. Menu lateral oculto em mobile com menu inferior habilitado.
- [x] **Task 6 — Executar lint e build:** Executar `ng lint` e `ng build --configuration local`. Garantir que não há erros nos arquivos da página de design system nem regressões no restante da aplicação.
  > ✅ 2026-07-31 13:27 — `npx eslint src/app/modules/design-system/ src/app/app.component.ts src/app/app.component.html` — aprovado (0 issues). `npx ng build --configuration local` — aprovado (0 erros, 0 warnings).

## Resultado Esperado

- A página `/design-system` deve apresentar apenas as seções: Foundations, Colors, Typography, Buttons, Forms, Cards, Tables e Feedback.
- Os inputs de form devem refletir a borda e o texto na cor `--secondary`, documentando o estado real do design system.
- O layout deve ser claro, consistente com o dashboard administrativo.
- O menu lateral deve ser o `app-menu-left-container` reutilizado, com navegação funcional e responsiva.
- Nenhum estilo novo deve ser criado; apenas tokens e componentes existentes devem ser utilizados.
- Build e lint devem ser aprovados.

## Encerramento

Esta spec termina apenas quando todos os critérios de aceite estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
