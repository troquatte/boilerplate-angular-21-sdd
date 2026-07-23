# 004-reset-de-senha

## Objetivo

Implementar o fluxo de recuperação e redefinição de senha no backend do servidor Angular SSR v21, utilizando tokens temporários seguros associados aos registros dos usuários.

## Contexto Técnico

- Endpoint `POST /api/auth/forgot-password` para solicitação de redefinição de senha.
- Endpoint `POST /api/auth/reset-password` para atualização da senha usando o token de redefinição.
- Banco de dados simulado (`users-db.json`) adaptado para armazenar o token de redefinição (`passwordResetToken`) e sua expiração (`passwordResetExpires`).
- Envio de e-mail simulado com link impresso diretamente no console do servidor.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)
- [001-modulo-autenticacao](./001-modulo-autenticacao.md)
- [003-cadastro-protecao-e-logout](./003-cadastro-protecao-e-logout.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Observações Locais

- O token de reset de senha terá validade de 1 hora.
- Ao atualizar a senha com sucesso, o token e sua expiração correspondente devem ser limpos do registro do usuário, e todos os refresh tokens ativos desse usuário devem ser removidos para forçar reautenticação geral.

## Tasks

### Tasks - Negócio

- [ ] Criar o caso de uso `ForgotPasswordUseCase` para gerar o token temporário, salvá-lo no usuário e simular o envio.
- [ ] Criar o caso de uso `ResetPasswordUseCase` para validar o token temporário, atualizar a senha de usuário com hash do `bcryptjs` e revogar as sessões ativas (refresh tokens).

### Tasks - Back-end

- [ ] Atualizar o schema simulado dos dados de usuário para contemplar os campos `passwordResetToken` e `passwordResetExpires`.
- [ ] Criar o validador para a rota de solicitação (`forgot-password.validator.ts`) exigindo e-mail em formato correto.
- [ ] Criar o validador para a rota de redefinição (`reset-password.validator.ts`) exigindo o token de reset e a nova senha com no mínimo 6 caracteres.
- [ ] Implementar o handler `/api/auth/forgot-password` (`POST`) vinculando-o ao `ForgotPasswordUseCase`.
- [ ] Implementar o handler `/api/auth/reset-password` (`POST`) vinculando-o ao `ResetPasswordUseCase`.
- [ ] Atualizar o arquivo REST Client `apps/frontend/src/server/auth.integration.http` estruturado com divisores `###`, uso de variáveis e comentários dos retornos HTTP esperados, incluindo:
  - Cenário 1: Solicitar reset de senha com e-mail cadastrado e ativo (`# Expected: 200 OK`).
  - Cenário 2: Solicitar reset com e-mail não cadastrado (`# Expected: 404 Not Found`).
  - Cenário 3: Redefinir senha com token ativo válido e nova senha maior ou igual a 6 caracteres (`# Expected: 200 OK`).
  - Cenário 4: Redefinir senha com token expirado ou inválido (`# Expected: 400 Bad Request`).
  - Cenário 5: Redefinir senha com nova senha inválida (menos de 6 caracteres) (`# Expected: 400 Bad Request`).

### Tasks - Validação

- [ ] Solicitar ao usuário a execução do servidor Angular SSR e validação manual do fluxo de reset usando o arquivo `auth.integration.http`.

## Resultado Esperado

- Rotas `/api/auth/forgot-password` e `/api/auth/reset-password` funcionando.
- Impressão do link/token de recuperação no console do servidor.
- Atualização segura de senhas criptografadas no banco JSON simulado.
- Cenários validados no Rest Client.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
