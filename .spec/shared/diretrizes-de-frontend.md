# Diretrizes de Implementação de Frontend

Este documento deve ser lido e seguido por qualquer skill que implemente telas, componentes ou estilos no projeto.

## Antes de implementar

Analise obrigatoriamente:

1. a estrutura atual do projeto;
2. o conteúdo de `src/scss/` e os tokens, mixins e variáveis disponíveis;
3. os componentes Angular existentes em `src/app/`;
4. os padrões de layout e nomenclatura já utilizados.

Não inicie a implementação sem essa análise.

## Diretrizes de implementação

- Utilize a arquitetura **SMACSS** para organizar os estilos.
- Reaproveite variáveis, tokens, mixins, funções, tipografia, espaçamentos, cores e componentes já existentes no design system.
- Não crie estilos isolados ou valores fixos antes de verificar se já existe uma definição equivalente em `src/scss/`.
- Utilize **Bootstrap** como base principal para grid, responsividade, espaçamentos e estrutura das telas.
- Utilize **Angular Material** apenas quando seus componentes oferecerem uma vantagem real, como em:
  - dialogs;
  - menus;
  - tooltips;
  - snackbars;
  - datepickers;
  - selects complexos;
  - tabelas com recursos avançados;
  - componentes que exijam acessibilidade e comportamento prontos.

## Requisitos visuais

Crie interfaces modernas, limpas e consistentes com o restante da aplicação.

As telas devem:

- ser totalmente responsivas;
- funcionar corretamente em desktop, tablet e dispositivos móveis;
- manter consistência visual entre cores, fontes, bordas, sombras e espaçamentos;
- possuir hierarquia visual clara;
- apresentar estados de `loading`, vazio, erro, sucesso e desabilitado quando aplicável;
- utilizar feedback visual para ações do usuário;
- evitar excesso de elementos ou componentes desnecessários.

## Estrutura dos estilos

Organize os arquivos SCSS conforme o padrão SMACSS já adotado pelo projeto:

- `base`: estilos globais e elementos HTML;
- `layout`: estrutura das páginas e regiões principais;
- `module`: componentes reutilizáveis;
- `state`: estados e modificadores;
- `theme`: variações visuais e temas.

Evite colocar grandes blocos de estilos diretamente nos arquivos dos componentes quando eles puderem ser reutilizados ou pertencerem ao design system.

## Boas práticas

- Crie componentes reutilizáveis para padrões visuais recorrentes.
- Evite duplicação de HTML, lógica e SCSS.
- Utilize classes semânticas e nomes consistentes com o projeto.
- Preserve os componentes e comportamentos existentes.
- Não altere regras globais sem necessidade.
- Mantenha os componentes com responsabilidade bem definida.
- Garanta acessibilidade básica, incluindo `labels`, navegação por teclado, contraste e atributos ARIA quando necessários.
- Utilize ícones já disponíveis no projeto; caso não existam, prefira Angular Material Icons.
- Não instale novas bibliotecas sem necessidade.

## Relatório obrigatório após implementação

Informe ao final:

- quais arquivos foram criados;
- quais arquivos foram alterados;
- quais componentes reutilizáveis foram adicionados;
- quais decisões de UI ou arquitetura foram tomadas.
