---
name: sdd-spec-generator
description: Cria especificações de software no formato Spec Driven Development (SDD), alinhadas ao produto, à arquitetura, ao código existente e aos templates do projeto.
---

# Gerador de Especificações SDD

Use esta skill quando o usuário solicitar:

- planejamento de uma nova funcionalidade;
- criação de uma especificação;
- detalhamento técnico de uma mudança;
- preparação de tarefas no formato SDD;
- transformação de uma ideia ou requisito em uma spec executável.

O objetivo é produzir uma especificação clara, implementável, testável e alinhada ao contexto real do projeto.

## 1. Compreender a solicitação

Antes de gerar a spec:

1. Identifique:
   - problema que será resolvido;
   - objetivo da mudança;
   - usuários ou sistemas envolvidos;
   - comportamento esperado;
   - regras de negócio conhecidas;
   - restrições;
   - critérios de sucesso.

2. Diferencie requisitos explícitos de suposições.
3. Não invente regras de negócio importantes.
4. Quando houver lacunas, tente resolvê-las por meio:
   - da visão do produto;
   - do código existente;
   - de funcionalidades semelhantes;
   - de padrões já utilizados no projeto.

Solicite esclarecimento somente quando a ausência de informação puder alterar significativamente:

- comportamento funcional;
- regra de negócio;
- modelo de dados;
- contrato de API;
- segurança;
- arquitetura;
- experiência do usuário.

Quando uma decisão de baixo impacto puder ser inferida com segurança, registre-a como uma premissa na spec.

## 2. Alinhamento com o produto

Leia integralmente, quando existirem:

- `memory/produto.md`;
- documentos de domínio;
- glossários;
- specs relacionadas;
- decisões arquiteturais relevantes.

Identifique:

- qual problema do produto será resolvido;
- quais capacidades existentes serão utilizadas;
- quais capacidades serão criadas ou alteradas;
- quais personas ou atores serão impactados;
- quais regras de negócio estão envolvidas;
- se novos termos de linguagem de domínio serão introduzidos;
- se a mudança entra em conflito com alguma decisão anterior.

Utilize os mesmos termos empregados pelo produto e pelo domínio.

Não crie nomes diferentes para conceitos já existentes.

## 3. Análise do contexto técnico

Consulte, quando existirem:

- `memory/contexto-tecnico.md`;
- `memory/estrutura.md`;
- `README.md`;
- `AGENTS.md`;
- arquivos de configuração;
- package managers;
- schemas;
- módulos;
- rotas;
- contratos;
- componentes;
- testes existentes.

Inspecione o código relacionado à funcionalidade antes de definir as tarefas.

Identifique:

- arquitetura utilizada;
- divisão de responsabilidades;
- padrões de domínio;
- organização dos módulos;
- bibliotecas existentes;
- convenções de nomenclatura;
- estratégia de testes;
- tratamento de erros;
- autenticação e autorização;
- persistência;
- integrações externas;
- padrões de interface.

A spec deve se adaptar ao projeto existente. Não proponha uma arquitetura nova sem necessidade explícita.

## 4. Identificação do escopo

A especificação deve possuir seções claras de:

### Objetivo

Descreva o resultado esperado da mudança.

### Contexto

Explique o problema atual e por que a mudança é necessária.

### Escopo

Liste o que será implementado.

### Fora de escopo

Liste explicitamente o que não será implementado nesta mudança.

### Premissas

Registre decisões inferidas que não foram fornecidas diretamente pelo usuário.

### Restrições

Registre limitações técnicas, funcionais ou operacionais.

### Dependências

Liste módulos, serviços, APIs, bibliotecas, equipes ou specs das quais a mudança depende.

## 5. Critérios de aceite

Defina os critérios de aceite antes das tarefas.

Cada critério deve ser:

- específico;
- observável;
- testável;
- relacionado diretamente ao objetivo;
- independente da implementação sempre que possível.

Utilize preferencialmente o formato:

```markdown
- [ ] Dado que [contexto], quando [ação], então [resultado esperado].
```

Inclua:

