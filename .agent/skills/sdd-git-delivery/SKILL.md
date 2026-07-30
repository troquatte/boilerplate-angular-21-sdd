---
name: git-delivery
description: Executa operações controladas de entrega com Git, incluindo criação de branches, preparação de alterações, commits padronizados e push, com revisão de escopo e registro de assistência por IA.
---

---

# Delivery e Controle de Versão com Git

Use esta skill quando o usuário solicitar explicitamente uma ou mais destas operações:

- criar uma branch;
- preparar arquivos para commit;
- criar um commit;
- enviar uma branch ao repositório remoto;
- verificar o estado de uma entrega no Git;
- sugerir comandos de versionamento.

Esta skill não autoriza automaticamente todas as etapas do fluxo.

Por exemplo:

- “crie uma branch” não autoriza commit ou push;
- “faça o commit” não autoriza push;
- “prepare os comandos” não autoriza executá-los;
- “suba as alterações” pode autorizar commit e push somente quando o contexto deixar claro que ambos são necessários.

Em caso de dúvida, execute apenas a operação explicitamente solicitada e apresente as etapas restantes como sugestão.

## 1. Restrições de segurança

Não execute automaticamente:

- `git add .`;
- `git add -A`;
- `git commit --amend`;
- `git push --force`;
- `git push --force-with-lease`;
- `git reset`;
- `git rebase`;
- `git clean`;
- `git checkout -- <arquivo>`;
- `git restore <arquivo>`;
- exclusão de branches;
- alteração do histórico;
- merge;
- cherry-pick;
- criação de tag;
- criação de release.

Essas operações exigem solicitação explícita do usuário.

Nunca descarte alterações locais para concluir uma entrega.

Não modifique configurações globais ou locais do Git sem autorização, incluindo:

```bash
git config user.name
git config user.email
git config --global
```

É permitido consultar essas configurações.

## 2. Identificar o repositório

Antes de qualquer operação de escrita, confirme que o diretório atual pertence a um repositório Git:

```bash
git rev-parse --is-inside-work-tree
```

Identifique a raiz:

```bash
git rev-parse --show-toplevel
```

Caso o diretório não seja um repositório Git, interrompa a operação e informe o problema.

Não execute `git init` sem solicitação explícita.

## 3. Identificar usuário, branch e remoto

Consulte:

```bash
git config user.name
git config user.email
git branch --show-current
git status --short --branch
git remote -v
```

Verifique:

- nome configurado do autor;
- e-mail configurado;
- branch atual;
- existência de alterações;
- existência de conflitos;
- nome do remoto;
- relação da branch com seu upstream.

Não presuma que:

- o remoto se chama `origin`;
- a branch principal se chama `main`;
- o autor está configurado;
- a branch possui upstream;
- o repositório está sincronizado.

Caso `git branch --show-current` não retorne uma branch, verifique se o repositório está em `detached HEAD`.

Não crie commit nem realize push em `detached HEAD` sem antes criar ou selecionar uma branch apropriada.

## 4. Revisar o estado do repositório

Execute:

```bash
git status
git diff --stat
git diff
git diff --cached --stat
git diff --cached
```

Analise separadamente:

- arquivos modificados não preparados;
- arquivos preparados;
- arquivos novos;
- arquivos removidos;
- alterações fora do escopo;
- conflitos;
- arquivos sensíveis;
- alterações geradas automaticamente.

Caso existam muitos arquivos, utilize primeiro as versões `--stat` e examine o conteúdo relevante individualmente.

Não presuma que todas as alterações presentes pertencem à entrega atual.

## 5. Verificar conflitos e operações em andamento

Antes de criar branch, commit ou push, verifique se existe:

- merge em andamento;
- rebase em andamento;
- cherry-pick em andamento;
- revert em andamento;
- conflito não resolvido.

Também inspecione o resultado de:

```bash
git status
```

Não prossiga com commit ou push enquanto houver conflitos não resolvidos, salvo quando o usuário solicitar especificamente uma operação relacionada à resolução deles.

Não marque conflitos como resolvidos sem analisar os arquivos.

## 6. Verificar arquivos sensíveis

Antes de preparar alterações, procure arquivos ou conteúdos que não devam ser versionados.

Exemplos:

- `.env`;
- `.env.local`;
- chaves privadas;
- certificados privados;
- tokens;
- senhas;
- credenciais de cloud;
- arquivos de autenticação;
- dumps de banco;
- arquivos com dados pessoais;
- configurações locais da máquina;
- logs com informações sensíveis.

