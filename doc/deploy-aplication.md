# 🚀 Documentação Oficial de Deploy (Standalone)

_Este manual descreve o passo a passo exato para provisionar as VPS de modo independente (Standalone). Ao abandonar arquiteturas complexas de Swarm, garantimos máxima performance de rede, simplicidade no dia a dia e eliminação total de conflitos na geração de certificados SSL._

Admin: admin
Senha: Pamonhapamonha.191

---

## 🎯 Fase 1: Fundação e Nuvem

### 1.1 ☁️ Apontamentos de DNS (Cloudflare)

Antes de tocar no servidor, você precisa direcionar o tráfego da internet para ele.
No painel do Cloudflare (ou no seu provedor de domínio), crie os seguintes registros, lembrando de **desativar o Proxy (nuvem laranja)** para não bloquear a autogeração do Let's Encrypt:

| Tipo | Nome (Host) | Valor (Destino)     | Status Proxy |
| ---- | ----------- | ------------------- | ------------ |
| `A`  | `*`         | `IP_DA_SUA_VPS_DEV` | DNS Only ⚪  |
| `A`  | `www.*`     | `IP_DA_SUA_VPS_DEV` | DNS Only ⚪  |

> **Nota:** O Cloudflare aceita apenas _um_ registro do tipo curinga (`*`). Para ambientes de Produção e Dev separados, crie subdomínios específicos (ex: `*.dev` apontando para a máquina de desenvolvimento).

---

### 1.2 🐧 Preparação da Máquina Linux (Ubuntu 22.04+)

Acesse sua VPS via SSH (Recomendamos o **Terminus**) e prepare o sistema operacional para receber a orquestração moderna do Docker e suas dependências.

```bash
# 1. Atualizar Kernel e Pacotes de Segurança
sudo apt update && sudo apt upgrade -y

# 2. Instalar o Motor do Docker nativo
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Instalar o Plugin Oficial do Compose Standalone
sudo apt-get install docker-compose-plugin -y

# 4. Limpar fábrica e resetar possíveis fantasmas (Apenas em máquina nova)
docker system prune -a --volumes -f
sudo reboot
```

---

## 🛡️ Fase 2: Plataforma de Gestão (Traefik + Portainer)

### 2.1 🚢 Injeção do Roteador Core

Esqueça a complexidade. A base da sua aplicação (O Traefik Roteador + O painel gráfico do Portainer) nascerá de um único arquivo.

1. Conectado na VPS, suba o nosso arquivo `000-docker-standalone.compose.yml` para a pasta raiz (ou crie-o usando o `nano`).
2. Ligue o coração do servidor com o comando abaixo (que inicializa o modo detach):

```bash
docker-compose -f 000-docker-standalone.compose.yml up -d
```

🔥 **As chaves do castelo acabam de ser entregues!**
Acesse imediatamente as URLs protegidas por SSL:
👉 *https://portainer.vidafullstack.academy*

> ⏱️ **Timer de Segurança (5 Minutos):** Por precaução, o Portainer te dá apenas 5 minutos após ligar para você criar o usuário e senha (User: `admin`). Caso perca esse tempo, a tela de erro "404 page not found" aparecerá. Se isso acontecer, basta reiniciar seu portainer usando `docker restart portainer` direto no linux.

---

## 🗄️ Fase 3: Bancos de Dados e Ferramentas (Via Portainer)

Nesta fase, você **não precisa mais do terminal Linux**. Tudo acontece de forma incrivelmente visual e fácil dentro do Portainer, na aba `Stacks > Add stack > Web editor`.

### 3.1 🔑 Integrando o GitHub (Acesso GHCR)

Para o Portainer conseguir baixar seu app Angular (que é privado na nuvem), nós precisamos fornecer um passe livre de leitura.