- fluxo principal;
- validações;
- estados vazios;
- erros esperados;
- permissões;
- comportamentos alternativos relevantes;
- compatibilidade, quando aplicável.

Evite critérios vagos como:

- “deve funcionar corretamente”;
- “deve possuir boa experiência”;
- “deve seguir as melhores práticas”;
- “deve ser performático”.

Quando um requisito não puder ser objetivamente validado, torne-o mensurável ou descreva como será verificado.

## 6. Seleção do template

Consulte os templates disponíveis em `.spec/templates/`.

Selecione o template mais compatível com a mudança.

Exemplos:

- `modelo-crud.md`: cadastros e manutenção de entidades;
- `modelo-base.md`: funcionalidades personalizadas, integrações, melhorias técnicas ou infraestrutura.

Não escolha o template apenas pelo nome da solicitação. Avalie a natureza real da mudança.

Ao utilizar um template:

- preserve sua estrutura obrigatória;
- remova apenas seções explicitamente opcionais e não aplicáveis;
- adapte os exemplos ao contexto real;
- não deixe textos de exemplo, placeholders ou instruções do template no arquivo final.

Caso nenhum template seja adequado, utilize o mais próximo e registre a necessidade de adaptação.

## 7. Nome e localização da especificação

Crie a nova spec em:

```text
.spec/changes/
```

Use o formato:

```text
NNN-kebab-case-da-mudanca.md
```

Exemplo:

```text
001-cadastro-de-clientes.md
```

Para determinar `NNN`:

1. liste os arquivos existentes em `.spec/changes/`;
2. identifique o maior prefixo numérico válido;
3. incremente o número em uma unidade;
4. utilize sempre três dígitos;
5. comece em `001` caso não exista nenhuma spec numerada.

Não reutilize números existentes.

O nome deve representar a mudança de forma objetiva e não deve incluir termos genéricos como:

- `ajustes`;
- `melhorias`;
- `alteracoes`;
- `nova-feature`;
- `diversos`.

## 8. Modelagem da solução

Descreva a solução proposta no nível necessário para orientar a implementação.

Inclua apenas quando aplicável:

- regras de domínio;
- entidades;
- value objects;
- agregados;
- casos de uso;
- contratos;
- endpoints;
- payloads;
- respostas;
- eventos;
- tabelas;
- relacionamentos;
- índices;
- componentes;
- rotas;
- estados de tela;
- permissões;
- integrações;
- tratamento de erros;
- telemetria;
- logs;
- migração de dados.

Não crie camadas, abstrações ou estruturas sem necessidade.

Quando houver alteração em um contrato existente, registre:

- comportamento atual;
- comportamento proposto;
- impacto de compatibilidade;
- consumidores afetados;
- estratégia de transição, quando necessária.

## 9. Escrita das tarefas

As tarefas devem ser:

- claras;
- atômicas;
- executáveis;
- testáveis;
- ordenadas;
- rastreáveis aos critérios de aceite.

Cada tarefa deve representar uma entrega verificável.

Evite tarefas vagas como:

- “fazer o backend”;
- “criar frontend”;
- “ajustar banco”;
- “implementar regra”;
- “adicionar testes”.

Prefira descrições como:

```markdown
- [ ] Criar o caso de uso `CreateCustomer` com validação de e-mail duplicado.
- [ ] Adicionar o endpoint `POST /customers` e mapear erros de domínio para respostas HTTP.
- [ ] Criar o formulário de cadastro com os campos nome, e-mail e telefone.
```

Não inclua múltiplas alterações independentes na mesma tarefa.

### Cenários de teste

Sempre que a especificação envolver regras de negócio, endpoints ou integrações, inclua tarefas de teste compatíveis com a natureza da mudança:

- persistência, controllers e endpoints: testes de integração automatizados;
- fluxos completos críticos: testes end-to-end, quando aplicável;
- APIs HTTP: arquivo REST Client complementar para validação manual e documentação executável, quando útil.

Os cenários devem listar explicitamente, quando aplicável:

