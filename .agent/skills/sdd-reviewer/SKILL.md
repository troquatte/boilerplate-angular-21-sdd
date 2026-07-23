---
name: sdd-reviewer
description: Revisa especificações e implementações no fluxo SDD, verificando escopo, rastreabilidade, conformidade técnica, segurança, testes e evidências antes da execução ou do encerramento da entrega.
---

# Revisor de Especificações e Implementações SDD

Use esta skill quando o usuário solicitar:

* revisão de uma especificação antes da implementação;
* validação de uma implementação concluída;
* verificação de prontidão para encerramento da entrega;
* auditoria de segurança relacionada ao escopo da spec;
* verificação de testes e evidências;
* validação de conformidade com `AGENTS.md`;
* verificação das convenções técnicas e de nomenclatura do projeto.

O objetivo desta skill é atuar como uma barreira de qualidade no fluxo SDD.

Fluxo recomendado:

```text
sdd-spec-generator
        ↓
sdd-reviewer — modo spec
        ↓
sdd-executor
        ↓
sdd-reviewer — modo implementation
        ↓
sdd-delivery-closer
        ↓
git-delivery
```

A revisão deve identificar problemas, riscos e pendências sem implementar, corrigir ou encerrar a entrega automaticamente.

## 1. Modos de revisão

A skill possui dois modos de operação.

### Modo `spec`

Utilize para revisar uma especificação antes do início da implementação.

Neste modo, avalie:

* clareza do problema;
* objetivo;
* escopo;
* critérios de aceite;
* solução proposta;
* tarefas;
* dependências;
* testes planejados;
* riscos;
* segurança;
* alinhamento com o projeto.

Não exija evidências de execução, arquivos implementados ou resultados de testes nesse modo.

### Modo `implementation`

Utilize para revisar a implementação antes do encerramento da entrega.

Neste modo, avalie:

* correspondência entre spec e código;
* critérios de aceite implementados;
* tarefas e evidências;
* arquivos alterados;
* testes existentes;
* resultados de validação;
* segurança;
* conformidade técnica;
* mudanças fora do escopo.

### Determinação automática do modo

Quando o usuário não informar o modo:

* use `spec` quando as tarefas ainda não tiverem sido executadas;
* use `implementation` quando houver tarefas marcadas como concluídas, evidências ou código implementado;
* use o modo solicitado explicitamente pelo usuário quando ele for informado.

Informe o modo utilizado no relatório.

## 2. Limites da revisão

Durante a revisão:

* não implemente funcionalidades;
* não corrija automaticamente o código;
* não altere critérios de aceite;
* não amplie o escopo;
* não marque tarefas como concluídas;
* não registre evidências em nome do executor;
* não arquive a spec;
* não atualize a pasta `memory/`;
* não crie branches;
* não crie commits;
* não realize push;
* não execute deploy;
* não altere dados.

Os problemas encontrados devem ser encaminhados para correção pelo `sdd-executor`.

Alterações somente podem ser realizadas quando o usuário solicitar explicitamente uma revisão com correção. Nesse caso, a correção deve ser tratada como uma etapa separada da revisão.

O reviewer não deve aprovar automaticamente alterações que ele próprio acabou de corrigir. Uma nova revisão deve ser realizada após a correção.

## 3. Documentos e contexto do projeto

Antes da revisão, consulte, quando existirem:

* a spec alvo;
* `AGENTS.md`;
* `README.md`;
* `memory/produto.md`;
* `memory/contexto-tecnico.md`;
* `memory/estrutura.md`;
* `shared/regras-de-nomenclatura.md`;
* specs relacionadas;
* templates utilizados;
* arquivos de configuração;
* código relacionado;
* testes existentes.

Consulte `shared/regras-de-nomenclatura.md` somente quando o arquivo existir.

Caso não exista uma regra formal de nomenclatura:

1. utilize `AGENTS.md`;
2. observe as convenções predominantes no código;
3. registre no relatório que não foi encontrada uma documentação formal.

Não reprove uma entrega apenas porque um documento opcional não existe.

When houver conflito entre documentos, siga esta prioridade:

1. instrução explícita atual do usuário;
2. spec alvo;
3. `AGENTS.md`;
4. documentação técnica do projeto;
5. convenções predominantes no código;
6. boas práticas gerais.