Nomes comuns que exigem revisão:

```text
.env
.env.*
*.pem
*.key
id_rsa
credentials.json
service-account*.json
secrets.*
```

A existência de um nome suspeito não significa automaticamente que o arquivo contém segredo. Analise antes de decidir.

Caso encontre possível informação sensível:

1. não adicione o arquivo;
2. não crie o commit;
3. informe o risco;
4. identifique o arquivo;
5. aguarde a correção ou exclusão do escopo.

Não exponha o valor completo do segredo na resposta.

## 7. Nomenclatura de branches

Utilize branches em minúsculas e `kebab-case`.

Prefixos padrão:

- `feature/`: nova funcionalidade;
- `fix/`: correção de bug;
- `chore/`: manutenção, configuração ou tarefa operacional;
- `docs/`: alterações exclusivamente documentais;
- `refactor/`: refatoração sem mudança funcional;
- `test/`: inclusão ou alteração exclusiva de testes.

Exemplos:

```text
feature/customer-registration
fix/customer-email-validation
chore/update-eslint-config
docs/customer-api
refactor/customer-repository
test/customer-use-case
```

Quando o projeto já possuir uma convenção própria, prefira a convenção existente.

Antes de criar a branch, verifique se ela já existe:

```bash
git branch --list "<nome-da-branch>"
git branch --remotes --list "*/<nome-da-branch>"
```

Para criar e acessar uma nova branch:

```bash
git switch -c <nome-da-branch>
```

Caso `git switch` não esteja disponível, utilize:

```bash
git checkout -b <nome-da-branch>
```

Não altere de branch quando existirem modificações locais que possam ser sobrescritas ou misturadas sem revisar o impacto.

## 8. Branches protegidas

Considere como potencialmente protegidas branches como:

- `main`;
- `master`;
- `develop`;
- `development`;
- `production`;
- `release/*`.

Não realize push direto para essas branches sem solicitação explícita.

Quando o usuário solicitar uma entrega a partir de uma branch protegida, prefira criar uma branch de trabalho apropriada, desde que isso esteja alinhado à solicitação.

Não presuma que uma branch é segura para push apenas porque não está na lista acima. Considere também as convenções do projeto.

## 9. Formato dos commits

Utilize Conventional Commits:

```text
<tipo>(<escopo>): <descrição>
```

Tipos permitidos:

- `feat`: nova funcionalidade;
- `fix`: correção de comportamento;
- `chore`: manutenção sem alteração funcional relevante;
- `docs`: documentação;
- `refactor`: alteração estrutural sem mudança funcional;
- `style`: formatação sem mudança de comportamento;
- `test`: criação ou alteração de testes;
- `build`: sistema de build ou dependências;
- `ci`: pipelines e integração contínua;
- `perf`: melhoria de desempenho;
- `revert`: reversão de commit anterior.

Exemplos:

```text
feat(customer): adiciona cadastro de clientes
fix(auth): corrige renovação do token expirado
docs(api): documenta endpoint de clientes
refactor(customer): separa validação do caso de uso
test(customer): adiciona cenários de e-mail duplicado
```

### Regras para a descrição

A descrição deve:

- ser objetiva;
- representar o efeito principal da alteração;
- estar em minúsculas;
- não terminar com ponto;
- evitar termos vagos como “ajustes”, “mudanças” ou “correções diversas”;
- preferencialmente ter até 72 caracteres.

O escopo deve representar o módulo ou domínio afetado.

Não invente um escopo quando o commit não possuir um módulo evidente. Nesse caso, utilize:

```text
docs: atualiza documentação do fluxo de entrega
```

## 10. Mudanças incompatíveis

Quando a alteração introduzir quebra de compatibilidade, utilize:

```text
feat(api)!: altera contrato de criação de clientes
```

E registre no corpo:

```text
BREAKING CHANGE: o campo `name` foi substituído por `fullName`.
```

Não classifique uma mudança como incompatível sem evidência.

## 11. Registro da assistência por IA

O usuário permanece como autor do commit.

No corpo do commit, adicione uma linha especificando o autor e a IA que auxiliou no desenvolvimento. O formato deve ser:

```text
Feito por <git.name> usando a IA Antigravity
```

Exemplo de formato completo:

```text
feat(customer): adiciona cadastro de clientes

Implementa o formulário, endpoint e persistência de clientes.

Feito por João Silva usando a IA Antigravity
```