1. No seu Github, vá em: **Settings > Developer settings > Personal access tokens > Tokens (classic)**.
2. Gere um novo token marcando a caixa `read:packages`. Copie o segredo.
3. No painel do **Portainer**, vá em **Registries > Add registry**.
4. Selecione **Custom registry** e preencha:
   - **Name:** `Github GHCR`
   - **Registry URL:** `ghcr.io`
   - **Authentication:** Ative (On)
   - **Username:** Seu usuário do github
   - **Password:** Seu Token secreto copiado no passo 2.

### 3.2 🐘 Instalação: PostgreSQL (O Banco Relacional)

- Abra a Stacks, crie uma chamada `postgres`.
- Cole o código do arquivo `docker-portainer-postgres.dev.compose.yml` e acione o **Deploy**.
- O banco de dados iniciará em alta performance, mapeando a porta 15432 externamente para o acesso via PGAdmin, DBeaver ou sua API.

### 3.3 📦 Instalação: MinIO (Storage S3)

- Crie a Stack `minio` no Portainer.
- Cole o código do arquivo `docker-portainer-minio.dev.compose.yml` e acione o **Deploy**.
- **Links Mágicos:** Acesse pelo painel web dele com certificado SLL ativo em *https://minio-dev.vidafullstack.academy* (A API S3 usará _s3-dev_).

### 3.4 ⚡ Instalação: Redis & Insight (Cache in-memory)

- Crie a Stack `redis` no Portainer.
- Cole o código do arquivo `docker-portainer-redis.dev.compose.yml` e acione o **Deploy**.
- O painel **RedisInsight** brilhará na internet protegido através de *https://insight-dev.vidafullstack.academy*.

### 3.5 💬 Instalação: Evolution API (WhatsApp/Gerenciamento)

A Evolution API é nosso motor de disparo e escuta de webhooks do WhatsApp, que se integrará ativamente ao nosso Banco de Dados (`postgres` externo do Portainer) e sistema de Caches (`redis`).

- Crie uma Stack chamada `evolution`.
- Cole o respectivo código (`docker-portainer-evolution-api.dev.compose.yml` ou `.prod.compose.yml`).
- A API irá inicializar validando o banco e ficará exposta com certificado SSL próprio: *https://evolutionapi-dev.vidafullstack.academy* ou *https://evolutionapi.vidafullstack.academy* na porta primária `8080`.
- **Credenciais Fixas (Dev):**
  - Host Postgres: `postgres-dev` com a senha `@Pamonhapamonha191_`
  - Chave de Autenticação API Padrão (`AUTHENTICATION_API_KEY`): `5d4607af1082516ae707d0702d59fb41` (Lembre-se de mudar isso imediatamente em produção dentro da variável de ambiente no Portainer).

> ⚠️ A Evolution API está desenhada para rodar em modo Multi-Database do Redis usando o Index `#1` em Dev. Caso note algum conflito com instâncias de Cache, você pode mapear `CACHE_REDIS_URI` com o final `/2` no painel do Portainer.

### 3.6 🤖 Instalação: n8n (Automação de Fluxos)

Em conjunto a stack da Evolution API, temos incluso o contêiner nativo para rodar o **n8n**, nosso motor low-code para interligar os Webhooks do WhatsApp com outras chamadas e integrações do sistema.

- Ele e o seu banco postgresSQL (`n8n_postgres`) são inicializados paralelamente dentro dos arquivos `docker-portainer-evolution-api` (Dev e Prod).
- Suba as instâncias normalmente com o compose.
- A URL com SSL gerado pela nuvem responderá em *https://n8n-dev.vidafullstack.academy* ou *https://n8n.vidafullstack.academy*.
- O Setup primário do Admin solicitará criação e definição de nova senha no seu **primeiro acesso à interface visual**. Guarde-a de forma segura em seu cofre local.
- As integrações e variáveis globais já possuem as URLs amarradas aos webhooks de domínio (Ex: `WEBHOOK_GLOBAL_URL=https://n8n.vidafullstack.academy/webhook/evolution`).

---

## 🚀 Fase 4: DevOps e Deploy Automático (Aplicação Angular)

Como nossa infraestrutura está limpa, subir seu aplicativo vira um trabalho simples e padronizado na integração contínua (CI/CD):