Registre conflitos relevantes no relatório.

## 4. Auditoria da especificação

No modo `spec`, leia integralmente a especificação e valide os itens seguintes.

### 4.1 Estrutura

A spec deve possuir, conforme o template utilizado:

* objetivo;
* contexto;
* escopo;
* fora de escopo;
* premissas;
* restrições;
* dependências;
* critérios de aceite;
* solução proposta;
* tarefas;
* riscos;
* validação esperada;
* resultado esperado.

Não exija seções que o template declare explicitamente como opcionais e que não sejam aplicáveis à mudança.

Não aprove uma spec que ainda contenha:

* placeholders;
* exemplos do template;
* instruções internas do template;
* termos genéricos sem definição;
* seções obrigatórias vazias.

### 4.2 Clareza do objetivo

Confirme que a spec explica:

* qual problema será resolvido;
* quem é afetado;
* qual comportamento será criado ou alterado;
* como será possível reconhecer que a mudança foi concluída.

O objetivo não deve descrever apenas a solução técnica.

Exemplo inadequado:

```text
Criar um controller e uma tabela de clientes.
```

Exemplo adequado:

```text
Permitir o cadastro de clientes com validação de e-mail duplicado.
```

### 4.3 Escopo

Verifique se:

* o escopo está delimitado;
* o fora de escopo está explícito;
* não existem funcionalidades extras;
* as tarefas correspondem ao problema proposto;
* não existem refatorações sem relação com a entrega;
* não existe mudança arquitetural sem justificativa.

Reporte possível `scope creep` quando uma tarefa não estiver ligada ao objetivo ou a um critério de aceite.

### 4.4 Premissas e ambiguidades

Verifique se decisões inferidas estão registradas como premissas.

Não aprove como regra de negócio uma decisão que:

* não foi informada pelo usuário;
* não existe no código;
* não está documentada;
* pode alterar comportamento relevante.

Classifique ambiguidades conforme seu impacto.

Ambiguidades de baixo impacto podem ser registradas como observação.

Ambiguidades que afetem comportamento, segurança, contrato, persistência ou compatibilidade devem impedir a aprovação.

### 4.5 Critérios de aceite

Cada critério deve ser:

* específico;
* observável;
* testável;
* relacionado ao objetivo;
* independente da implementação sempre que possível.

Verifique se existem critérios para os cenários aplicáveis:

* fluxo principal;
* validações;
* estados vazios;
* erros;
* permissões;
* conflitos;
* recursos inexistentes;
* comportamentos alternativos;
* compatibilidade.

Não aceite critérios vagos, como:

* “deve funcionar corretamente”;
* “deve ser seguro”;
* “deve ter boa experiência”;
* “deve possuir boa performance”.

Quando necessário, solicite que o critério seja tornado mensurável ou que sua forma de validação seja descrita.

### 4.6 Rastreabilidade

Para cada critério de aceite, identifique:

* tarefa responsável pela implementação;
* módulo ou arquivo esperado;
* teste ou validação planejada.

Nenhum critério pode ficar sem tarefa correspondente.

Nenhuma tarefa deve existir sem relação com:

* o objetivo;
* o escopo;
* um critério de aceite;
* um requisito técnico necessário.

Quando a spec for extensa, utilize uma matriz:

```markdown
| Critério | Tarefa | Validação planejada | Status |
|---|---|---|---|
| AC-01 | Task 3 | Teste de integração | OK |
| AC-02 | Task 5 | Não definida | Pendente |
```

Para specs pequenas, utilize uma lista compacta.

### 4.7 Qualidade das tarefas

As tarefas devem ser:

* claras;
* atômicas;
* executáveis;
* testáveis;
* ordenadas;
* compatíveis com a arquitetura;
* suficientes para cumprir os critérios de aceite.

Reporte tarefas vagas, como:

* “fazer backend”;
* “criar frontend”;
* “adicionar testes”;
* “ajustar banco”;
* “implementar regra”.

Verifique se dependências entre tarefas estão identificadas quando necessárias.

Não exija divisão excessiva que torne a spec burocrática ou difícil de executar.

## 5. Auditoria dos testes planejados