- fluxo principal;
- validações de entrada;
- dados ausentes ou inválidos;
- autenticação e autorização;
- conflitos;
- recursos não encontrados;
- indisponibilidade de dependências;
- credenciais incorretas;
- expiração de tokens ou sessões;
- idempotência e repetição de requisições;
- limites e condições de contorno.

O arquivo REST Client pode substituir testes automatizados quando a spec ou o contexto da mudança assim permitir.

Não force a criação de um arquivo HTTP para funcionalidades que não possuam interface HTTP, como:

- consumers de filas;
- tarefas agendadas;
- serviços internos;
- bibliotecas;
- processamentos assíncronos;
- funções sem endpoint.

### Formato REST Client (`*.http`)

Quando a funcionalidade possuir uma interface HTTP e o arquivo REST Client agregar valor à validação manual, inclua uma tarefa para criar ou atualizar um arquivo `*.integration.http`.

O arquivo deve:

- separar as requisições com `###`;
- utilizar variáveis, como `{{host}}` e `{{token}}`;
- conter payloads representativos;
- incluir comentários com o resultado esperado;
- mapear os cenários de sucesso e erro relevantes;
- evitar duplicação desnecessária;
- ser armazenado próximo ao módulo ou conforme a convenção existente no projeto.

Exemplo:

```http
@host = http://localhost:3000
@token = TOKEN_DE_TESTE

### Criar cliente com sucesso
# Expected: 201 Created
POST {{host}}/customers
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Dener",
  "email": "dener@example.com"
}

### Criar cliente sem e-mail
# Expected: 400 Bad Request
POST {{host}}/customers
Authorization: Bearer {{token}}
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

## 10. Organização das tarefas

Organize as tarefas somente nas categorias aplicáveis.

### Tasks — Negócio

Inclua, quando aplicável:
- regras de negócio;
- entidades;
- value objects;
- agregados;
- contratos;
- interfaces;
- casos de uso;
- validações de domínio;
- erros de domínio.

### Tasks — Persistência

Inclua, quando aplicável:
- alteração de schema;
- tabelas;
- colunas;
- relacionamentos;
- índices;
- repositories;
- migrations;
- sincronização do Prisma;
- migração ou transformação de dados.

Não utilize `prisma db push` como substituto automático de migrations em ambientes que exigem histórico versionado.

### Tasks — Back-end

Inclua, quando aplicável:
- controllers;
- rotas;
- DTOs;
- validação de entrada;
- serialização;
- autenticação;
- autorização;
- tratamento de erros;
- integração com casos de uso;
- testes de integração HTTP.

### Tasks — Front-end

Inclua, quando aplicável:
- rotas;
- páginas;
- componentes;
- formulários;
- estados;
- validações;
- serviços;
- clients HTTP;
- feedback visual;
- estados de carregamento;
- estados vazios;
- tratamento de erros;
- responsividade;
- acessibilidade;
- testes.

### Tasks — Integrações

Inclua, quando aplicável:
- clients;
- adapters;
- autenticação externa;
- webhooks;
- filas;
- retries;
- timeouts;
- idempotência;
- tratamento de indisponibilidade.

### Tasks — Validação

Inclua, quando aplicável:
- testes de integração automatizados;
- testes end-to-end;
- arquivos REST Client complementares para APIs HTTP;
- lint;
- typecheck;
- build;
- validação manual de fluxos relevantes.

Diferencie claramente testes automatizados de validações manuais. A execução de um arquivo REST Client pode ser considerada evidência de aprovação quando a spec ou o contexto da mudança assim permitir.

## 11. Ordem das tarefas

Organize as tarefas respeitando dependências técnicas.

A ordem recomendada, quando aplicável, é:

1. contratos e regras de domínio;
2. modelo de dados;
3. persistência;
4. casos de uso;
5. endpoints e integrações;
6. client do front-end;
7. componentes e páginas;
8. testes;
9. validação final.

Não force essa ordem quando a arquitetura do projeto exigir outra sequência.

Quando uma tarefa depender de outra, indique explicitamente:

```markdown
- [ ] Criar o endpoint de cadastro de clientes.
  - Depende de: criação do caso de uso `CreateCustomer`.