### 4.1 🐳 Criação de Artefatos no GitHub

1. Mantenha os seus `Dockerfile` sempre rigorosamente tipados conforme nossos padrões para DEV ou PROD.
2. Comite seu código configurado e empurre para a `main`/`dev`.
3. Garanta que no GitHub existe a rotina Actions (`.github/workflows/docker-main.yml`) que usará o Segredo Global do repositório para publicar sua imagem fresca no GitHub Container Registry (GHCR).

### 4.2 🏗️ Primeira Subida Limpa no Portainer

1. No Portainer, acesse **Stacks > Add stack > Web editor**.
2. De o nome para sua aplicação (ex: `angular-app-dev`).
3. Cole o arquivo Compose final (ex: `docker-portainer-angular.dev.compose.yml`).
4. **O Pulo do Gato:** Logo acima do botão azul "Deploy The Stack", clique no menu _Registry_ e alterne de _Anonymous_ para o seu **Github GHCR** criado na seção 3.1!
5. Pressione **Deploy The Stack**. O app subirá lindo com cadeado e auto-roteamento no link *https://app-dev.vidafullstack.academy* !

### 4.3 🔄 Configurando o Auto-Deploy Contínuo (Mágica Webhook)

Para que você nunca mais precise ir ao Portainer reiniciar o app quando lançar atualizações no código fonte:

1. No **Portainer** → Abra sua aplicação criada em `Stacks` → Selecione a aplicação (`vfs-app-ssr`) → Encontre a guia **Webhooks**.
2. **Ative (Enable)** o Webhook e copie a URL estranha gerada (Ex: `https://portainer.seusite.com/api/webhooks/xxxx`).
3. Vá no **GitHub** do seu App → Aba **Settings** → **Secrets and variables** → **Actions**.
4. Crie um novo `Repository secret`:
   - **Nome:** `PORTAINER_WEBHOOK_URL`
   - **Valor:** _(Cole a URL do passo 2)_.
5. Em seu arquivo de Actions (`.github/workflows/docker-main.yml`), descomente/insira a etapa final:
   ```yaml
   - name: Faz o Redeploy da Imagem nova no Portainer via Webhook
     run: curl -fsSL -X POST "${{ secrets.PORTAINER_WEBHOOK_URL }}"
   ```

🎉 **Pronto!** A partir de agora, cada Commit na sua máquina fará o GitHub compilar a imagem, enviar para o Registry seguro dele mesmo, e em seguida apertar o botão secreto mágico da sua VPS Hostinger que derruba a imagem velha e sobe o seu sistema com o código novo em menos de 1 segundo!

---

### 4.4 ⚡ Otimização em Produção (Proxy de Estáticos com Nginx)

Por padrão, o servidor Node.js Express realiza tanto a renderização das páginas dinâmicas (SSR) quanto o serviço de arquivos estáticos compilados (JS, CSS, imagens e fontes de `browser/`). Em ambientes de produção com tráfego elevado, isso sobrecarrega a CPU do processo Node.

Para otimizar a performance, é recomendável posicionar um servidor **Nginx** na frente do container Express atuando como proxy reverso e servidor direto de arquivos estáticos:

1. **Configuração do Nginx**: O arquivo de exemplo de configuração em [nginx.conf](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/doc/nginx/nginx.conf) realiza:
   * Serviço direto da pasta `/usr/share/nginx/html` (onde ficam os arquivos estáticos compilados da pasta `browser`).
   * Configuração agressiva de compressão (Gzip) e cabeçalhos de Cache (`Cache-Control: public, max-age=31536000`).
   * Proxy reverso das rotas `/api` e páginas dinâmicas (`@ssr`) para o container Express (`vfs-app-ssr:4000`).

2. **Docker Compose Otimizado**:
   Mapeie o container do Nginx compartilhando o volume dos estáticos da aplicação e configurando o Traefik para bater as conexões no Nginx (porta `80`) em vez de bater diretamente no Express.

