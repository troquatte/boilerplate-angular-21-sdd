---
name: sdd-delivery-closer
description: Encerra especificações SDD concluídas, revisa evidências e critérios de aceite, arquiva a spec e sincroniza a memória permanente do projeto.
---

---

# Encerramento e Entrega de Specs SDD

Use esta skill quando todas as tarefas de uma especificação tiverem sido implementadas e validadas, ou quando o usuário solicitar o encerramento formal de uma entrega de software.

Esta skill encerra e documenta uma entrega existente.

Não utilize esta skill para:

- implementar funcionalidades pendentes;
- corrigir problemas encontrados durante a revisão;
- alterar o escopo da spec;
- adicionar novos requisitos;
- realizar refatorações;
- criar commits, tags, releases ou deploys sem solicitação explícita.

Caso sejam encontradas pendências, interrompa o fechamento e reporte-as.

## 1. Localizar e ler a especificação

Leia integralmente a spec que será encerrada.

Confirme que ela está localizada em:

```text
.spec/changes/
```

Identifique:

- objetivo;
- escopo;
- fora de escopo;
- critérios de aceite;
- tarefas;
- evidências;
- validações realizadas;
- decisões técnicas;
- riscos e pendências registradas.

Não arquive a spec com base apenas no nome do arquivo ou no estado visual dos checkboxes.

## 2. Revisar o estado das tarefas

Confirme que todas as tarefas estão marcadas como concluídas:

```markdown
[x]
```

Nenhuma tarefa pode permanecer nos estados:

```markdown
[ ]
[~]
[!]
```

Cada tarefa concluída deve possuir imediatamente abaixo uma evidência contendo:

- data e hora;
- descrição objetiva do que foi realizado;
- arquivos alterados, quando aplicável;
- validações executadas;
- desvios ou decisões relevantes.

Exemplo:

```markdown
- [x] Criar endpoint de cadastro de clientes.
  > ✅ 2026-07-17 14:30 — Endpoint `POST /customers` implementado e validado. Arquivos alterados: `customers.controller.ts` e `customers.routes.ts`. Testes de integração executados com sucesso.
```

Não considere válida uma evidência que apenas afirme:

- “feito”;
- “concluído”;
- “implementado”;
- “funcionando”;

sem indicar o que foi alterado ou como foi validado.

## 3. Revisar critérios de aceite

Confirme que todos os critérios de aceite foram atendidos.

A existência de todas as tarefas marcadas como `[x]` não é suficiente caso algum comportamento esperado não tenha sido validado.

Para cada critério de aceite, verifique se existe pelo menos uma das seguintes evidências:

- teste automatizado;
- validação manual registrada;
- inspeção objetiva do código;
- resultado de comando fornecido pelo usuário;
- evidência registrada em uma ou mais tarefas.

Caso um critério não tenha sido comprovado, não encerre a spec.

Registre quais critérios ainda precisam de validação.

## 4. Revisar validações obrigatórias

Verifique se ainda existem comandos ou validações pendentes, como:

- instalação de dependências;
- lint;
- typecheck;
- testes unitários;
- testes de integração;
- testes end-to-end;
- build;
- migrations;
- validação manual;
- validação de integração externa.

Não presuma que um comando passou.

Quando a validação tiver sido executada pelo usuário, utilize somente o resultado informado por ele.

Se algum comando obrigatório ainda estiver pendente:

1. não arquive a spec;
2. informe o comando exato;
3. informe o diretório de execução;
4. explique o resultado esperado;
5. identifique quais critérios ou tarefas dependem dele.

## 5. Revisar as alterações realizadas

Antes do arquivamento, inspecione as alterações relacionadas à entrega.

Utilize comandos leves e seguros, quando disponíveis, como:

```bash
git status
git diff
git diff --stat
```

Verifique se:

- os arquivos alterados correspondem ao escopo da spec;
- não existem alterações acidentais;
- não existem arquivos temporários;
- não existem logs ou dados sensíveis;
- não existem credenciais;
- não existem alterações fora do escopo;
- não existem placeholders;
- não existem comentários temporários;
- não existem conflitos não resolvidos;
- não existem arquivos gerados que não deveriam ser versionados.

Não reverta ou corrija automaticamente problemas encontrados durante o fechamento.

Reporte-os e mantenha a spec ativa até que sejam resolvidos.

