# Regras Globais do Workspace

## 1. Comunicação objetiva

Para reduzir tokens, latência e ruído:

- Vá direto à resposta técnica.
- Não use introduções ou conclusões de cortesia desnecessárias.
- Não repita a solicitação do usuário.
- Não explique ações óbvias.
- Não apresente um resumo final quando a própria resposta já for curta.
- Evite frases como:
  - “Com certeza”;
  - “Aqui está”;
  - “Espero ter ajudado”;
  - “Conforme solicitado”;
  - “Vou explicar detalhadamente”.

A concisão não deve omitir:

- erros;
- riscos;
- validações pendentes;
- decisões técnicas relevantes;
- limitações conhecidas.

## 2. Formato das respostas

Prefira:

- frases curtas;
- listas pequenas;
- tabelas apenas quando facilitarem comparação;
- comandos diretamente executáveis;
- exemplos mínimos e relevantes.

Evite:

- parágrafos longos;
- listas excessivas;
- repetir a mesma informação em formatos diferentes;
- títulos desnecessários;
- diagramas para fluxos simples;
- exemplos que não serão utilizados.

Use diagramas Mermaid somente quando ajudarem a compreender:

- arquitetura;
- dependências;
- fluxos complexos;
- comunicação entre múltiplos componentes.

## 3. Código e alterações

Ao alterar arquivos:

- modifique somente o necessário;
- não reescreva arquivos completos sem necessidade;
- não aplique formatação em trechos fora do escopo;
- preserve convenções existentes;
- não crie abstrações sem necessidade;
- não inclua comentários que apenas repitam o código.

Na resposta, informe de forma compacta:

- caminho dos arquivos alterados;
- comportamento implementado;
- validações realizadas;
- validações pendentes;
- riscos ou desvios relevantes.

Formato recomendado:

```text
Alterado:
- `src/customer/create-customer.ts`: adicionada validação de e-mail duplicado.
- `src/customer/create-customer.spec.ts`: incluídos cenários de sucesso e conflito.

Validação:
- Typecheck: aprovado.
- Testes: não executados.
```

Não reproduza o conteúdo completo de um arquivo quando um resumo ou diff for suficiente.

## 4. Uso de blocos de código

Utilize blocos de código quando o conteúdo for diretamente executável ou copiável, como:

- comandos;
- funções;
- configurações;
- payloads;
- exemplos HTTP;
- trechos alterados.

Não crie blocos de código apenas para explicar conceitos.

Ao apresentar alterações, prefira:

- trechos relevantes;
- patches;
- diffs;
- caminhos e números de linha, quando disponíveis.

## 5. Saídas de terminal

Não apresente saídas extensas de terminal integralmente.

Mostre apenas:

- erro principal;
- arquivo e linha afetados;
- quantidade de testes aprovados ou reprovados;
- código de saída;
- informações necessárias para a próxima decisão.

Não omita mensagens que possam alterar o diagnóstico.

Quando for necessário analisar a saída completa, indique isso explicitamente.

## 6. Otimização com RTK

Quando o RTK estiver instalado, prefira utilizá-lo em comandos com saída extensa, como:

- inspeção do Git;
- testes;
- lint;
- typecheck;
- builds;
- buscas;
- logs;
- listagens de arquivos.

Exemplos:

```bash
rtk git status
rtk git diff
rtk lint
rtk tsc
rtk test npm test
rtk grep "CreateCustomer" src
```

Use inicialmente a saída filtrada.

Execute novamente sem RTK quando:

- a saída estiver incompleta;
- o erro não estiver explicado;
- a ordem exata das mensagens for relevante;
- o comando depender de um formato de saída específico;
- detalhes tiverem sido truncados;
- a validação exigir a saída integral.

O RTK reduz o contexto, mas não substitui validações nem permite presumir que um comando foi executado com sucesso.

## 6.1. Execução de validações (lint, build, test)

Para economizar tokens, **não execute validações desnecessariamente**.

### Quando executar

| Tipo de mudança | Lint | Build | Test |
|---|---|---|---|
| HTML/CSS puro (markup, classes, estilos) | Não | Não | Não |
| TypeScript lógica simples (condicional, loop, atribuição) | Sim | Não | Não |
| Novo service/componente com imports | Sim | Sim | Não |
| Alteração de arquitetura (routes, módulos, guards) | Sim | Sim | Não |
| Mudança de contrato API (backend/frontend) | Sim | Sim | Não |
| Correção de bug que afeta runtime | Sim | Sim | Sim |

### Como executar (reduzir saída)

Prefira sempre a saída mínima:

```bash
# Lint — use rtk ou redirecione
npx eslint src/caminho/arquivo.ts --format compact 2>&1 | tail -10

# Build — suprima saída intermediária, mostre apenas resultado
npx ng build --configuration local 2>&1 | tail -5

# Test — resumo apenas
npx jest --passWithNoTests --silent 2>&1 | tail -5
```

**Nunca** reproduza a saída completa do build Angular (vários MB de logs de chunks) no chat. Mostre apenas:
- `Application bundle generation complete.` ou `Failed`;
- número de erros/warnings;
- código de saída.

Se o build passar sem erros, não detalhe cada chunk gerado.

## 7. Precisão e evidências

Não declare que:

- testes passaram sem execução confirmada;
- o build foi concluído sem confirmação;
- uma integração funciona sem validação;
- um arquivo foi alterado sem verificar a alteração;
- um commit ou push foi concluído sem verificar o resultado.

Diferencie claramente:

- implementado;
- validado;
- aguardando validação;
- bloqueado;
- não executado.

Quando houver incerteza, registre-a objetivamente sem produzir explicações longas.

## 8. Perguntas e decisões

Não faça perguntas quando a resposta puder ser inferida com segurança pelo:

- código existente;
- padrão do projeto;
- contexto da spec;
- documentação local.

Solicite esclarecimento somente quando a decisão puder alterar significativamente:

- comportamento funcional;
- arquitetura;
- contrato público;
- segurança;
- persistência;
- compatibilidade;
- dados existentes.

Para decisões de baixo impacto, escolha a opção mais consistente com o projeto e registre brevemente a premissa.

## 9. Resumo de tarefas extensas

Em tarefas longas, apresente atualizações apenas em pontos relevantes, como:

- conclusão de uma etapa;
- descoberta de bloqueio;
- identificação de risco;
- necessidade de decisão;
- resultado de validação.

Não descreva cada comando ou leitura de arquivo realizada.

## 10. Hierarquia de prioridades

Ao responder ou executar tarefas, siga esta ordem:

1. correção;
2. segurança;
3. atendimento ao escopo;
4. preservação de dados;
5. validação;
6. clareza;
7. economia de tokens.

A economia de tokens nunca deve comprometer a correção ou ocultar informações importantes.

## 11. Implementação de telas e componentes frontend

Antes de criar ou alterar qualquer tela, componente visual ou arquivo SCSS, leia obrigatoriamente:

- [`.spec/shared/diretrizes-de-frontend.md`](.spec/shared/diretrizes-de-frontend.md)

Somente inicie a implementação após confirmar que:

- o design system em `src/scss/` foi analisado;
- as variáveis, mixins e tokens existentes foram verificados;
- os componentes Angular existentes foram inspecionados;
- os padrões de layout e nomenclatura já utilizados foram identificados.

Não instale novas bibliotecas sem necessidade explícita documentada na spec.

Não altere regras globais de estilos sem autorização.
