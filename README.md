# 📚 Sistema de Gestão Acadêmica

Sistema completo de gestão acadêmica desenvolvido como parte da avaliação do curso **Full Stack com Node.js e SQL** do Instituto Infnet (25E2-3).

## 🎯 Sobre o Projeto

Este é um sistema completo de gestão acadêmica que permite o gerenciamento de usuários, cursos e matrículas. O projeto implementa uma arquitectura full-stack moderna com React.js no frontend e Node.js/TypeScript no backend, utilizando MySQL como banco de dados e Redis para cache.

### 👥 Tipos de Usuário

- **👨‍🎓 Aluno**: Pode visualizar cursos e se matricular/cancelar matrículas
- **👨‍🏫 Professor**: Pode visualizar cursos (sem possibilidade de matrícula)
- **👨‍💼 Admin**: Acesso completo incluindo gerenciamento de usuários

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL 8.0** - Banco de dados principal
- **Redis** - Cache e sessões
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Docker** - Containerização

### Frontend
- **React 19** com **TypeScript**
- **Redux Toolkit** - Gerenciamento de estado
- **React Router** - Roteamento
- **Bootstrap 5** - UI Framework
- **React Bootstrap** - Componentes
- **Axios** - Cliente HTTP
- **Vite** - Build tool

## 🏗️ Arquitetura do Projeto

### Backend (Layered Architecture)
```
backend/
├── src/
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Camada de dados
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Definição de rotas
│   ├── middlewares/     # Middlewares customizados
│   └── utils/           # Utilitários
├── config/              # Configurações
└── init-scripts/        # Scripts de inicialização do DB
```

### Frontend (Component-Based)
```
frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── store/           # Redux store e slices
│   ├── services/        # Serviços de API
│   ├── hooks/           # Custom hooks
│   └── types/           # Definições TypeScript
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18+)
- **npm** ou **yarn**
- **MySQL 8.0**
- **Redis**
- **Docker** (opcional)

### 🐳 Opção 1: Docker (Recomendado)

1. **Clone o repositório**:
```bash
git clone https://github.com/tiagoserra/infnet-25E2_3-back-end-node-js-com-sql.git
cd infnet-25E2_3-back-end-node-js-com-sql
```

2. **Configure o ambiente**:
```bash
cd backend
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

3. **Execute com Docker**:
```bash
cd backend
docker-compose up -d
```

O backend estará rodando em `http://localhost:3001`

4. **Execute o frontend**:
```bash
cd ../frontend
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 💻 Opção 2: Instalação Manual

#### Backend

1. **Configure MySQL e Redis localmente**

2. **Instale as dependências**:
```bash
cd backend
npm install
```

3. **Configure o ambiente**:
```bash
cp .env.example .env
# Edite as configurações de banco e Redis
```

4. **Execute as migrações** (crie o banco manualmente e execute o script):
```sql
-- Execute o conteúdo de backend/init-scripts/01_init.sql
```

5. **Execute o backend**:
```bash
npm run dev
```

#### Frontend

1. **Instale as dependências**:
```bash
cd frontend
npm install
```

2. **Execute o frontend**:
```bash
npm run dev
```

## 🎮 Como Usar

### 1. **Registro e Login**
- Acesse `http://localhost:5173`
- Registre-se como novo usuário ou faça login
- Por padrão, novos usuários são criados como "aluno"

### 2. **Como Aluno**
- Visualize cursos disponíveis na Home
- Inscreva-se em cursos
- Acesse "Meus Cursos" para gerenciar suas matrículas
- Cancele matrículas se necessário

### 3. **Como Admin**
- Acesse "Gerenciar Usuários" no menu
- Crie, edite e exclua usuários
- Busque usuários por nome ou email
- Altere tipos de usuário (aluno/professor/admin)

### 4. **Como Professor**
- Visualize todos os cursos disponíveis
- Não pode se matricular (apenas visualização)

## 🔐 Usuário Admin Padrão

Para testar funcionalidades de admin, você pode:

