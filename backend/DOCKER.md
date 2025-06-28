# Docker Setup

Este projeto utiliza Docker Compose para facilitar o desenvolvimento e execução da aplicação.

## Pré-requisitos

- Docker
- Docker Compose

## Estrutura dos Serviços

### MySQL
- **Imagem**: mysql:8.0
- **Container**: mysql_db
- **Porta**: 3306 (configurável via .env)
- **Dados**: Persistidos em volume `mysql_data`

### Backend Node.js
- **Container**: backend_app
- **Porta**: 3001 (configurável via .env)
- **Modo**: Desenvolvimento com hot reload

## Como usar

### 1. Configurar variáveis de ambiente
Certifique-se de que o arquivo `.env` existe com as seguintes configurações:
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=passwd
DB_NAME=plataforma_cursos
DB_PORT=3306
JWT_SECRET=uma_chave_secreta_super_forte%
```

### 2. Executar a aplicação
```bash
# Subir todos os serviços
docker-compose up

# Subir em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs específicos do backend
docker-compose logs -f backend

# Ver logs específicos do MySQL
docker-compose logs -f mysql
```

### 3. Comandos úteis
```bash
# Parar os serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados do banco)
docker-compose down -v

# Reconstruir as imagens
docker-compose build

# Reconstruir e subir
docker-compose up --build

# Executar comandos no container do backend
docker-compose exec backend npm run build
docker-compose exec backend npm test

# Acessar bash no container do backend
docker-compose exec backend sh

# Acessar MySQL
docker-compose exec mysql mysql -u root -p plataforma_cursos
```

### 4. Scripts de inicialização do banco
Coloque arquivos `.sql` na pasta `init-scripts/` para serem executados automaticamente na primeira inicialização do MySQL.

## Solução de Problemas

### Erro de conexão com banco de dados
- Verifique se o serviço MySQL está saudável: `docker-compose ps`
- Aguarde o health check do MySQL completar antes do backend iniciar

### Erro de porta já em uso
- Altere a porta no arquivo `.env`
- Ou pare outros serviços que estejam usando a mesma porta

### Problema com volumes/dados corrompidos
```bash
# Remove todos os containers e volumes
docker-compose down -v
# Remove imagens
docker-compose down --rmi all
# Inicia novamente
docker-compose up --build
```

## URLs de Acesso

- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **MySQL**: localhost:3306 