# ⚙️ VibeEco-Back-End-Users

<p align="center">
  <strong>API de Usuários da plataforma VibeEco</strong>
</p>

---

## 📌 Sobre este repositório

Este repositório contém a **API utilizada pelas funcionalidades destinadas aos usuários** do VibeEco. Ela é consumida pelo **Front-end de Usuários** (web) e pelo **aplicativo Mobile**, e acessa o banco de dados compartilhado.

**Responsável:** Lucas Kolle — [GitHub](https://github.com/Lucas-Kolle)

---

## 🏗️ Posição na arquitetura

```mermaid
flowchart TD
    MOB["📱 VibeEco Mobile"] --> APIU["⚙️ API de Usuários<br/>(este repositório)"]
    FEU["🖥️ Front-end de Usuários"] --> APIU
    APIU --> DB[("🗄️ Banco de Dados")]
```

---

## 🎯 Responsabilidades

- Implementação das regras de negócio;
- Desenvolvimento dos endpoints;
- Integração com o banco de dados;
- Autenticação e autorização;
- Validação das informações;
- Testes da API.

---

## 🧩 Módulos da API

```text
Autenticação → Perfil → Feed → Missões → Desafios → Conteúdos
→ Quiz → Gamificação → Ranking → Recompensas → Notificações → Histórico
```

### 🔐 Acesso

- Autenticação;
- Login;
- Primeiro acesso;
- Alteração de senha;
- Recuperação de senha.

### 🏠 Comunidade e conteúdo

- Perfil;
- Feed;
- Publicações;
- Curtidas;
- Comentários;
- Missões;
- Desafios;
- Conteúdos educativos;
- Quiz.

### 🏆 Gamificação

- XP;
- Níveis;
- Moedas Verdes;
- Conquistas;
- Ranking;
- Recompensas.

### 👤 Conta

- Notificações;
- Histórico de atividades.

---

## 🔌 Endpoints

<!-- TODO: documentar os endpoints reais (método, rota, descrição, autenticação) -->

| Módulo | Método | Rota | Descrição |
|--------|--------|------|-----------|
| Autenticação | `POST` | `/auth/login` | Login do usuário *(exemplo — ajustar)* |
| ... | ... | ... | ... |

---

## ⚙️ Como executar

<!-- TODO: informar linguagem/framework, versões e comandos reais -->

### Pré-requisitos

- `<Linguagem / runtime e versão>`
- Banco de dados do VibeEco em funcionamento (ver [VibeEco-DataBase](https://github.com/pedsousa06-ai/VibeEco-DataBase))

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/pedsousa06-ai/VibeEco-Back-End-Users.git
cd VibeEco-Back-End-Users

# 2. Instalar as dependências
<comando de instalação>

# 3. Configurar as variáveis de ambiente
cp .env.example .env

# 4. Executar a aplicação
<comando de execução>
```

### Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `<DB_HOST>` | Endereço do banco de dados |
| `<DB_NAME>` | Nome do banco |
| `<DB_USER>` / `<DB_PASSWORD>` | Credenciais do banco |
| `<JWT_SECRET>` | Segredo de autenticação *(se aplicável)* |
| `<PORT>` | Porta da API |

---

## 🧪 Testes

- Testes de endpoints;
- Testes de autenticação;
- Testes das regras de negócio;
- Testes de integração;
- Testes de erros e validações.

```bash
<comando para executar os testes>
```

---

## 🔐 Segurança

- Autenticação dos usuários;
- Controle de acesso e permissões;
- Validação dos dados recebidos;
- Proteção das credenciais (nunca versionar o `.env`);
- Comunicação segura entre os componentes.

---

## 📊 Status

🚧 **Em desenvolvimento**

- [ ] Autenticação e acesso
- [ ] Perfil, feed e publicações
- [ ] Missões e desafios
- [ ] Conteúdos e quiz
- [ ] Gamificação, ranking e recompensas
- [ ] Notificações e histórico
- [ ] Integração com o banco
- [ ] Testes

---

## 🌱 Sobre o VibeEco

O **VibeEco** é uma plataforma digital desenvolvida pela **TechProton** para promover a conscientização e o engajamento em sustentabilidade, por meio de conteúdos educativos, missões, desafios, gamificação e interação social.

🔗 **Repositório principal:** [VibeEco](https://github.com/pedsousa06-ai/VibeEco)

### 📦 Repositórios do projeto

| Área | Repositório | Responsável |
|------|-------------|-------------|
| 🗄️ Banco de Dados | [VibeEco-DataBase](https://github.com/pedsousa06-ai/VibeEco-DataBase) | Ryller Feitosa |
| ⚙️ Back-end Usuários | [VibeEco-Back-End-Users](https://github.com/pedsousa06-ai/VibeEco-Back-End-Users) | Lucas Kolle |
| ⚙️ Back-end Administrativo | [VibeEco-Back-End-Adm](https://github.com/pedsousa06-ai/VibeEco-Back-End-Adm) | Lucas Kolle |
| 🖥️ Front-end Usuários | [VibeEco-Front-End-Users](https://github.com/pedsousa06-ai/VibeEco-Front-End-Users) | Gabriel Sousa |
| 🖥️ Front-end Administrativo | [VibeEco-Front-End-Adm](https://github.com/pedsousa06-ai/VibeEco-Front-End-Adm) | Gabriel Sousa |
| 📱 Mobile | [VibeEco-Mobile](https://github.com/pedsousa06-ai/VibeEco-Mobile) | Pedro Sousa |

---

## 📄 Licença

Este projeto foi desenvolvido pela equipe TechProton como parte do projeto VibeEco. Informações sobre licenciamento e distribuição deverão ser definidas pela equipe responsável pelo projeto.

## 👨‍💻 TechProton

| | |
|---|---|
| **Projeto** | VibeEco |
| **Empresa** | TechProton |
| **Categoria** | Tecnologia • Sustentabilidade • Educação |
| **Status** | Em desenvolvimento |
| **Início** | 10/08/2026 |
