# 005-seguranca-e-testes-de-autenticacao

## Objetivo

Implementar políticas de segurança robustas (Rate Limiting, Security Headers e Sanitização) no servidor Angular SSR/Express e criar a suite de testes automatizados para validar a resiliência das 4 especificações anteriores contra vulnerabilidades de segurança e ataques comuns (Brute Force, XSS e Injeções).

## Contexto Técnico

- Limitação de taxa de requisições (`express-rate-limit`) nas rotas de autenticação.
- Cabeçalhos de segurança HTTP configurados através do `helmet`.
- Sanitização básica de payloads de entrada para evitar injeções e poluição de parâmetros.
- Adequação do armazenamento de JWT para cookies `HttpOnly`, `Secure` e `SameSite=Strict` para mitigar ataques XSS.
- Suite de testes automatizados (unitários e de integração HTTP) utilizando ferramentas do ecossistema Node/Express.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)
- [001-modulo-autenticacao](./001-modulo-autenticacao.md)
- [002-refresh-token](./002-refresh-token.md)
- [003-cadastro-protecao-e-logout](./003-cadastro-protecao-e-logout.md)
- [004-reset-de-senha](./004-reset-de-senha.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Observações Locais

- O Rate Limiting deve ser mais restritivo nos endpoints `/api/auth/login`, `/api/auth/register` e `/api/auth/forgot-password` (ex: máximo 5 tentativas por IP a cada 15 minutos).
- Os cookies HTTP contendo os tokens (Access e Refresh) devem conter as flags `httpOnly: true`, `secure: true` (em produção) e `sameSite: 'strict'`.

## Tasks

### Tasks - Negócio

- [ ] Definir a política de mitigação de ataques de força bruta (limiares de bloqueio e tempos de banimento por IP).
- [ ] Definir regras de sanitização de strings e validação estrutural dos payloads recebidos na API de autenticação.

### Tasks - Back-end

- [ ] Integrar a biblioteca `helmet` no servidor Express (`apps/frontend/server.ts`) para aplicar cabeçalhos recomendados pelo OWASP.
- [ ] Implementar middleware de rate limit (`express-rate-limit`) e aplicá-lo especificamente sob o roteador de autenticação `/api/auth/*`.
- [ ] Ajustar os handlers de login, registro e refresh token para assinar e ler os tokens JWT via cookies HTTP-only, removendo o tráfego de tokens pelo corpo (payload) da resposta.
- [ ] Adaptar o middleware `auth.middleware.ts` para ler o `accessToken` a partir dos cookies da requisição.
- [ ] Criar testes automatizados de integração do Express (ex: usando Jest e Supertest) validando:
  - Teste 1: Bloqueio de IP após exceder o limite de requisições de login (Rate Limit - `# Expected: 429 Too Many Requests`).
  - Teste 2: Presença dos cabeçalhos CSP (Content Security Policy) e XSS Auditor nas respostas de API.
  - Teste 3: Rejeição de requisições com payloads contendo injeções de scripts maliciosos ou caracteres de controle (Sanitização - `# Expected: 400 Bad Request`).
  - Teste 4: Garantia de que os tokens são gerados com a flag `HttpOnly` ativa nos cabeçalhos `Set-Cookie`.
- [ ] Atualizar o arquivo REST Client `apps/frontend/src/server/auth.integration.http` estruturado com divisores `###`, uso de variáveis e comentários dos retornos HTTP esperados, cobrindo:
  - Cenário 1: Testar o disparo do Rate Limiting disparando 6 chamadas de login seguidas de forma rápida (`# Expected: 429 Too Many Requests`).
  - Cenário 2: Validar o retorno dos cookies seguros (`Set-Cookie`) contendo `HttpOnly` e `SameSite=Strict` no login bem-sucedido (`# Expected: 200 OK`).

### Tasks - Validação

- [ ] Solicitar ao usuário a instalação de pacotes de segurança necessários no terminal (ex: `npm install helmet express-rate-limit cookie-parser` e seus `@types` correspondentes).
- [ ] Solicitar ao usuário a execução da suite de testes automatizados de integração e a validação do arquivo `auth.integration.http`.

## Resultado Esperado

- Servidor Express do Angular SSR protegido por `helmet` e `express-rate-limit`.
- Fluxo de tokens migrado para cookies seguros `HttpOnly`.
- Suite de testes de segurança cobrindo Brute Force, Headers e Sanitização passando com sucesso.
- Cenários testados no Rest Client.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