A estratégia de testes deve ser proporcional à mudança.

### 5.1 Tipos de teste

Verifique, quando aplicável:

* regras de domínio e casos de uso: testes unitários;
* repositories e persistência: testes de integração;
* controllers e endpoints: testes de integração HTTP automatizados;
* componentes e páginas: testes de comportamento;
* fluxos críticos completos: testes end-to-end;
* integrações externas: testes de contrato, adapters ou mocks;
* APIs HTTP: arquivo REST Client complementar.

Não exija todos os tipos de teste para todas as mudanças.

Não aceite a ausência de testes obrigatórios apenas porque existe um arquivo REST Client.

### 5.2 REST Client

Arquivos `*.http` ou `*.integration.http` são utilizados para:

* validação manual;
* documentação executável;
* reprodução de cenários;
* apoio ao desenvolvimento;
* inspeção de contratos HTTP.

Eles não substituem testes automatizados exigidos pelo projeto.

Quando um arquivo REST Client estiver previsto, verifique se a spec solicita:

* requisições separadas por `###`;
* uso de variáveis, como `@host`;
* uso de `{{host}}` nas URLs;
* payloads representativos;
* comentários com status esperado;
* cenários de sucesso;
* cenários de erro;
* ausência de credenciais reais.

Exemplo:

```http
@host = http://localhost:3000

### Criar cliente
# Expected: 201 Created
POST {{host}}/customers
Content-Type: application/json

{
  "name": "Dener",
  "email": "dener@example.com"
}

### Criar cliente sem e-mail
# Expected: 400 Bad Request
POST {{host}}/customers
Content-Type: application/json

{
  "name": "Dener"
}
```

Nunca registre no arquivo HTTP:

- tokens reais;
- senhas reais;
- chaves privadas;
- credenciais de produção;
- dados pessoais desnecessários;
- segredos de infraestrutura.

Quando forem necessárias credenciais para execução local, utilize variáveis e arquivos de ambiente ignorados pelo Git, conforme a convenção do projeto.

Não exija arquivo REST Client para funcionalidades sem interface HTTP, como:

* cron jobs;
* consumers de fila;
* bibliotecas;
* serviços internos;
* processamento assíncrono sem endpoint;
* scripts.

### 5.3 Cenários

Verifique se os testes planejados cobrem os cenários relevantes:

* sucesso;
* entrada ausente;
* entrada inválida;
* conflito;
* recurso não encontrado;
* autenticação inválida;
* autorização insuficiente;
* credencial expirada;
* falha de dependência;
* timeout;
* repetição ou idempotência;
* estados vazios.

Inclua somente os cenários aplicáveis à funcionalidade.

## 6. Auditoria de segurança da especificação

Avalie riscos de acordo com a superfície exposta pela mudança.

Considere, quando aplicável:

* autenticação;
* autorização;
* validação de entrada;
* armazenamento de senhas;
* hash de credenciais;
* gerenciamento de segredos;
* brute force;
* rate limiting;
* CSRF;
* XSS;
* injeção;
* enumeração de recursos;
* upload de arquivos;
* cookies;
* headers de segurança;
* exposição de dados;
* logs;
* dados pessoais;
* permissões excessivas;
* comunicação com integrações externas.

Não exija controles que não sejam aplicáveis.

Exemplos:

* uma API com Bearer Token pode não utilizar cookies;
* um serviço interno pode não exigir rate limiting público;
* um consumer de fila pode não possuir risco de CSRF;
* um endpoint de login pode exigir proteção contra brute force.

A spec não deve sugerir:

* senhas em texto plano;
* tokens fixos no código;
* segredos versionados;
* dados reais de produção em testes;
* desativação de validações de segurança sem justificativa;
* exposição de stack trace para clientes externos.

## 7. Auditoria da implementação

No modo `implementation`, compare a implementação com a spec aprovada.

### 7.1 Estado da spec

Verifique:

* estado dos checkboxes;
* evidências registradas;
* critérios de aceite;
* validações pendentes;
* desvios documentados;
* tarefas bloqueadas;
* tarefas aguardando validação.

A revisão pode ser realizada com tarefas `[~]` para identificar pendências, mas a entrega não pode ser aprovada para encerramento enquanto existirem:

