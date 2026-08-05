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

- [ ] **AC-01 — Serviço ViaCEP:** `ViaCepService` criado com método `buscarCep` e interface `ViaCepResponse`.
- [ ] **AC-02 — Autocomplete criação:** Ao digitar CEP válido no `formEndereco`, logradouro, bairro, cidade, estado são preenchidos automaticamente.
- [ ] **AC-03 — Autocomplete edição:** Ao digitar CEP válido no `formEnderecoEdit`, mesmo comportamento.
- [ ] **AC-04 — Debounce:** Consulta à API acontece apenas após 500ms de inatividade no campo CEP.
- [ ] **AC-05 — CEP inválido:** CEPs inválidos não preenchem os campos e não geram erro visível.
- [ ] **AC-06 — CEP incompleto:** CEPs com menos de 8 dígitos não disparam a consulta.
- [ ] **AC-07 — Build aprovado:** Build sem erros.
- [ ] **AC-08 — Lint aprovado:** Lint sem erros.

## Tasks

- [ ] **Task 1 — ViaCepService:** Criar serviço e interface para consultar ViaCEP.
- [ ] **Task 2 — Autocomplete criação:** Integrar no `formEndereco` do `ClientesFormComponent`.
- [ ] **Task 3 — Autocomplete edição:** Integrar no `formEnderecoEdit` do `ClientesFormComponent`.
- [ ] **Task 4 — Build e lint:** Validações.

## Resultado Esperado
- Usuário digita CEP no campo, aguarda 500ms, e os campos logradouro, bairro, cidade, estado são preenchidos automaticamente

## Encerramento
Esta spec termina quando o autocomplete de CEP funcionar nos formulários de criação e edição de endereço, e build/lint aprovados.
