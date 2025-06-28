# Sistema de Cache com Redis

Este documento descreve o sistema de cache implementado no projeto, utilizando Redis como backend de cache.

## 📋 Visão Geral

O sistema de cache foi implementado para melhorar a performance da aplicação, reduzindo consultas desnecessárias ao banco de dados e fornecendo respostas mais rápidas aos usuários.

## 🏗️ Arquitetura

### Componentes Implementados

1. **CacheService** (`src/services/CacheService.ts`)
   - Serviço principal para operações de cache
   - Métodos: `getByKey`, `setByKey`, `deleteByKey`
   - Configuração de TTL (Time To Live)

2. **DTOs de Cache** (`src/dtos/cache.dto.ts`)
   - `CacheUserDto`: Estrutura para dados de usuário no cache
   - `CacheGetDto<T>`: Resposta tipada para operações de busca
   - `CacheSetDto`: Resposta para operações de escrita
   - `CacheDeleteDto`: Resposta para operações de exclusão

3. **Configuração Redis** (`config/redis.ts`)
   - Conexão com Redis usando ioredis
   - Configuração via variáveis de ambiente

## 🚀 Configuração

### Variáveis de Ambiente (.env)

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600
```

### Docker Compose

O Redis foi adicionado ao `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: redis_cache
  restart: unless-stopped
  ports:
    - "${REDIS_PORT}:6379"
  networks:
    - app-network
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    timeout: 20s
    retries: 10
```

## 💻 Uso do CacheService

### 1. Buscar Dados do Cache

```typescript
import CacheService from '../services/CacheService';
import { CacheUserDto } from '../dtos/cache.dto';

const userKey = CacheService.generateUserCacheKey(userId);
const result = await CacheService.getByKey<CacheUserDto>(userKey);

if (result.success && result.data) {
    // Dados encontrados no cache
    console.log('✅ Cache hit:', result.data);
} else {
    // Cache miss - buscar no banco
    console.log('❌ Cache miss');
}
```

### 2. Armazenar Dados no Cache

```typescript
const userData: CacheUserDto = {
    id: user.id,
    name: user.name,
    email: user.email,
    login: user.login,
    type: user.type
};

const result = await CacheService.setByKey(userKey, userData);
// Ou com TTL customizado (em segundos):
const result = await CacheService.setByKey(userKey, userData, 1800); // 30 minutos
```

### 3. Remover Dados do Cache

```typescript
const result = await CacheService.deleteByKey(userKey);

if (result.success) {
    console.log('🗑️ Cache invalidado');
}
```

## 🔧 Implementação no Middleware Admin

O middleware `admin.middleware.ts` foi modificado para usar cache:

```typescript
// Busca primeiro no cache
const userCacheKey = CacheService.generateUserCacheKey(userId);
let cachedUserResult = await CacheService.getByKey<CacheUserDto>(userCacheKey);

if (cachedUserResult.success && cachedUserResult.data) {
    // Usuário encontrado no cache
    userDto = cachedUserResult.data;
} else {
    // Cache miss - buscar no banco e armazenar no cache
    const user = await User.findByPk(userId);
    // ... criar userDto e armazenar no cache
    await CacheService.setByKey(userCacheKey, userDto);
}
```

## 📊 Benefícios

1. **Performance**: Redução significativa no tempo de resposta
2. **Escalabilidade**: Menor carga no banco de dados
3. **Disponibilidade**: Dados críticos disponíveis mesmo com alta carga
4. **Flexibilidade**: TTL configurável por tipo de dado

## 🔍 Monitoramento

### Logs de Cache

O sistema gera logs para:
- Conexões com Redis
- Erros de cache
- Operações de cache (em modo debug)

### Comandos Redis Úteis

```bash
# Conectar ao Redis
redis-cli

# Ver todas as chaves
KEYS *

# Ver dados de uma chave específica
GET user:123

# Ver TTL de uma chave
TTL user:123

# Limpar todo o cache (cuidado!)
FLUSHALL
```

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Redis não conecta**: Verificar se o serviço está rodando
2. **Cache não funciona**: Verificar variáveis de ambiente
3. **Dados inconsistentes**: Implementar invalidação adequada

### Debug

Para debug, adicione logs:

```typescript
console.log('🔍 Buscando no cache:', cacheKey);
const result = await CacheService.getByKey(cacheKey);
console.log('📊 Resultado do cache:', result);
``` 