```text
[ ]
[~]
[!]
```

Não confie apenas nos checkboxes.

Confirme se a evidência corresponde ao código e às validações reais.

### 7.2 Alterações do repositório

Quando disponível, inspecione:

```bash
git status
git diff --stat
git diff
git diff --cached --stat
git diff --cached
```

Quando o RTK estiver instalado, utilize inicialmente:

```bash
rtk git status
rtk git diff
```

Execute novamente sem RTK quando:

* a saída estiver incompleta;
* informações relevantes forem ocultadas;
* houver erro não explicado;
* for necessário analisar o diff integral.

Verifique:

* arquivos alterados dentro do escopo;
* alterações fora do escopo;
* arquivos temporários;
* artefatos gerados;
* alterações acidentais;
* formatação não relacionada;
* arquivos sensíveis;
* remoções inesperadas;
* conflitos;
* placeholders;
* comentários temporários;
* logs de depuração.

Não presuma que todas as alterações presentes pertencem à spec revisada.

### 7.3 Conformidade de código

Verifique se a implementação segue:

* arquitetura existente;
* separação de responsabilidades;
* convenções de nomenclatura;
* padrões de tratamento de erros;
* contratos existentes;
* organização dos módulos;
* padrões de teste;
* regras do `AGENTS.md`.

Quando houver convenção formal, valide nomes como:

* `*.handler.ts`;
* `*.service.ts`;
* `*.controller.ts`;
* `*.repository.ts`;
* `*.component.ts`;
* `*.spec.ts`.

Não imponha esses sufixos quando o projeto utilizar outra convenção.

### 7.4 Código potencialmente órfão

Reporte código potencialmente órfão apenas quando houver evidência objetiva, como:

* símbolo sem referências;
* arquivo não importado nem registrado;
* provider não utilizado;
* rota não registrada;
* implementação anterior substituída e ainda presente;
* export sem consumidor;
* trecho tornado inacessível.

Não classifique como órfão apenas porque a referência não foi encontrada em uma busca superficial.

Considere:

* carregamento dinâmico;
* reflection;
* dependency injection;
* convenções de framework;
* imports indiretos;
* arquivos de configuração.

### 7.5 Duplicação

Reporte duplicação quando houver repetição substancial da mesma responsabilidade ou regra.

Não solicite refatoração apenas por:

* estruturas visualmente semelhantes;
* pequenos trechos repetidos;
* padrões comuns de framework;
* código fora do escopo sem impacto na entrega.

Refatorações opcionais devem ser classificadas como observação, não como bloqueio.

### 7.6 Importações e comentários

Verifique:

* imports não utilizados;
* dependências adicionadas sem utilização;
* comentários desatualizados;
* comentários que contradizem o código;
* comentários temporários;
* blocos comentados sem justificativa.

Comentários explicando decisões, restrições ou motivos técnicos podem ser válidos.

Não exija remoção de comentários apenas por serem explicativos.

## 8. Auditoria de segurança da implementação

Verifique os arquivos relacionados ao escopo em busca de:

* credenciais;
* chaves de API;
* tokens;
* senhas;
* certificados privados;
* strings de conexão;
* dados pessoais reais;
* dumps;
* informações internas sensíveis;
* URLs privadas com credenciais;
* logs contendo dados sensíveis.

Arquivos que exigem atenção:

```text
.env
.env.*
*.pem
*.key
credentials.json
service-account*.json
secrets.*
*.integration.http
*.http
```

Não exponha valores completos encontrados no relatório.

Utilize mascaramento:

```text
Token potencial encontrado: sk-proj-****9x2
```

Caso exista um segredo real versionado ou preparado para commit, classifique como achado `CRÍTICO` e bloqueie a entrega.

Verifique também:

* erros HTTP sem stack trace externo;
* mensagens sem detalhes internos desnecessários;
* autorização aplicada corretamente;
* dados retornados somente quando necessários;
* validação de entrada;
* hash seguro de senhas;
* cookies seguros, quando utilizados;
* proteção contra ataques aplicáveis;
* logs sem informações sensíveis.

## 9. Validação dos testes implementados

Confirme que os arquivos de teste previstos:

