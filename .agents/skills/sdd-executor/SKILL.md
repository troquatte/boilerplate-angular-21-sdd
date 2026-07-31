---
name: sdd-executor
description: Executa especificações de software passo a passo conforme o processo de Spec Driven Development (SDD), mantendo rastreabilidade, escopo e evidências de implementação.
---

---

# Executor de Especificações SDD

Use esta skill quando o usuário solicitar a execução de uma especificação localizada no workspace, normalmente em `.spec/changes/`.

## 1. Leitura e compreensão da especificação

Antes de alterar qualquer arquivo:

1. Leia integralmente o arquivo de especificação solicitado.
2. Identifique:
   - objetivo;
   - contexto técnico;
   - requisitos funcionais e não funcionais;
   - estrutura do projeto;
   - arquivos envolvidos;
   - restrições;
   - critérios de aceite;
   - tarefas e dependências.

3. Consulte instruções locais do projeto, como:
   - `AGENTS.md`;
   - `README.md`;
   - arquivos de configuração;
   - convenções existentes no código.

4. Inspecione os arquivos relacionados antes de propor ou implementar mudanças.

Não inicie a implementação com base apenas no título ou em trechos isolados da spec.

## 2. Respeito ao escopo

Implemente somente o necessário para cumprir a especificação.

Não realize sem autorização:

- refatorações amplas;
- mudanças arquiteturais não previstas;
- atualizações de dependências;
- alterações de formatação em arquivos não relacionados;
- correções paralelas fora do escopo;
- remoção de código aparentemente não utilizado;
- mudanças em contratos públicos não descritas na spec.

Caso seja identificado um problema fora do escopo, registre-o separadamente sem modificá-lo.

## 3. Execução sequencial das tarefas

Execute as tarefas na ordem apresentada na seção `Tasks`.

- Não remova, reescreva ou altere a descrição original das tarefas.
- Não marque tarefas como concluídas antes da implementação correspondente.
- Somente altere a ordem quando existir uma dependência técnica inevitável.
- Quando uma tarefa precisar ser executada fora de ordem, registre a justificativa na evidência.
- Prossiga com tarefas independentes quando outra estiver aguardando validação do usuário.
- Não prossiga quando isso puder gerar implementação incorreta ou perda de dados.

## 4. Ambiguidades e conflitos

Quando houver ambiguidade:

1. Analise o código existente, os critérios de aceite e as convenções do projeto.
2. Prefira a interpretação que:
   - cause menor impacto;
   - preserve compatibilidade;
   - mantenha o escopo da spec;
   - siga os padrões já utilizados no projeto.

3. Registre a decisão tomada na evidência.

Solicite esclarecimento somente quando a decisão puder alterar significativamente:

- comportamento funcional;
- arquitetura;
- contrato de API;
- banco de dados;
- segurança;
- compatibilidade;
- dados existentes.

Em caso de conflito, siga esta prioridade:

1. instrução explícita atual do usuário;
2. especificação alvo;
3. instruções locais do projeto;
4. padrões existentes no código;
5. boas práticas gerais.

Registre qualquer conflito e a decisão adotada.

## 5. Execução de comandos

O agente pode executar comandos leves e de inspeção, como:

- listar arquivos e diretórios;
- ler arquivos;
- pesquisar referências no código;
- verificar diferenças com `git diff`;
- verificar estado com `git status`;
- executar verificações estáticas pontuais e rápidas, quando claramente seguras.

Não execute automaticamente comandos pesados, destrutivos ou com efeitos externos, incluindo:

- `npm install`;
- `pnpm install`;
- `yarn install`;
- builds completos;
- suítes completas de testes;
- testes end-to-end;
- migrações de banco;
- geração ou aplicação de migrations;
- deploys;
- publicação de pacotes;
- alterações em infraestrutura;
- comandos que modifiquem dados;
- comandos que dependam de credenciais;
- comandos potencialmente destrutivos.

Nesses casos:

