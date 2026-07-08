<h1 align="center">Forum API — NestJS + DDD + Clean Architecture</h1>

<p align="center">
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
  <img alt="Zod" src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" />
</p>

<p align="center">
  API REST de um fórum de perguntas e respostas, desenvolvida com NestJS aplicando os princípios de
  <strong>Domain-Driven Design (DDD)</strong>, <strong>Clean Architecture</strong> e <strong>SOLID</strong>.
</p>

<p align="center">
  Projeto desenvolvido durante o módulo de NestJS do
  <a href="https://www.rocketseat.com.br/ignite" target="_blank">
    <img alt="Rocketseat" src="https://img.shields.io/badge/Rocketseat-8257E5?style=flat-square&logo=rocket&logoColor=white" />
    Ignite
  </a>
</p>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Testes](#-testes)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Licença](#-licença)

---

## 💡 Sobre o Projeto

Este projeto é uma **API REST de um fórum** com funcionalidades de criação de perguntas, respostas e comentários, com autenticação JWT (RS256). O objetivo principal é demonstrar como aplicar os conceitos de **DDD**, **Clean Architecture** e **SOLID** em uma aplicação real com NestJS.

### O que foi aplicado

- **Clean Architecture** — separação estrita em camadas (Core → Domain → Infrastructure)
- **Domain-Driven Design (DDD)** — entidades, agregados, eventos de domínio e repositórios
- **SOLID** — em especial o Princípio de Inversão de Dependência (DIP) via interfaces/ports
- **Either Pattern** — retorno tipado de sucesso/erro nos casos de uso sem exceções
- **Autenticação JWT RS256** — com chaves assimétricas (RSA 2048-bit)
- **Validação de ambiente** — todas as variáveis são validadas com Zod na inicialização

---

## 🏛️ Arquitetura

O projeto segue a **Clean Architecture**, onde as dependências apontam sempre para dentro — nunca para fora.

```
┌────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  HTTP (Controllers, Presenters, Pipes)                  │   │
│  │  Auth (JWT Strategy, Guard, Decorator)                  │   │
│  │  Database (PrismaService, Repositories, Mappers)        │   │
│  │  Cryptography (BcryptHasher, JwtEncrypter)              │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│                         │ implementa                           │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │                      DOMAIN                             │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Forum / Notification                           │    │   │
│  │  │  ├── enterprise/entities  (Entidades, VOs)      │    │   │
│  │  │  ├── enterprise/events    (Eventos de Domínio)  │    │   │
│  │  │  └── application/         (Casos de Uso)        │    │   │
│  │  │       ├── use-cases/                            │    │   │
│  │  │       ├── repositories/   (Ports/Interfaces)    │    │   │
│  │  │       └── cryptography/   (Ports/Interfaces)    │    │   │
│  │  └─────────────────────┬───────────────────────────┘    │   │
│  │                        │ depende de                     │   │
│  │  ┌─────────────────────▼───────────────────────────┐    │   │
│  │  │                    CORE                         │    │   │
│  │  │  Entity, AggregateRoot, UniqueEntityID          │    │   │
│  │  │  Either (Result Pattern), DomainEvents          │    │   │
│  │  │  WatchedList, ValueObject                       │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

     Fluxo: Controller → Use Case → Domain → Port ← Repository
```

> **Regra de ouro:** nenhum caso de uso importa um repositório concreto ou framework. Apenas interfaces (ports) definidas na camada de domínio.

---

## 🚀 Tecnologias

| Tecnologia                  | Uso                                          |
| --------------------------- | -------------------------------------------- |
| **NestJS 10**               | Framework principal (IoC, DI, Modules)       |
| **TypeScript 5**            | Tipagem estática                             |
| **Prisma 7**                | ORM e migrations                             |
| **PostgreSQL**              | Banco de dados relacional                    |
| **Passport + JWT (RS256)**  | Autenticação com chaves assimétricas         |
| **Bcrypt**                  | Hash de senhas                               |
| **Zod 4**                   | Validação de variáveis de ambiente e DTOs    |
| **Vitest 4**                | Testes unitários e E2E                       |
| **Supertest**               | Testes de integração HTTP                    |
| **Docker / Docker Compose** | Banco de dados local e de testes             |
| **SWC**                     | Compilação rápida (substituto do tsc em dev) |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta         | Versão mínima | Descrição                                 |
| ------------------ | ------------- | ----------------------------------------- |
| **Node.js**        | v22+          | Runtime JavaScript                        |
| **npm**            | v10+          | Gerenciador de pacotes                    |
| **Docker**         | v25+          | Para rodar o PostgreSQL                   |
| **Docker Compose** | v2.20+        | Orquestração dos containers               |
| **OpenSSL**        | v3+           | Para gerar os certificados JWT (RSA 2048) |

---

## 🛠️ Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nest-clean-rocket.git
cd nest-clean-rocket
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com os seus valores:

```bash
cp .env.example .env
```

> Veja a seção [Variáveis de Ambiente](#-variáveis-de-ambiente) para entender cada variável.

### 4. Gere os certificados JWT (RS256)

A autenticação usa RSA 2048-bit. Gere as chaves com OpenSSL:

```bash
# Cria o diretório para os certificados
mkdir -p ./certs

# Gera a chave privada (PKCS#8)
openssl genpkey -algorithm RSA \
  -out ./certs/jwtRS256.key \
  -pkeyopt rsa_keygen_bits:2048

# Extrai a chave pública
openssl rsa -pubout \
  -in ./certs/jwtRS256.key \
  -out ./certs/jwtRS256.key.pub
```

> ⚠️ O diretório `certs/` está no `.gitignore`. Nunca comite chaves privadas.

### 5. Suba o banco de dados

```bash
docker compose up -d
```

### 6. Execute as migrations

```bash
npm run db:migrate
```

### 7. Inicie a aplicação

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Ou modo produção
npm run build && npm run prod
```

A API estará disponível em: **http://localhost:3001**

---

## 🔐 Variáveis de Ambiente

Todas as variáveis são validadas na inicialização com **Zod**. A aplicação falha imediatamente se alguma estiver ausente ou inválida.

### `.env` (desenvolvimento)

| Variável               | Descrição                         | Exemplo                    |
| ---------------------- | --------------------------------- | -------------------------- |
| `NODE_ENV`             | Ambiente de execução              | `development`              |
| `PORT`                 | Porta do servidor HTTP            | `3001`                     |
| `DATABASE_URL`         | URL de conexão com o PostgreSQL   | `postgresql://...`         |
| `POSTGRES_DB`          | Nome do banco de dados            | `nest_clean_rocket`        |
| `POSTGRES_USER`        | Usuário do PostgreSQL             | `postgres`                 |
| `POSTGRES_PASSWORD`    | Senha do PostgreSQL               | `postgres`                 |
| `POSTGRES_PORT`        | Porta do PostgreSQL               | `5432`                     |
| `JWT_PRIVATE_KEY_PATH` | Caminho para a chave privada RSA  | `./certs/jwtRS256.key`     |
| `JWT_PUBLIC_KEY_PATH`  | Caminho para a chave pública RSA  | `./certs/jwtRS256.key.pub` |
| `JWT_EXPIRES_IN`       | Tempo de expiração do token       | `15m`                      |
| `BCRYPT_COST`          | Custo do algoritmo bcrypt (10–14) | `12`                       |

> Use o arquivo [`.env.example`](.env.example) como base.

### `.env.test` (testes E2E)

Arquivo separado utilizado pelos testes de integração. Aponta para um banco de dados isolado (porta `5433`) que roda em container com `tmpfs` (sem persistência de dados).

---

## 📡 Endpoints da API

### Autenticação

| Método | Rota        | Descrição                  | Auth |
| ------ | ----------- | -------------------------- | ---- |
| `POST` | `/accounts` | Registra um novo estudante | ❌   |
| `POST` | `/sessions` | Autentica e retorna um JWT | ❌   |

### Perguntas

| Método | Rota         | Descrição                                   | Auth   |
| ------ | ------------ | ------------------------------------------- | ------ |
| `POST` | `/questions` | Cria uma nova pergunta                      | ✅ JWT |
| `GET`  | `/questions` | Lista as perguntas mais recentes (paginado) | ✅ JWT |

> ✅ **Rotas autenticadas** exigem o header: `Authorization: Bearer <token>`

---

## 🧪 Testes

O projeto possui dois tipos de testes:

### Testes Unitários

Testam os **casos de uso** e **regras de domínio** de forma isolada, usando repositórios in-memory. Nenhuma dependência externa (banco, HTTP) é necessária.

```bash
# Executar todos os testes unitários
npm test

# Modo watch
npm run test:watch
```

### Testes E2E (End-to-End)

Testam o comportamento completo da API via HTTP (controllers → use cases → banco de dados real).
Usam um banco de dados PostgreSQL dedicado, iniciado via Docker.

```bash
# Subir o banco de testes + rodar migrations + executar os testes E2E
npm run test:e2e:int

# Apenas os testes E2E (banco já deve estar rodando)
npm run test:e2e
```

> O banco de testes usa `tmpfs` (memória) para ser totalmente efêmero — os dados são destruídos ao parar o container.

### Comandos auxiliares

```bash
# Subir apenas o container de banco de testes
npm run test:db:up

# Derrubar o container e remover volumes
npm run test:db:down

# Resetar o banco de testes (reaplica todas as migrations)
npm run test:db:reset
```

---

## 📁 Estrutura de Pastas

```
src/
├── core/                         # Abstrações base (agnósticas ao domínio)
│   ├── entities/                 # Entity, AggregateRoot, UniqueEntityID
│   ├── events/                   # DomainEvents, EventHandler
│   ├── repositories/             # Interfaces genéricas de paginação
│   ├── types/                    # WatchedList, ValueObject
│   ├── errors/                   # Erros base (NotAllowedError, ResourceNotFoundError)
│   └── either.ts                 # Either Pattern (Left / Right)
│
├── domain/
│   ├── forum/
│   │   ├── enterprise/
│   │   │   ├── entities/         # Question, Answer, Student, Comment, Attachment...
│   │   │   └── events/           # AnswerCreatedEvent, BestAnswerChosenEvent...
│   │   └── application/
│   │       ├── use-cases/        # CreateQuestion, AnswerQuestion, DeleteAnswer...
│   │       ├── repositories/     # Ports: IQuestionsRepository, IAnswersRepository...
│   │       └── cryptography/     # Ports: IHasher, IEncrypter
│   └── notification/             # Subdomínio de notificações
│
├── infrastructure/
│   ├── auth/                     # JWT Strategy, Guard, CurrentUser decorator
│   ├── crytography/              # BcryptHasher, JwtEncrypter (implementações)
│   ├── database/
│   │   ├── prisma/               # PrismaService, Mappers
│   │   └── repositories/         # Implementações concretas dos repositórios
│   ├── http/
│   │   ├── controllers/          # CreateAccount, Authenticate, CreateQuestion...
│   │   ├── presenters/           # Formatação das respostas HTTP
│   │   └── http.module.ts
│   ├── app.module.ts             # Módulo raiz
│   └── main.ts                   # Bootstrap da aplicação
│
└── env/
    └── env-schema.ts             # Schema Zod para validação das variáveis de ambiente

test/
├── factories/                    # Factories para criação de entidades nos testes
├── repositories/                 # Repositórios in-memory para testes unitários
├── cryptography/                 # Implementações fake de Hasher e Encrypter
└── prisma-test-client.ts         # Cliente Prisma para testes E2E
```

---

## 📜 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Projeto desenvolvido durante o
  <a href="https://www.rocketseat.com.br/ignite">Ignite</a> da
  <a href="https://www.rocketseat.com.br">
    <img alt="Rocketseat" src="https://img.shields.io/badge/Rocketseat-8257E5?style=flat-square&logo=rocket&logoColor=white" />
  </a>
</p>