## 6. Verificar consistência entre spec e implementação

Compare a solução final com o que foi especificado.

Confirme:

- quais partes foram implementadas conforme o planejado;
- quais partes sofreram desvios;
- se os desvios estão registrados nas evidências;
- se houve impacto em contratos;
- se houve alteração permanente na arquitetura;
- se surgiram novas regras de negócio;
- se a estrutura do repositório foi alterada;
- se alguma decisão precisa ser preservada na memória do projeto.

Pequenos ajustes de implementação que não alterem comportamento não exigem atualização da spec.

Desvios que alterem comportamento, escopo ou arquitetura devem estar explicitamente documentados antes do fechamento.

## 7. Sincronizar a memória do projeto

Atualize a pasta `memory/` somente quando a entrega introduzir mudanças permanentes e relevantes para implementações futuras.

Não copie toda a spec para a memória.

Não registre na memória:

- detalhes temporários;
- progresso de tarefas;
- evidências de execução;
- comandos utilizados;
- correções pontuais;
- nomes de arquivos sem relevância arquitetural;
- decisões específicas que não se repetirão;
- informações já documentadas.

### 7.1 Produto e regras de negócio

Atualize:

```text
memory/produto.md
```

somente quando houver:

- nova capacidade central do produto;
- nova regra de negócio permanente;
- alteração relevante de comportamento;
- novo ator ou persona;
- novo termo de domínio;
- mudança na linguagem utilizada pelo time;
- nova restrição funcional importante.

Mantenha os termos consistentes com o código e com as demais specs.

### 7.2 Contexto técnico

Atualize:

```text
memory/contexto-tecnico.md
```

somente quando houver:

- mudança de arquitetura;
- nova integração permanente;
- adoção de tecnologia central;
- alteração no mecanismo de autenticação;
- mudança no banco de dados;
- novo padrão de comunicação;
- nova estratégia de observabilidade;
- alteração relevante em infraestrutura;
- nova convenção técnica transversal.

Não registre dependências utilizadas apenas localmente por uma funcionalidade, salvo quando afetarem decisões futuras do projeto.

### 7.3 Estrutura do repositório

Atualize:

```text
memory/estrutura.md
```

somente quando houver:

- novo diretório estrutural;
- novo módulo principal;
- mudança de responsabilidade entre pastas;
- nova convenção de organização;
- nova estratégia de compartilhamento;
- alteração no local padrão de arquivos;
- mudança na estrutura esperada para futuras funcionalidades.

Não atualize esse arquivo apenas porque um novo componente, controller ou arquivo isolado foi criado.

### 7.4 Registro de Lançamentos (Changelog)

Sempre atualize o arquivo:

```text
memory/changelog.md
```

adicionando uma linha no final da tabela contendo:
- O número identificador da Spec (ex: `001`);
- A data atual de conclusão (no formato `YYYY-MM-DD`);
- O título simplificado da mudança;
- O autor/responsável (ex: `Antigravity` ou o nome do desenvolvedor que operou).

### 7.5 Outros documentos

Caso o projeto possua outros arquivos permanentes de documentação, atualize-os somente quando estiverem diretamente relacionados à mudança.

Exemplos:

- ADRs;
- documentação de API;
- diagramas arquiteturais;
- guias de contribuição;
- documentação de configuração;
- documentação operacional.

Não crie novos documentos permanentes sem necessidade clara.

## 8. Regras para alteração da memória

Ao alterar arquivos em `memory/`:

- preserve a estrutura existente;
- faça mudanças pontuais;
- evite reescrever o documento inteiro;
- não remova informações válidas;
- não duplique conteúdo;
- atualize informações que se tornaram obsoletas;
- mantenha consistência de termos;
- não registre suposições como fatos;
- baseie a atualização na implementação final;
- registre apenas o estado atual do projeto.

A memória deve representar como o sistema funciona após a entrega, e não narrar o histórico da implementação.

### Exemplo inadequado

```markdown
Na task 4 foi criado o controller e depois corrigimos o DTO.
```

### Exemplo adequado

```markdown
O módulo de clientes expõe operações HTTP por meio de controllers responsáveis apenas por validação de entrada e delegação aos casos de uso.
```

## 9. Divergência entre memória e implementação

Caso a memória existente esteja divergente do código:

