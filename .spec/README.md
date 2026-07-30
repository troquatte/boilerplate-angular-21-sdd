# Processo SDD (Spec Driven Development) - Cadastro Base

Este diretório contém o motor de especificações, documentação de memória técnica e automações locais (skills) para guiar o desenvolvimento do projeto **Cadastro Base** (Angular + SSR v21) com máximo alinhamento técnico e rastreabilidade.

## 📁 Estrutura de Diretórios

```text
.spec/
├── .agents/
│   ├── AGENTS.md             # Regras globais de estilo e comportamento do agente
│   └── skills/               # Automações locais (spec-generator, reviewer, executor, closer, git-delivery)
├── changes/
│   ├── NNN-change-spec.md    # Especificações de mudanças ativas em desenvolvimento
│   └── archive/              # Histórico de especificações de mudanças já concluídas e entregues
├── memory/
│   ├── changelog.md          # Tabela de controle de histórico de entregas concluídas
│   ├── contexto-tecnico.md   # Arquitetura global, stack e padrões técnicos
│   ├── estrutura.md          # Estrutura física de diretórios e convenções de pastas
│   └── produto.md            # Regras de negócio, personas e glossário do produto
├── shared/
│   ├── como-executar.md      # Instruções gerais de preenchimento e evidências
│   └── regras-de-nomenclatura.md # Convenções de sufixos de arquivos (Angular + SSR)
└── templates/
    ├── modelo-base.md        # Template para mudanças técnicas ou infraestrutura
    ├── modelo-crud.md        # Template para criação de CRUDs de novas entidades
    └── modelo-rascunho.md    # Template básico para você rascunhar novas tarefas
```

---

## 🔄 Ciclo de Vida do Desenvolvimento (Passo a Passo)

### 1. Planejamento (Criar a Spec)
1. Escreva o seu rascunho de forma livre em `.spec/changes/tarefa.md` ou `.spec/changes/rascunho.md`.
2. No chat, solicite:
   > _"Gere a especificação com base no rascunho de tarefa.md."_
3. O agente ativará a skill `sdd-spec-generator`, lerá o rascunho e criará a especificação final numerada `.spec/changes/NNN-nome-da-spec.md` baseada nos templates. O rascunho original será preservado intacto.

### 2. Revisão da Spec (Modo `spec`)
1. Antes de iniciar qualquer linha de código, solicite a auditoria no chat:
   > _"Revise a especificação NNN-nome-da-spec.md."_
2. O agente ativará a skill `sdd-reviewer` no modo `spec` para avaliar o alinhamento da especificação, cobertura de cenários de sucesso e erro e o formato do arquivo REST Client (`*.http`). O desenvolvimento só avança após a aprovação da spec.

### 3. Execução (Codificação)
1. Com a spec aprovada, inicie a codificação solicitando no chat:
   > _"Inicie a execução das tarefas da especificação NNN-nome-da-spec.md."_
2. O agente ativará a skill `sdd-executor` para implementar as tarefas em sequência lógica.
3. Para cada alteração, o agente documentará o log de evidências e atualizará o status correspondente:
   - `[ ]` Pendente / Não iniciada.
   - `[~]` Implementada (aguardando você executar testes/build no seu terminal).
   - `[x]` Concluída e validada.
4. **Nota**: O agente não rodará comandos de compilação ou testes locais automaticamente; ele gerará os comandos exatos para você rodar em seu terminal físico e reportar o resultado.

### 4. Revisão da Entrega (Modo `implementation`)
1. Quando todas as tarefas da spec estiverem com status `[x]`, solicite a auditoria de conclusão:
   > _"Revise a implementação da especificação NNN-nome-da-spec.md."_
2. O agente ativará a skill `sdd-reviewer` no modo `implementation` para fazer um double-check comparando a spec com o código gerado no Git, validar se todos os testes existem e garantir que nenhum segredo/chave real de API foi exposto.

### 5. Versionamento (Commit e Push)
1. Com a implementação aprovada, solicite:
   > _"Prepare o commit e faça o push da entrega."_
2. O agente ativará a skill `sdd-git-delivery`, criará a branch e fará o commit no formato Conventional Commits contendo a assinatura de parceria:
   ```text
   feat(modulo): descrição breve da mudança

   Feito por <user.name> usando a IA Antigravity
   ```

### 6. Fechamento e Changelog (Closer)
1. Após subir o código, finalize a entrega solicitando:
   > _"Finalize a entrega da especificação NNN-nome-da-spec.md."_
2. O agente ativará a skill `sdd-delivery-closer`, que:
   - Moverá a spec concluída de `.spec/changes/` para `.spec/changes/archive/`.
   - Adicionará uma linha de registro no histórico de lançamentos em `.spec/memory/changelog.md`.
   - Sincronizará eventuais novas decisões técnicas ou estruturais com os arquivos em `.spec/memory/`.