```

Evite dependências circulares.

## 12. Requisitos não funcionais

Analise se a mudança exige requisitos relacionados a:

- segurança;
- privacidade;
- performance;
- escalabilidade;
- disponibilidade;
- acessibilidade;
- observabilidade;
- compatibilidade;
- internacionalização;
- auditoria;
- retenção de dados.

Inclua somente os requisitos realmente relevantes.

Não adicione requisitos genéricos apenas para tornar a spec mais extensa.

## 13. Uso de skills técnicas

Recomende skills técnicas somente quando:

- estiverem disponíveis no projeto ou ambiente;
- forem relevantes para uma tarefa específica;
- agregarem instruções além das já presentes na spec.

Formato recomendado:

```markdown
- [ ] Criar o componente de formulário de clientes.
  - Skill recomendada: `angular-component`.
```

Não invente nomes de skills.

Caso nenhuma skill adequada esteja disponível, não inclua recomendação.

A skill recomendada não substitui a descrição completa da tarefa.

## 14. Riscos e decisões

Registre decisões técnicas relevantes, incluindo:

- alternativas consideradas;
- motivo da escolha;
- impactos;
- riscos;
- medidas de mitigação.

Evite registrar decisões triviais.

Quando houver risco ainda não resolvido, indique claramente se ele:

- bloqueia a implementação;
- exige validação;
- pode ser tratado posteriormente;
- está fora do escopo.

## 15. Revisão da especificação

Antes de concluir, verifique se:

- o objetivo está claro;
- o problema está contextualizado;
- o escopo está delimitado;
- o fora de escopo está definido;
- as premissas estão explícitas;
- os critérios de aceite são testáveis;
- a solução está alinhada ao código existente;
- as tarefas são atômicas;
- as tarefas estão ordenadas;
- as dependências estão identificadas;
- todos os critérios de aceite possuem tarefas correspondentes;
- não existem tarefas sem relação com o objetivo;
- não existem placeholders do template;
- o nome e a numeração do arquivo estão corretos;
- as validações necessárias foram incluídas;
- testes automatizados e validações manuais estão claramente diferenciados;
- arquivos REST Client não contêm credenciais ou dados sensíveis reais;
- quando houver rascunho, todos os requisitos relevantes foram mapeados e o arquivo foi preservado com segurança.

## 16. Entrega

Ao finalizar:

1. crie o arquivo da spec em `.spec/changes/`;
2. não implemente a funcionalidade;
3. apresente um resumo contendo:
   - arquivo criado;
   - objetivo;
   - escopo principal;
   - decisões relevantes;
   - quantidade de tarefas;
   - dependências;
   - riscos ou dúvidas pendentes.

## 17. Processamento de rascunhos

Quando o usuário criar ou apontar um arquivo como rascunho de mudança (normalmente em `changes/tarefa.md` ou `changes/rascunho.md`):

1. **Leitura integral**:
   - leia todo o conteúdo do rascunho;
   - identifique requisitos, regras de negócio e restrições;
   - não descarte trechos apenas por parecerem incompletos.

2. **Mapeamento técnico**:
   - analise os arquivos e módulos potencialmente impactados;
   - relacione os requisitos com a estrutura existente.

3. **Conversão**:
   - crie a especificação final numerada em `changes/NNN-nome-da-spec.md` usando o template adequado;
   - mapeie todos os cenários de testes e tarefas correspondentes.

4. **Preservação de Arquivos**:
   - **NÃO exclua**, **NÃO limpe** e **NÃO mova** o arquivo de rascunho. Deixe o arquivo original exatamente onde está e intacto. O usuário gerencia o ciclo de vida e a limpeza do arquivo de rascunho manualmente.

A estrutura recomendada é:

```text
.spec/
├── templates/
├── changes/
└── changes/archive/
```

A geração da spec termina com o planejamento. A implementação deve ser realizada posteriormente por uma skill de execução, como `sdd-executor`.
