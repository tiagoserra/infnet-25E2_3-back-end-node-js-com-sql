# Login de usuário
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "login": "joao123",
  "password": "minhasenha123"
}

###

# Login com email (caso o sistema aceite email como login)
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "login": "joao.silva@email.com",
  "password": "minhasenha123"
}

###

# Resposta de sucesso esperada (Status: 200 OK)
# {
#   "success": true,
#   "data": {
#     "user": {
#       "id": 1,
#       "name": "João Silva",
#       "email": "joao.silva@email.com",
#       "login": "joao123",
#       "type": "aluno"
#     },
#     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "expiresIn": "24h"
#   },
#   "message": "Login successful"
# }

###

# Resposta de erro - credenciais inválidas (Status: 401 Unauthorized)
# {
#   "success": false,
#   "message": "Invalid credentials"
# }

###

# Resposta de erro - campos obrigatórios (Status: 400 Bad Request)
# {
#   "success": false,
#   "message": "Login and password are required"
# }

###

# Exemplo de uso do token em requisições autenticadas
# Após o login, use o token retornado no cabeçalho Authorization:
# Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... 