1. forneça ao usuário o comando exato;
2. explique brevemente o que o comando valida ou altera;
3. prossiga com tarefas independentes;
4. não invente nem presuma o resultado do comando;
5. mantenha a tarefa como pendente de validação quando o resultado for necessário para considerá-la concluída.

Agrupe comandos de validação em pontos lógicos, como:

- conclusão do backend;
- conclusão do frontend;
- conclusão de uma integração;
- final da implementação.

## 6. Status das tarefas

Utilize os seguintes estados:

- `[ ]`: tarefa ainda não iniciada ou pendente;
- `[~]`: implementação realizada, mas aguardando validação;
- `[x]`: tarefa implementada e validada;
- `[!]`: tarefa bloqueada.

Não marque uma tarefa como `[x]` quando:

- ainda existir implementação pendente;
- algum critério de aceite não tiver sido atendido;
- sua conclusão depender de um comando ainda não executado;
- houver erro conhecido relacionado à tarefa;
- a validação tiver falhado.

## 7. Registro de evidências

Adicione a evidência imediatamente abaixo da tarefa correspondente.

### Tarefa concluída

```markdown
- [x] Descrição original da tarefa
  > ✅ YYYY-MM-DD HH:MM — Implementação concluída e validada. Arquivos alterados: `arquivo-a.ts`, `arquivo-b.ts`. Validações: [descreva as verificações realizadas]. Decisões ou desvios: [informe quando aplicável].
```

### Aguardando validação

```markdown
- [~] Descrição original da tarefa
  > 🧪 YYYY-MM-DD HH:MM — Implementação realizada. Arquivos alterados: `arquivo-a.ts`. Aguardando execução de: `comando`. Resultado ainda não confirmado.
```

### Tarefa bloqueada

```markdown
- [!] Descrição original da tarefa
  > ⛔ YYYY-MM-DD HH:MM — Tarefa bloqueada porque [motivo objetivo]. Para continuar é necessário [ação ou informação].
```

Use a data e hora local atual no formato `YYYY-MM-DD HH:MM`.

A evidência deve ser objetiva e verdadeira. Não declare que:

- testes passaram sem terem sido executados;
- o build foi concluído sem confirmação;
- uma integração funciona sem validação;
- critérios de aceite foram cumpridos sem evidência.

## 8. Validação

Sempre que possível, valide a implementação por meio de:

- análise dos arquivos alterados;
- inspeção de tipos e contratos;
- pesquisa de referências;
- verificação de imports;
- comparação com padrões existentes;
- `git diff`;
- testes pontuais seguros;
- critérios de aceite definidos na spec.

Ao solicitar uma validação ao usuário, informe:

1. o comando;
2. o diretório em que deve ser executado;
3. o resultado esperado;
4. quais tarefas dependem desse resultado.

Após o usuário fornecer o resultado, atualize o status e a evidência das tarefas afetadas.

## 9. Alteração do arquivo de especificação

Ao atualizar a spec:

- preserve o conteúdo original das tarefas;
- altere apenas o checkbox e acrescente a evidência;
- não remova evidências anteriores;
- não duplique evidências idênticas;
- mantenha a formatação existente;
- não marque tarefas não executadas;
- registre desvios relevantes de implementação.

## 10. Critério de conclusão da spec

Uma spec somente será considerada concluída quando:

- todas as tarefas estiverem marcadas como `[x]`;
- todas possuírem evidência;
- todos os critérios de aceite tiverem sido atendidos;
- não houver validações obrigatórias pendentes;
- não houver bloqueios conhecidos;
- os resultados informados pelo usuário tiverem sido registrados quando a validação depender dele.

Ao finalizar, apresente um resumo contendo:

- tarefas concluídas;
- arquivos principais alterados;
- decisões técnicas relevantes;
- validações realizadas;
- comandos executados pelo usuário;
- riscos ou pendências restantes.

Não declare a spec como concluída caso exista qualquer tarefa `[ ]`, `[~]` ou `[!]`.