1. **Registrar um usuário comum**
2. **Conectar diretamente no MySQL e alterar o tipo**:
```sql
UPDATE users SET type = 'admin' WHERE email = 'seu@email.com';
```

Ou criar via API (se tiver acesso de admin):
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "login": "admin",
    "password": "admin123",
    "type": "admin"
  }'
```

## 🛡️ Funcionalidades de Segurança

- **Autenticação JWT** com middleware de proteção
- **Autorização baseada em roles** (admin/professor/aluno)
- **Hash de senhas** com bcrypt
- **Rate limiting** para APIs
- **Validação de dados** em todas as entradas
- **Middleware de logging** para auditoria

## 📊 Funcionalidades Implementadas

### ✅ Autenticação e Autorização
- [x] Sistema de login/registro
- [x] JWT tokens
- [x] Middleware de autenticação
- [x] Controle de acesso por tipo de usuário

### ✅ Gestão de Usuários (Admin)
- [x] CRUD completo de usuários
- [x] Busca por nome e email
- [x] Interface administrativa
- [x] Controle de tipos de usuário

### ✅ Gestão de Cursos
- [x] Listagem de cursos
- [x] Visualização para todos os tipos
- [x] Sistema de matrículas (alunos)
- [x] Interface responsiva

### ✅ Sistema de Matrículas
- [x] Inscrição em cursos
- [x] Cancelamento de matrículas
- [x] Histórico de matrículas
- [x] Status de matrícula

### ✅ Cache e Performance
- [x] Redis para cache de usuários
- [x] Cache de queries frequentes
- [x] Otimização de consultas

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev        # Executa em desenvolvimento
npm run build      # Compila TypeScript
npm start          # Executa versão compilada
npm test           # Executa testes (pendente)
```

### Frontend
```bash
npm run dev        # Executa em desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # Executa linting
```

## 🗂️ Estrutura do Banco de Dados

### Tabelas Principais
- **users**: Usuários do sistema (aluno/professor/admin)
- **courses**: Cursos disponíveis
- **enrollments**: Matrículas dos alunos

### Relacionamentos
- `users` 1:N `enrollments`
- `courses` 1:N `enrollments`

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de aluno

### Usuários (Admin apenas)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário

### Cursos
- `GET /api/courses` - Listar cursos

### Matrículas
- `GET /api/enrollments/my-courses` - Cursos do usuário
- `POST /api/enrollments` - Nova matrícula
- `PUT /api/enrollments/:id/cancel` - Cancelar matrícula

## 🎨 Design e UX

- **Responsivo** - Funciona em desktop, tablet e mobile
- **Bootstrap 5** - Design system consistente
- **Ícones** - Bootstrap Icons
- **Feedback Visual** - Alerts, spinners e estados de loading
- **Navegação Intuitiva** - Menu contextual por tipo de usuário

## 📱 Características do Frontend

- **SPA (Single Page Application)** com React Router
- **Estado Global** gerenciado com Redux Toolkit
- **Componentes Reutilizáveis** e modulares
- **TypeScript** para type safety
- **Interceptors Axios** para tratamento de erros
- **Lazy Loading** e otimizações de performance

## 🔄 Características do Backend

- **Arquitetura em Camadas** (Controller → Service → Repository)
- **Classes Base** para reutilização de código
- **Middleware Stack** completo
- **Error Handling** centralizado
- **Logging** de requisições
- **Validação** de dados

## 👨‍💻 Desenvolvedor

**Tiago Serra**
- GitHub: [@tiagoserra](https://github.com/tiagoserra)
- Curso: Full Stack - Instituto Infnet (25E2-3)
- Disciplina: Back End com Node.js e SQL

## 📄 Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

**🎓 Projeto Acadêmico - Instituto Infnet 2025**

> Este projeto foi desenvolvido como parte da avaliação do curso de Full Stack, demonstrando conhecimentos em desenvolvimento web moderno, arquitetura de software e boas práticas de programação.