# Registro de usuário
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "login": "joao123",
  "password": "minhasenha123"
}

###

# Resposta de sucesso esperada (Status: 201 Created)
# {
#   "success": true,
#   "data": {
#     "id": 1,
#     "name": "João Silva", 
#     "email": "joao.silva@email.com",
#     "login": "joao123"
#   },
#   "message": "User registered successfully"
# }

###

# Resposta de erro - usuário já existe (Status: 409 Conflict)
# {
#   "success": false,
#   "message": "User with this email or login already exists"
# }

###

# Resposta de erro - campos obrigatórios (Status: 400 Bad Request)
# {
#   "success": false,
#   "message": "Missing required fields: name, email, login, password"
# } 