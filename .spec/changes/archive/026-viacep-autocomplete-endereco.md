# Autocomplete de Endereço via ViaCEP (API Pública)

## Objetivo

Criar um serviço shared para consultar a API ViaCEP e implementar autocomplete nos campos de CEP do formulário de endereço. Quando o usuário digitar um CEP válido, os campos logradouro, bairro, cidade e estado são preenchidos automaticamente.

## Contexto

O formulário de cliente (specs 024/025) possui campos de endereço (CEP, logradouro, bairro, cidade, estado). A API ViaCEP (https://viacep.com.br/ws/01001000/json/) permite consultar endereços pelo CEP. Precisamos integrar essa API para facilitar o preenchimento dos campos.

## Escopo

### Shared Service
- Criar `src/app/services/viacep/viacep.service.ts` (standalone, injectable)
  - Método `buscarCep(cep: string): Observable<ViaCepResponse>`
  - Faz GET para `https://viacep.com.br/ws/{cep}/json/`
  - Remove hífen do CEP antes de enviar à API
  - Trata CEP inválido: se o retorno tiver `erro: true`, lança erro
  - Interface `ViaCepResponse` com campos: `cep`, `logradouro`, `complemento`, `bairro`, `localidade`, `uf`, `estado`

### Frontend — Formulário de Criação de Endereço
- No `ClientesFormComponent`, ao digitar no campo CEP do `formEndereco`:
  - Usar debounce (500ms) para não chamar API a cada digitação
  - Apenas quando o CEP tiver 8 dígitos numéricos (ex: 07055210)
  - Chama `ViaCepService.buscarCep()`
  - Preenche automaticamente: logradouro, bairro, cidade, estado
  - Se retornar erro (CEP inválido), não preenche nada e pode logar no console

### Frontend — Formulário de Edição de Endereço (inline)
- Mesmo comportamento no `formEnderecoEdit`
- Ao digitar CEP no modo de edição, autocomplete funciona da mesma forma

### Fora de Escopo
- Validação de CEP mais complexa (já tem máscara 00000-000)
- Cache de CEPs consultados
- Fallback para outras APIs de CEP

## Contrato ViaCEP

### Request
```
GET https://viacep.com.br/ws/01001000/json/
```

### Response 200 (sucesso)
```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "complemento": "lado ímpar",
  "unidade": "",
  "bairro": "Sé",
  "localidade": "São Paulo",
  "uf": "SP",
  "estado": "São Paulo",
  "regiao": "Sudeste",
  "ibge": "3550308",
  "gia": "1004",
  "ddd": "11",
  "siafi": "7107"
}
```

### Response 200 (CEP inválido)
```json
{
  "erro": true
}
```

## Dependencias
- `src/app/services/viacep/viacep.service.ts` (novo)
- `src/app/services/viacep/viacep.interface.ts` (novo)
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.ts` (modificar)
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.html` (modificar — apenas se necessário ajustar ids)

## Premissas
- A API ViaCEP é pública, não requer autenticação
- O CEP deve ser enviado sem hífen (ex: 01001000)
- O campo CEP já tem máscara `00000-000`
- O componente já usa `NgxMaskDirective`

## Restricoes
- Usar `debounceTime(500)` para evitar chamadas excessivas
- Apenas consultar quando o CEP tiver 8 dígitos numéricos
- Se a API retornar `erro: true`, não preencher nenhum campo e não mostrar erro ao usuário (silencioso)
- Se o campo já estiver preenchido pelo usuário, o autocomplete pode sobrescrever (aceitável)
- O serviço deve ser standalone e disponível em toda a aplicação (providedIn: 'root')

## Critérios de Aceite

- [x] **AC-01 — Serviço ViaCEP:** `ViaCepService` criado com método `buscarCep` e interface `ViaCepResponse`.
- [x] **AC-02 — Autocomplete criação:** Ao digitar CEP válido no `formEndereco`, logradouro, bairro, cidade, estado são preenchidos automaticamente.
- [x] **AC-03 — Autocomplete edição:** Ao digitar CEP válido no `formEnderecoEdit`, mesmo comportamento.
- [x] **AC-04 — Debounce:** Consulta à API acontece apenas após 500ms de inatividade no campo CEP.
- [x] **AC-05 — CEP inválido:** CEPs inválidos não preenchem os campos e não geram erro visível.
- [x] **AC-06 — CEP incompleto:** CEPs com menos de 8 dígitos não disparam a consulta.
- [x] **AC-07 — Build aprovado:** Build sem erros.
- [x] **AC-08 — Lint aprovado:** Lint sem erros.

## Tasks

- [x] **Task 1 — ViaCepService:** Criar serviço e interface para consultar ViaCEP.
  > ✅ 2026-08-05 — Serviço criado com `fetch` nativo (evita CORS com interceptor de auth). Interface `ViaCepResponse` com todos os campos. Trata `erro: true`.
- [x] **Task 2 — Autocomplete criação:** Integrar no `formEndereco` do `ClientesFormComponent`.
  > ✅ 2026-08-05 — `setupCepAutocomplete` aplicado ao `formEndereco`. Debounce 500ms, filtro 8 dígitos, preenche logradouro, bairro, cidade, estado.
- [x] **Task 3 — Autocomplete edição:** Integrar no `formEnderecoEdit` do `ClientesFormComponent`.
  > ✅ 2026-08-05 — `setupCepAutocomplete` aplicado ao `formEnderecoEdit` com mesmo comportamento.
- [x] **Task 4 — Build e lint:** Validações.
  > ✅ 2026-08-05 — Build e lint aprovados. CEP 07055210 testado manualmente, autocomplete funcionou.

## Desvios e Decisões

- **fetch nativo em vez de HttpClient:** O `authInterceptor` força `withCredentials: true` em todas as requisições do `HttpClient`. O ViaCEP retorna `Access-Control-Allow-Origin: *`, que o browser bloqueia quando credentials estão ativos. Substituiu-se `HttpClient` por `fetch` nativo no `ViaCepService` para evitar o interceptor.

## Resultado Esperado
- Usuário digita CEP no campo, aguarda 500ms, e os campos logradouro, bairro, cidade, estado são preenchidos automaticamente

## Encerramento

> ✅ 2026-08-05 15:35 — Spec revisada, validada e encerrada.

### Validações finais

- `npx ng build --configuration local`: executado com sucesso.
- `npx eslint`: executado com sucesso.
- Teste manual com CEP 07055210: funcionou, preencheu logradouro, bairro, cidade, estado.

### Memória atualizada

- `memory/changelog.md`: adicionada entrada `026`.
- `memory/contexto-tecnico.md`: nenhuma alteração necessária.
- `memory/produto.md`: nenhuma alteração necessária.
- `memory/estrutura.md`: nenhuma alteração necessária.
