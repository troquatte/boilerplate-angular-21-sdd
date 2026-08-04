# Formulário de Criação de Cliente (Front)

## Objetivo

Criar a página de formulário para cadastro de novos clientes no dashboard admin, com máscaras de input e layout responsivo, sem integração com backend.

## Contexto

A listagem de clientes (spec 013/017) possui um botão "Novo cliente" sem ação. Precisamos de uma tela de formulário para criar clientes, seguindo o design system existente e utilizando `ngx-mask` (já instalado globalmente).

## Escopo

- Criar componente `ClientesCreateComponent` em `pages/clientes-create/`
- Adicionar rota `create` no `admin-clientes.router.ts`
- Formulário com `ReactiveFormsModule` + `FormBuilder` + `Validators`
- Máscaras via `ngx-mask` (diretiva `mask`)
- Layout responsivo com grid do design system (col-md-4, col-md-8, col-md-12)
- Botão "Salvar" (desabilitado se formulário inválido)
- Botão "Voltar" (navega para listagem)
- Exibir mensagem de sucesso (mock/toast) ao submeter — sem chamada API real

## Fora de Escopo

- Integração com backend (POST /api/dashboard/clientes) — será spec separada
- Edição de cliente (update) — será spec separada
- Validações customizadas avançadas (apenas required, email, pattern básicos)

## Layout dos Campos

| Campo | Máscara | Classes | Validadores |
|---|---|---|---|
| Telefone | `00 0 0000-0000` | col-md-4 | `required` |
| CPF | `000.000.000-00` | col-md-8 | — |
| Nome completo | — | col-md-12 | — |
| E-mail | — | col-md-12 | — |
| Data de Nascimento | `00/00/0000` | col-md-4 | — |
| Tipo de cliente | Select | col-md-8 | — |

**Tipos de cliente (select/options):**
- `Primeira Compra` (default selecionado)
- `Nova Compra`
- `Cliente VIP`
- `Influenciador`

## Premissas

- `ngx-mask` já configurado globalmente em `app.config.ts` via `provideEnvironmentNgxMask`.
- Data de nascimento é exibida com máscara `00/00/0000` no frontend; será enviada como `Date` (ISO string) para o backend e convertida de volta para o formato brasileiro ao receber do backend (na spec de integração).

## Dependencias

- `src/app/modules/dashboard-admin/modules/clientes/admin-clientes.router.ts`
- `src/app/modules/dashboard-admin/modules/clientes/interfaces/clientes.interface.ts`
- `ngx-mask` (já configurado globalmente em `app.config.ts`)
- `NgxMaskDirective` (import obrigatório no componente standalone)
- `ReactiveFormsModule`, `FormBuilder`, `Validators`

## Critérios de Aceite

- [x] **AC-01 — Rota criada:** `/admin/clientes/create` renderiza o formulário.
- [x] **AC-02 — Layout:** Campos dispostos conforme grid especificado (col-md-4/8/12).
- [x] **AC-03 — Máscaras:** Telefone, CPF e Data de Nascimento possuem máscaras funcionais.
- [x] **AC-04 — Validação:** Telefone obrigatório exibe erro visual quando vazio/tocado.
- [x] **AC-05 — Select default:** "Primeira Compra" pré-selecionado no campo Tipo.
- [x] **AC-06 — Botão Salvar:** Desabilitado quando formulário inválido (telefone vazio).
- [x] **AC-07 — Botão Voltar:** Navega para `/admin/clientes`.
- [x] **AC-08 — Submit mock:** Ao salvar, exibe Swal de sucesso e navega para listagem. Sem chamada API.
- [x] **AC-09 — Build aprovado:** Build sem erros.
- [x] **AC-10 — Lint aprovado:** Lint sem erros.

## Tasks

- [x] **Task 1 — Criar componente:** `ClientesCreateComponent` standalone com imports necessários.
  > ✅ 2026-08-04 — Componente criado em `pages/clientes-create/`. Imports: `ReactiveFormsModule`, `NgxMaskDirective`.
- [x] **Task 2 — Formulário reativo:** `FormGroup` com todos os campos, validadores, e getters.
  > ✅ 2026-08-04 — Apenas `phone` é `required`. Demais campos opcionais. `tipo` default: `Primeira Compra`.
- [x] **Task 3 — Template HTML:** Layout com grid, máscaras ngx-mask, select, botões Salvar/Voltar.
  > ✅ 2026-08-04 — Container bootstrap, placeholders nos inputs, máscaras aplicadas.
- [x] **Task 4 — Estilos:** SCSS mínimo seguindo design system (reutilizar classes existentes).
  > ✅ 2026-08-04 — Apenas `clientes-form__actions` customizado. Grid via bootstrap.
- [x] **Task 5 — Rota:** Adicionar `create` path em `admin-clientes.router.ts`.
  > ✅ 2026-08-04 — Rota `create` com lazy load do componente.
- [x] **Task 6 — Link da listagem:** Botão "Novo cliente" em `clientes-list.component.html` navega para `/admin/clientes/create`.
  > ✅ 2026-08-04 — `routerLink="/admin/clientes/create"` adicionado.
- [x] **Task 7 — Build e lint:** Validações.
  > ✅ 2026-08-04 — Lint e build aprovados.

## Resultado Esperado

- Tela `/admin/clientes/create` funcional com formulário completo
- Máscaras aplicadas corretamente
- Validação visual ativa
- Navegação entre listagem e create funcionando
- Sem integração backend (dados submetidos apenas no console)

## Encerramento

Esta spec termina quando o formulário estiver funcional no browser, navegável pela listagem, e build/lint aprovados. A integração com backend será tratada em spec separada.