Consulte dinamicamente o nome configurado do autor usando `git config user.name`. Caso use outro assistente de IA, substitua "Antigravity" pelo nome da respectiva IA correspondente.

## 12. Selecionar os arquivos do commit

Adicione somente arquivos pertencentes ao escopo solicitado.

Prefira:

```bash
git add -- caminho/do/arquivo-a caminho/do/arquivo-b
```

O separador `--` evita que caminhos sejam interpretados como opções.

Para diretórios específicos:

```bash
git add -- src/customer tests/customer
```

Para remoções intencionais já revisadas:

```bash
git add -- caminho/do/arquivo-removido
```

Não utilize automaticamente:

```bash
git add .
git add -A
```

Caso existam alterações de entregas diferentes, separe-as em commits distintos.

Não inclua arquivos apenas porque já estavam modificados antes do início da tarefa.

## 13. Revisar o conteúdo preparado

Após executar `git add`, revise obrigatoriamente:

```bash
git diff --cached --stat
git diff --cached
git status --short
```

Confirme que:

- apenas arquivos relevantes foram preparados;
- não existem segredos;
- não existem alterações acidentais;
- não existem arquivos temporários;
- o commit possui uma finalidade coerente;
- a mensagem proposta descreve corretamente o conteúdo;
- alterações não relacionadas permanecem fora do stage.

Caso algum arquivo tenha sido preparado por engano, não o remova do stage sem informar o usuário quando houver risco de afetar trabalho anterior.

Uma forma segura de retirar apenas um arquivo do stage, preservando seu conteúdo local, é:

```bash
git restore --staged -- caminho/do/arquivo
```

Execute esse comando apenas quando necessário e após confirmar que ele não interfere em uma preparação anterior feita pelo usuário.

## 14. Criar o commit

Para mensagens com título, corpo e a assinatura, utilize múltiplos argumentos `-m`:

```bash
git commit \
  -m "feat(customer): adiciona cadastro de clientes" \
  -m "Implementa o formulário, endpoint e persistência de clientes." \
  -m "Feito por João Silva usando a IA Antigravity"
```

Para um commit apenas com título e assinatura:

```bash
git commit \
  -m "docs(sdd): atualiza processo de encerramento" \
  -m "Feito por João Silva usando a IA Antigravity"
```

Não use um único argumento `-m` esperando que quebras de linha literais sejam interpretadas igualmente em todos os shells.

Caso não existam alterações preparadas, não crie um commit vazio, salvo quando o usuário solicitar explicitamente.

Não utilize `--no-verify` sem solicitação explícita.

Hooks de commit devem ser respeitados.

## 15. Verificar o commit criado

Após o commit, execute:

```bash
git status
git log -1 --stat
git show --summary --format=fuller HEAD
```

Confirme:

- hash abreviado do commit;
- autor;
- branch;
- mensagem;
- arquivos incluídos;
- estado restante do repositório.

Não declare sucesso somente porque o comando `git commit` foi executado. Verifique seu código de saída e o commit resultante.

Caso um hook rejeite o commit, reporte o erro real e mantenha as alterações preparadas conforme o estado retornado pelo Git.

## 16. Preparar o push

Antes do push, identifique o remoto correto:

```bash
git remote -v
```

Não presuma que ele se chama `origin`.

Verifique a branch atual:

```bash
git branch --show-current
```

