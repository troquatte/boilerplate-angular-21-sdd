# Ajustes no Design System e Documentação de Código

## Objetivo

Ajustar os tokens visuais do design system oficial (formulários e cards) e enriquecer a página de documentação `/design-system` com blocos de código exemplificando o uso correto dos componentes.

## Contexto Técnico

Stack local: Angular v21 + SSR, SCSS com SMACSS, tokens CSS customizados. A página de design system já existe em `/design-system` e documenta visualmente os componentes. Os arquivos do design system oficial estão em `src/scss/components/`. Esta mudança altera o design system oficial para refletir a identidade visual desejada (cor secundária nos inputs e labels) e expande a documentação com exemplos de código copiáveis.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)
- [Diretrizes de frontend](../shared/diretrizes-de-frontend.md)

## Escopo

- Alterar `src/scss/components/_form.scss` para que o texto e a borda dos inputs (`theme-form-field__input`) e labels (`theme-form-field__label`) utilizem a cor secundária (`var(--secondary)`).
- Alterar `src/scss/components/_card.scss` para criar a variante `.theme-card__white` (fundo branco, texto escuro) e modificar `.theme-card__black` para usar `var(--secondary)` como cor de fundo (em vez de `var(--black)`).
- Adicionar blocos de código (`<pre><code>`) nas seções Buttons, Forms, Cards, Tables e Feedback da página `/design-system`, mostrando o markup HTML real de uso de cada componente.
- Garantir que a página de design system reflita fielmente os estilos alterados.
- Validar lint e build.

## Fora de Escopo

- Alteração de outras propriedades dos inputs (placeholder, hover, focus, disabled, is-invalid) além da cor de texto e borda.
- Criação de novos tokens ou variáveis CSS.
- Alteração de outros componentes SCSS (botões, alerts, flags, tables) além dos cards e forms.
- Testes unitários.
- Alteração de guards, rotas ou autenticação.

## Premissas

- A cor secundária do projeto é `--secondary: #5a1226` (vinho escuro), que deve ser aplicada aos textos e bordas dos inputs e labels para reforçar a identidade visual.
- O restante do sistema utilizará tema claro; telas escuras (como autenticação) utilizam card branco como container, garantindo contraste adequado para texto e borda secondary.
- A variante `.theme-card__black` deve passar a usar a cor secundária (`--secondary: #5a1226`) para manter consistência com a paleta de produto.
- A nova variante `.theme-card__white` deve usar fundo branco (`--white`) e texto escuro (`--black`) para uso em fundos claros.
- A página de design system deve ser a única referência de código para desenvolvedores, portanto deve conter exemplos copiáveis.

## Restrições

- Não utilizar estilos inline nos blocos de código de exemplo (os exemplos devem ser puros HTML).
- Não criar novas classes ou tokens fora do padrão existente.
- Manter a compatibilidade visual dos inputs e cards já existentes nas telas de autenticação e dashboard.
- Usar `:root` para encapsulamento de estilos no SCSS do design system, conforme padrão atual.

## Dependências

- `src/scss/components/_form.scss` (estilos de inputs)
- `src/scss/components/_card.scss` (estilos de cards)
- `src/scss/abstract/_variables.scss` (tokens de cor)
- `src/app/modules/design-system/pages/design-system-page/design-system-page.component.html` (página de documentação)
- `src/app/modules/design-system/pages/design-system-page/design-system-page.component.scss` (estilos da página de documentação)

## Critérios de Aceite