1. determine se a divergência foi causada pela entrega atual;
2. utilize a implementação validada como referência;
3. atualize apenas o conteúdo relacionado à entrega;
4. não corrija divergências não relacionadas sem autorização;
5. registre as divergências externas como pendências.

Não altere a memória para descrever um comportamento que ainda não esteja implementado.

## 10. Registrar a sincronização na spec

Antes de arquivar, adicione uma seção final à spec, caso ainda não exista:

```markdown
## Encerramento
```

Utilize o seguinte formato:

```markdown
## Encerramento

> ✅ YYYY-MM-DD HH:MM — Spec revisada, validada e encerrada.

### Validações finais

- `npm run lint`: executado com sucesso.
- `npm run test`: executado com sucesso.
- `npm run build`: executado com sucesso.

### Memória atualizada

- `memory/produto.md`: adicionada a capacidade de cadastro de clientes.
- `memory/contexto-tecnico.md`: nenhuma alteração necessária.
- `memory/estrutura.md`: documentado o novo módulo `customers`.

### Observações

- Nenhuma pendência conhecida.
```

Quando um arquivo de memória não precisar de alteração, registre explicitamente:

```markdown
- `memory/contexto-tecnico.md`: nenhuma alteração necessária.
```

Não invente resultados de validação.

## 11. Arquivar a especificação

Após confirmar que a entrega está totalmente concluída:

1. verifique se o diretório existe:

```text
.spec/changes/archive/
```

2. crie o diretório caso ele não exista;
3. mova a spec de:

```text
.spec/changes/NNN-nome-da-spec.md
```

para:

```text
.spec/changes/archive/NNN-nome-da-spec.md
```

Preserve o nome original do arquivo.

Não:

- renumere a spec;
- altere seu identificador;
- crie uma cópia mantendo o original ativo;
- remova evidências;
- compacte ou resuma o conteúdo;
- sobrescreva uma spec arquivada existente.

Caso já exista um arquivo com o mesmo nome no diretório de arquivo, interrompa o fechamento e reporte o conflito.

## 12. Verificação após o arquivamento

Depois de mover o arquivo, confirme que:

- a spec não permanece em `.spec/changes/`;
- a spec existe em `.spec/changes/archive/`;
- o conteúdo foi preservado;
- a seção de encerramento está presente;
- as alterações de memória foram salvas;
- não foram alterados arquivos fora do fechamento;
- não surgiram novos problemas no estado do repositório.

Utilize novamente, quando disponível:

```bash
git status
git diff --stat
```

## 13. Operações não autorizadas automaticamente

O encerramento de uma spec não autoriza automaticamente:

- `git add`;
- `git commit`;
- `git push`;
- criação de branch;
- merge;
- pull request;
- tag;
- release;
- publicação de pacote;
- deploy;
- execução de migrations;
- alteração de ambientes;
- envio de notificações.

Realize essas operações somente mediante solicitação explícita do usuário.

Caso seja útil, forneça os comandos sugeridos sem executá-los.

## 14. Critério de encerramento

Uma spec somente pode ser encerrada quando:

- todas as tarefas estiverem marcadas como `[x]`;
- todas as tarefas possuírem evidência válida;
- todos os critérios de aceite tiverem sido atendidos;
- todas as validações obrigatórias tiverem sido concluídas;
- não houver tarefas pendentes, aguardando ou bloqueadas;
- não houver erros conhecidos relacionados ao escopo;
- desvios relevantes estiverem documentados;
- a memória permanente tiver sido revisada;
- a seção de encerramento tiver sido adicionada;
- o arquivo tiver sido movido para `archive/`;
- o arquivamento tiver sido verificado.

Se qualquer uma dessas condições não for atendida, mantenha a spec em `.spec/changes/`.

## 15. Resumo final da entrega

Após o encerramento, apresente um resumo contendo:

- nome da spec encerrada;
- caminho final do arquivo arquivado;
- objetivo entregue;
- principais arquivos ou módulos alterados;
- critérios de aceite validados;
- validações executadas;
- documentos de memória atualizados;
- decisões técnicas relevantes;
- desvios registrados;
- riscos ou pendências restantes.

Caso não existam pendências, declare:

```text
Nenhuma pendência conhecida dentro do escopo da spec.
```

Não declare que a entrega está pronta para produção, publicada ou implantada, a menos que essas etapas tenham sido efetivamente realizadas e confirmadas.