Verifique o upstream:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
```

Esse comando pode falhar quando ainda não existir upstream.

### Primeira publicação da branch

Quando a branch ainda não possuir upstream:

```bash
git push -u <remoto> <nome-da-branch>
```

### Branch com upstream configurado

Quando o upstream estiver correto:

```bash
git push
```

Ou, de forma explícita:

```bash
git push <remoto> <nome-da-branch>
```

Não utilize `--force` ou `--force-with-lease` sem solicitação explícita e análise do impacto.

## 17. Verificar divergência com o remoto

Quando o remoto estiver acessível e a atualização de referências for segura, consulte o estado antes do push.

Pode ser utilizado:

```bash
git fetch <remoto>
```

Como `git fetch` altera referências remotas locais e acessa a rede, execute-o somente quando fizer parte da solicitação ou for autorizado pelo usuário.

Após a atualização, verifique a divergência:

```bash
git status --short --branch
```

Quando aplicável:

```bash
git log --oneline --left-right --cherry-pick HEAD...@{upstream}
```

Caso a branch remota possua commits ausentes localmente, não execute automaticamente:

- pull;
- merge;
- rebase;
- push forçado.

Informe a divergência e aguarde uma decisão.

## 18. Verificar o push

Após o push, confirme:

- código de saída do comando;
- remoto utilizado;
- branch enviada;
- upstream configurado, quando aplicável;
- commit enviado;
- mensagens ou rejeições retornadas pelo servidor.

Utilize:

```bash
git status --short --branch
git rev-parse --short HEAD
git branch -vv
```

Não declare que o repositório remoto foi atualizado quando:

- o push foi rejeitado;
- houve falha de autenticação;
- houve falha de rede;
- a branch estava desatualizada;
- o remoto não foi encontrado;
- o comando não foi executado;
- o resultado não pôde ser confirmado.

## 19. Commits atômicos

Quando existirem alterações independentes, proponha commits separados.

Exemplo:

```text
feat(customer): adiciona cadastro de clientes
test(customer): adiciona cenários de criação de clientes
docs(customer): documenta endpoint de cadastro
```

Não divida artificialmente alterações que dependem umas das outras para funcionar.

Cada commit deve:

- possuir uma finalidade clara;
- manter o projeto em estado coerente quando possível;
- conter apenas arquivos relacionados;
- possuir mensagem compatível com seu conteúdo.

## 20. Validações antes da entrega

Antes do commit, consulte as evidências da spec ou da tarefa para identificar validações já realizadas.

Não execute automaticamente comandos pesados apenas por estar fazendo a entrega.

Quando ainda existirem validações obrigatórias pendentes:

1. informe quais são;
2. forneça os comandos;
3. não declare que a entrega está validada;
4. só impeça o commit quando o usuário ou as regras do projeto exigirem validação prévia.

Caso o usuário solicite explicitamente o commit mesmo com validações pendentes, registre essa condição no resumo final.

Não escreva “testes passaram” sem que os testes tenham sido executados e confirmados.

## 21. Tratamento de falhas

Caso uma operação falhe:

1. preserve o estado atual;
2. não tente operações destrutivas para corrigir automaticamente;
3. informe o comando que falhou;
4. apresente a mensagem de erro relevante;
5. explique o estado atual do repositório;
6. indique uma próxima ação segura.

Não repita indefinidamente um comando com falha de autenticação ou permissão.

## 22. Relação com as skills SDD

Quando a entrega estiver associada a uma spec:

- verifique se a spec está concluída;
- consulte o resumo de encerramento;
- utilize o identificador da spec para compreender o escopo;
- não altere tarefas ou evidências durante o fluxo Git;
- não arquive a spec nesta skill;
- não atualize a memória técnica nesta skill.

Responsabilidades:

- `sdd-spec-generator`: cria o planejamento;
- `sdd-executor`: implementa e registra evidências;
- `sdd-delivery-closer`: revisa, sincroniza a memória e arquiva;
- `git-delivery`: versiona e envia as alterações autorizadas.

O commit pode ocorrer antes ou depois do arquivamento conforme o fluxo definido pelo projeto, mas o estado real deve ser registrado sem presumir que commit, fechamento e deploy são a mesma etapa.

## 23. Operações separadas

Trate como etapas independentes:

1. criação de branch;
2. preparação dos arquivos;
3. criação do commit;
4. push;
5. abertura de pull request;
6. merge;
7. deploy.

A conclusão de uma etapa não autoriza automaticamente a seguinte.

Esta skill não abre pull requests nem realiza deploy, salvo quando essas capacidades estiverem explicitamente disponíveis e forem solicitadas pelo usuário.

## 24. Resumo final

Ao concluir, informe apenas as operações realmente executadas.

Inclua, quando aplicável:

- branch criada ou utilizada;
- arquivos incluídos no commit;
- arquivos modificados que permaneceram fora do commit;
- hash abreviado;
- mensagem do commit;
- remoto utilizado;
- branch enviada;
- upstream configurado;
- validações realizadas;
- validações pendentes;
- possíveis riscos ou falhas.

Exemplo:

```text
Branch: feature/customer-registration
Commit: a1b2c3d — feat(customer): adiciona cadastro de clientes
Push: enviado para origin/feature/customer-registration
Upstream: configurado
Validações: lint e testes confirmados (quando exigidos pela spec)
Pendências: nenhuma conhecida dentro do escopo versionado
```

Não declare que:

- a alteração foi aprovada;
- o pull request foi criado;
- o código foi integrado;
- o deploy foi realizado;
- a funcionalidade está em produção;

a menos que essas etapas tenham sido efetivamente realizadas e confirmadas.
