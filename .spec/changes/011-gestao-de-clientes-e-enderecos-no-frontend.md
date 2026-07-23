# 011-gestao-de-clientes-e-enderecos-no-frontend

## Objetivo

Desenvolver as interfaces visuais de listagem, busca, criação e edição de clientes (integrando a gestão dinâmica de múltiplos endereços) no portal do Admin no frontend Angular v21.

## Contexto Técnico

- **Frontend:** Angular v21 com componentização avançada e lógica reativa (Signals).
- **Design System:** Estilos Dark Premium com Bootstrap Grid, classes utilitárias em CSS e ícones.
- **Segurança:** Acesso restrito via `adminGuard` nas rotas privadas de administração.

## Referências de Projeto

- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)
- [.spec/shared/diretrizes-de-frontend.md](../shared/diretrizes-de-frontend.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Escopo

- Criação das telas de Gestão de Clientes na área do Admin:
  - Rota `/admin/customers` protegida por `adminGuard`.
  - Página de listagem com tabela paginada, filtros de busca por nome/CPF/telefone, indicador de status (Ativo/Inativo) e ações de edição e desativação.
  - Página de formulário unificado (criação e edição) de clientes com campos: Nome completo (opcional), Telefone (obrigatório) e CPF (opcional).
  - Sub-seção no formulário para gerenciar múltiplos endereços dinamicamente (adicionar, listar, editar e remover endereços em tempo de execução no formulário).
  - Integração com API ViaCEP (via serviço no frontend) para preenchimento automático do endereço ao digitar o CEP.
- Adicionar o item "Clientes" no menu lateral do dashboard do Admin.

## Fora de Escopo

- Gestão de clientes para usuários com roles de clientes ou operacionais (a edição é centralizada no painel do administrador).

## Critérios de Aceite

- [ ] Dado um administrador autenticado, quando acessar `/admin/customers`, então deve visualizar a lista de clientes cadastrados no sistema com paginação e busca por texto.
- [ ] Dado o formulário de criação de cliente pelo administrador, então o sistema deve permitir salvar com sucesso o cliente fornecendo apenas o campo de Telefone (WhatsApp), deixando Nome e CPF como opcionais.
- [ ] Dado o formulário de cliente, ao digitar um CEP válido no sub-formulário de endereços, as informações de logradouro, bairro, cidade (localidade) e UF devem ser preenchidas automaticamente via API de CEP.
- [ ] Dado um formulário de edição de cliente, deve ser possível associar múltiplos endereços a ele e salvá-los com sucesso.
- [ ] Um usuário sem a role `ADMIN` que tentar acessar `/admin/customers` deve ser bloqueado pelo guard de rota e redirecionado para a home.

---

## Tasks

### Tasks — Front-end (Angular)

- [ ] Criar o serviço `CustomerService` em `src/app/modules/auth/services/customer.service.ts`:
  - Métodos para consumir `/api/customers` e `/api/customers/:customerId/addresses`.
  - Integração com a API ViaCEP (`https://viacep.com.br/ws/{cep}/json/`) para consulta de endereço.
- [ ] Adicionar as novas rotas de clientes no arquivo de rotas:
  - Rota de listagem: `/admin/customers` (carrega `CustomerListComponent`).
  - Rota de formulário: `/admin/customers/new` e `/admin/customers/edit/:id` (carrega `CustomerFormComponent`).
- [ ] Criar o componente de listagem `CustomerListComponent` (`src/app/modules/auth/pages/customer-list/`):
  - Tabela com colunas: Nome, E-mail, Telefone, CPF, Status e Ações.
  - Barra de pesquisa para busca dinâmica.
- [ ] Criar o componente de formulário `CustomerFormComponent` (`src/app/modules/auth/pages/customer-form/`):
  - Formulário Reativo contendo os campos de dados básicos do cliente.
  - Sub-seção dinâmica usando `FormArray` para gerenciar a lista de múltiplos endereços do cliente (com campos CEP, Logradouro, Número, Complemento, Bairro, Cidade e UF).
  - Tratamento de estados de carregamento, sucesso e erros de validação (como CPF duplicado).
- [ ] Atualizar o menu lateral (sidebar) em [admin-dashboard.component.html](file:///c:/Users/Troquatte/Documents/Projetos/boilerplate-angular-21-sdd/src/app/modules/auth/pages/admin-dashboard/admin-dashboard.component.html) adicionando o link para a tela de clientes.

### Tasks — Validação

- [ ] Validar manualmente os fluxos no navegador (criar cliente, buscar por CEP, adicionar mais de um endereço, atualizar dados, desativar cliente e verificar a persistência no banco de dados).
- [ ] Executar compilação local e build SSR (`npx ng build`) garantindo ausência de erros no frontend.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