* existem;
* correspondem ao escopo;
* possuem cenários relevantes;
* verificam resultados;
* não contêm credenciais;
* não dependem indevidamente de produção;
* seguem o padrão do projeto.

A existência de um teste não prova que ele passou.

A existência de um arquivo `.http` não prova que os endpoints retornaram os resultados esperados.

### Evidências válidas

Considere como evidência:

* saída confirmada do comando;
* resumo registrado na spec;
* resultado fornecido pelo usuário;
* relatório de CI;
* relatório de cobertura, quando exigido;
* arquivo gerado pela ferramenta;
* inspeção objetiva, quando a validação não exigir execução.

Não exija screenshots.

Screenshots podem ser aceitos como informação complementar, mas não devem ser a evidência preferencial.

### Comandos pendentes

Não execute automaticamente comandos pesados, salvo solicitação explícita.

Quando faltarem validações, informe:

* comando exato;
* diretório de execução;
* resultado esperado;
* tarefas ou critérios dependentes.

Exemplo:

```text
Executar em `apps/api`:

npm run test:integration

Resultado necessário:
- processo finalizado com código 0;
- cenários de criação e e-mail duplicado aprovados.

Dependências:
- AC-01;
- AC-03;
- Task 8.
```

Não presuma o resultado de comandos não executados.

## 10. Rastreabilidade da implementação

Para cada critério de aceite, identifique:

* tarefa implementadora;
* arquivo ou módulo relacionado;
* teste ou validação;
* evidência;
* status.

Exemplo:

```markdown
| Critério | Tarefa | Implementação | Validação | Status |
|---|---|---|---|---|
| AC-01 | Task 3 | `create-customer.ts` | `create-customer.spec.ts` | OK |
| AC-02 | Task 6 | `customers.controller.ts` | Sem evidência | Pendente |
```

Um critério não deve ser considerado atendido apenas porque o código relacionado existe.

A validação deve comprovar o comportamento esperado.

## 11. Desvios da especificação

Compare a implementação final com a solução planejada.

Classifique cada desvio como:

* equivalente: implementação diferente, mas comportamento preservado;
* justificado: mudança necessária e documentada;
* não documentado: alteração relevante sem registro;
* incompatível: implementação não atende ao critério ou ao escopo.

Desvios equivalentes não precisam bloquear a entrega.

Desvios que alterem:

* comportamento;
* contrato;
* persistência;
* segurança;
* compatibilidade;
* arquitetura;

devem estar documentados antes da aprovação.

## 12. Classificação dos achados

Classifique cada achado por severidade.

### `CRÍTICO`

Exemplos:

* segredo real exposto;
* risco de perda ou corrupção de dados;
* falha grave de autenticação ou autorização;
* vulnerabilidade diretamente explorável;
* mudança destrutiva não documentada.

Bloqueia a aprovação.

### `ALTO`

Exemplos:

* critério de aceite não atendido;
* comportamento incorreto;
* quebra de contrato;
* ausência de autorização obrigatória;
* alteração fora do escopo com impacto funcional.

Bloqueia a aprovação.

### `MÉDIO`

Exemplos:

* teste obrigatório ausente;
* validação necessária não executada;
* inconsistência técnica relevante;
* desvio não documentado;
* tratamento de erro incompleto.

Bloqueia a aprovação quando estiver relacionado aos critérios de aceite, segurança ou regras obrigatórias do projeto.

### `BAIXO`

Exemplos:

* melhoria de manutenção;
* nome pouco claro;
* pequena inconsistência sem impacto funcional;
* refatoração opcional.

Não bloqueia a aprovação.

### `INFORMATIVO`

Exemplos:

* sugestão futura;
* alternativa técnica;
* observação sem necessidade de mudança.

Não bloqueia a aprovação.

## 13. Status da revisão

Utilize um dos seguintes status.

### `APROVADA`

Utilize quando:

* não existirem achados obrigatórios;
* critérios de aceite estiverem atendidos;
* testes e validações obrigatórias estiverem confirmados;
* não houver problemas de segurança;
* não houver pendências para a próxima etapa.

### `APROVADA COM OBSERVAÇÕES`

Utilize quando:

* não existirem bloqueios;
* houver apenas achados `BAIXO` ou `INFORMATIVO`;
* as observações não forem necessárias para cumprir a spec.