- [x] **AC-01 — Inputs com cor secondary:** Dado que o usuário visualiza um input do design system, quando o estilo é aplicado, então o texto e a borda do input devem estar na cor `var(--secondary)`.
- [x] **AC-02 — Labels com cor secondary:** Dado que o usuário visualiza um label de formulário, quando o estilo é aplicado, então o texto do label deve estar na cor `var(--secondary)`.
- [x] **AC-03 — Card branco:** Dado que o usuário utiliza a classe `.theme-card__white`, quando o componente é renderizado, então o fundo deve ser `var(--white)` e o texto `var(--black)`.
- [x] **AC-04 — Card secondary:** Dado que o usuário utiliza a classe `.theme-card__black`, quando o componente é renderizado, então o fundo deve ser `var(--secondary)` (em vez de `var(--black)`).
- [x] **AC-05 — Exemplos de código Buttons:** Dado que o usuário acessa a seção Buttons, quando visualiza o conteúdo, então deve haver um bloco de código `<pre><code>` com o markup HTML de uso dos botões (`theme-btn`, `theme-btn__primary`, etc.).
- [x] **AC-06 — Exemplos de código Forms:** Dado que o usuário acessa a seção Forms, quando visualiza o conteúdo, então deve haver um bloco de código `<pre><code>` com o markup HTML de uso dos inputs (`theme-form-field`, `theme-form-field__input`, etc.).
- [x] **AC-07 — Exemplos de código Cards:** Dado que o usuário acessa a seção Cards, quando visualiza o conteúdo, então deve haver um bloco de código `<pre><code>` com o markup HTML de uso dos cards (`theme-card`, `theme-card__white`, `theme-card__black`).
- [x] **AC-08 — Exemplos de código Tables:** Dado que o usuário acessa a seção Tables, quando visualiza o conteúdo, então deve haver um bloco de código `<pre><code>` com o markup HTML de uso da tabela estrutural (`ds-table`).
- [x] **AC-09 — Exemplos de código Feedback:** Dado que o usuário acessa a seção Feedback, quando visualiza o conteúdo, então deve haver um bloco de código `<pre><code>` com o markup HTML de uso dos alerts (`theme-alert`) e flags (`theme-flag`).
- [x] **AC-10 — Build aprovado:** Dado que o comando de build é executado, quando o processo termina, então deve ser concluído com sucesso sem erros de compilação ou SASS.
- [x] **AC-11 — Lint aprovado:** Dado que o comando de lint é executado, quando o processo termina, então não deve reportar erros nos arquivos alterados.
- [x] **AC-12 — Compatibilidade visual:** Dado que as telas de autenticação e dashboard utilizam os mesmos componentes, quando os estilos são alterados, então não deve haver regressão visual quebrada (inputs legíveis, cards com contraste adequado).

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Cor secondary (#5a1226) em inputs pode ficar ilegível em fundos escuros (se houver) | Baixo | O sistema utiliza tema claro; telas de auth usam card branco como container, garantindo contraste |
| Estado `:hover` da borda do input pode ficar invisível com a nova cor base | Médio | Ajustar o `border-color` do `:hover` para um tom adequado da cor secondary (ex: `color-mix` com secondary) |
| Card branco com texto escuro pode conflitar com estilos filhos (botões, links) | Médio | Verificar que botões e links dentro do card branco mantenham visibilidade |
| Alteração de `.theme-card__black` para secondary pode afetar telas existentes | Médio | Buscar usos de `theme-card__black` no projeto e verificar impacto |

## Tasks

### Tasks - Front-end

- [x] **Task 1 — Ajustar cor secondary nos inputs e labels:** Alterar `src/scss/components/_form.scss` para aplicar `color: var(--secondary)` em `theme-form-field__label` e `theme-form-field__input.form-control`. Aplicar `border-color: var(--secondary)` no input. Ajustar o estado `:hover` da borda para usar um tom visível da cor secondary (ex: `color-mix(in srgb, var(--secondary) 70%, transparent)`). Manter os estados `:focus`, `:disabled` e `is-invalid` funcionais.
  > ✅ 2026-07-31 14:30 — `color: var(--secondary)` aplicado em label e input. `border-color: var(--secondary)` no input. Hover ajustado para `color-mix(in srgb, var(--secondary) 70%, transparent)`. Box-shadow removido do `:focus` e `is-invalid:focus` conforme melhoria solicitada. Arquivo: `src/scss/components/_form.scss`.
- [x] **Task 2 — Criar card branco e ajustar card black:** Alterar `src/scss/components/_card.scss` para criar a classe `.theme-card__white` com `background-color: var(--white)`, `color: var(--black)` e `border-radius: fn.rem-calc(7)`. Alterar `.theme-card__black` para usar `background-color: var(--secondary)` (em vez de `var(--black)`), mantendo `border-radius: fn.rem-calc(14)`.
  > ✅ 2026-07-31 14:30 — `.theme-card__white` criado com fundo branco e texto escuro. `.theme-card__black` alterado para `var(--secondary)`. Borda gray (`border: fn.rem-calc(1) solid var(--gray-020)`) adicionada ao card branco conforme melhoria solicitada. Arquivo: `src/scss/components/_card.scss`.
- [x] **Task 3 — Adicionar exemplos de código na seção Buttons:** Incluir bloco `<pre><code>` na seção Buttons da página de design system, mostrando o markup HTML dos botões (primary, secondary, danger, etc.).
  > ✅ 2026-07-31 14:30 — Bloco `<pre class="ds-code"><code>` adicionado com markup dos botões (primary, secondary, danger, danger-line, green, green-line) e loading state. Arquivo: `design-system-page.component.html`.
- [x] **Task 4 — Adicionar exemplos de código na seção Forms:** Incluir bloco `<pre><code>` na seção Forms da página de design system, mostrando o markup HTML de um input padrão com `theme-form-field`, `theme-form-field__label`, `theme-form-field__input`.
  > ✅ 2026-07-31 14:30 — Bloco `<pre class="ds-code"><code>` adicionado com markup de input padrão, senha, inválido, textarea e select. Arquivo: `design-system-page.component.html`.
- [x] **Task 5 — Adicionar exemplos de código na seção Cards:** Incluir bloco `<pre><code>` na seção Cards da página de design system, mostrando o markup HTML dos cards (padrão, `theme-card__white`, `theme-card__black`).
  > ✅ 2026-07-31 14:30 — Bloco `<pre class="ds-code"><code>` adicionado com markup dos 3 tipos de card (padrão, white, black/secondary). Arquivo: `design-system-page.component.html`.
- [x] **Task 6 — Adicionar exemplos de código na seção Tables:** Incluir bloco `<pre><code>` na seção Tables da página de design system, mostrando o markup HTML da tabela estrutural com `ds-table`.
  > ✅ 2026-07-31 14:30 — Bloco `<pre class="ds-code"><code>` adicionado com markup da tabela `ds-table`. Arquivo: `design-system-page.component.html`.
- [x] **Task 7 — Adicionar exemplos de código na seção Feedback:** Incluir bloco `<pre><code>` na seção Feedback da página de design system, mostrando o markup HTML dos alerts (`theme-alert__danger`, `theme-alert__success`) e flags (`theme-flag`, `theme-flag__white`, etc.).
  > ✅ 2026-07-31 14:30 — Bloco `<pre class="ds-code"><code>` adicionado com markup dos alerts (danger, success) e flags (default, white, purple, yellow). Borda gray adicionada ao `theme-flag__white` conforme melhoria solicitada. Arquivo: `design-system-page.component.html` e `src/scss/components/_flag.scss`.
- [x] **Task 8 — Atualizar cards na página de design system:** Atualizar a seção Cards da página de design system para demonstrar os 3 tipos: padrão (`theme-card`), branco (`theme-card__white`) e secondary (`theme-card__black`).
  > ✅ 2026-07-31 14:30 — Seção Cards atualizada para demonstrar 3 cards: padrão, branco e secondary (black). Arquivo: `design-system-page.component.html`.
- [x] **Task 9 — Atualizar descrições textuais na página de design system:** Revisar e ajustar os parágrafos descritivos da seção Cards na página `/design-system` para refletir as novas cores (ex: `theme-card__black` com fundo `var(--secondary)` em vez de `var(--black)`).
  > ✅ 2026-07-31 14:30 — Textos descritivos atualizados: "Card secondary" com fundo `var(--secondary)`, "Card branco" com fundo `var(--white)`. Arquivo: `design-system-page.component.html`.
- [x] **Task 10 — Executar lint e build:** Executar `npx eslint` e `npx ng build --configuration local`. Garantir que não há erros nos arquivos alterados.
  > ✅ 2026-07-31 14:31 — `npx eslint` aprovado (0 issues). `npx ng build --configuration local` aprovado (0 erros, 0 warnings).

## Resultado Esperado

- Os inputs do design system exibem texto e borda na cor secundária (`#5a1226`).
- Os labels de formulário exibem texto na cor secundária.
- O card branco (`theme-card__white`) está disponível com fundo branco e texto escuro.
- O card black (`theme-card__black`) utiliza a cor secundária (`#5a1226`) como fundo.
- A página `/design-system` contém blocos de código copiáveis em todas as seções visuais (Buttons, Forms, Cards, Tables, Feedback).
- Build e lint aprovados.

## Encerramento

> ✅ 2026-07-31 14:35 — Spec revisada, validada e encerrada.

### Validações finais

- `npx eslint`: aprovado (0 issues).
- `npx ng build --configuration local`: aprovado (0 erros, 0 warnings).

### Memória atualizada

- `memory/changelog.md`: adicionada entrada `010`.

### Observações

- Melhorias adicionais aplicadas durante a execução:
  - Borda gray (`border: fn.rem-calc(1) solid var(--gray-020)`) adicionada ao `theme-card__white` e `theme-flag__white`.
  - Box-shadow removido dos estados `:focus` e `is-invalid:focus` do input (`theme-form-field__input`).
- Nenhuma alteração de arquitetura ou regra de negócio permanente.
- Nenhum token CSS novo foi criado.