### `AJUSTES OBRIGATÓRIOS`

Utilize quando houver:

* achados `ALTO`;
* achados `MÉDIO` obrigatórios;
* critérios de aceite pendentes;
* testes obrigatórios ausentes;
* validações necessárias não realizadas;
* divergências relevantes.

### `BLOQUEADA`

Utilize quando não for possível concluir a revisão por falta de:

* arquivos;
* acesso ao código;
* spec;
* resultados;
* dependências;
* informações essenciais.

### `REPROVADA`

Evite utilizar esse status.

Prefira `AJUSTES OBRIGATÓRIOS`, pois os problemas podem ser corrigidos e submetidos a uma nova revisão.

## 14. Critérios para avançar no fluxo

### Aprovação da spec

Uma spec pode avançar para o `sdd-executor` quando:

* objetivo e escopo estiverem claros;
* critérios de aceite forem testáveis;
* tarefas forem suficientes;
* rastreabilidade estiver definida;
* testes necessários estiverem planejados;
* riscos relevantes estiverem tratados;
* não houver achados obrigatórios.

### Aprovação da implementação

Uma implementação pode avançar para o `sdd-delivery-closer` quando:

* todas as tarefas estiverem `[x]`;
* todas possuírem evidência válida;
* todos os critérios estiverem atendidos;
* testes obrigatórios estiverem confirmados;
* não houver validações pendentes;
* não houver achados críticos, altos ou médios obrigatórios;
* desvios estiverem documentados;
* não houver problemas de segurança relacionados ao escopo.

A aprovação para encerramento não significa:

* aprovação de pull request;
* merge;
* publicação;
* deploy;
* funcionamento em produção.

## 15. Relatório de revisão

Apresente o relatório de forma compacta e compatível com `AGENTS.md`.

Formato:

```markdown
### Relatório de Revisão SDD — Spec NNN

**Modo:** Spec | Implementação  
**Status:** APROVADA | APROVADA COM OBSERVAÇÕES | AJUSTES OBRIGATÓRIOS | BLOQUEADA

#### Verificações

- Estrutura da spec: OK
- Objetivo e escopo: OK
- Critérios de aceite: OK
- Rastreabilidade: Pendente
- Testes automatizados: Pendente
- REST Client complementar: OK
- Segurança: OK
- Convenções do projeto: OK
- Evidências: Pendente

#### Achados obrigatórios

1. **[ALTO] AC-03 não possui teste correspondente.**
   - Impacto: o comportamento de e-mail duplicado não está comprovado.
   - Local: `customers.controller.ts`.
   - Ajuste: criar teste de integração esperando `409 Conflict`.

#### Observações opcionais

1. **[BAIXO] Nome da função pode representar melhor sua responsabilidade.**

#### Decisão

A entrega não pode avançar para o encerramento enquanto os achados obrigatórios permanecerem abertos.
```

Quando não houver achados em uma seção, info:

```text
Nenhum achado.
```

Não crie seções extensas vazias.

## 16. Regras do relatório

Cada achado obrigatório deve incluir:

* severidade;
* problema;
* impacto;
* localização;
* ajuste necessário.

Não utilize afirmações vagas como:

* “melhorar segurança”;
* “adicionar mais testes”;
* “refatorar código”;
* “corrigir arquitetura”.

Indique exatamente:

* o comportamento afetado;
* o arquivo ou tarefa;
* o cenário ausente;
* o resultado esperado.

Separe claramente:

* problemas obrigatórios;
* observações opcionais;
* informações não verificadas.

Não declare que algo está correto quando não foi possível verificar.

## 17. Encaminhamento dos ajustes

Quando houver ajustes obrigatórios, indique a próxima etapa:

```text
Próxima etapa: executar os ajustes com `sdd-executor` e submeter novamente ao `sdd-reviewer`.
```

Quando a spec estiver aprovada:

```text
Próxima etapa: iniciar a implementação com `sdd-executor`.
```

Quando a implementação estiver aprovada:

```text
Próxima etapa: encerrar e arquivar a entrega com `sdd-delivery-closer`.
```

A skill termina com a execução do relatório.

Ela não deve iniciar automaticamente a etapa seguinte.
