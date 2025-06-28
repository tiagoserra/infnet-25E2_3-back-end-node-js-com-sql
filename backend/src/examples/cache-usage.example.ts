/**
 * Exemplos de uso do CacheService
 * Este arquivo mostra como utilizar o sistema de cache em diferentes cenários
 */

import CacheService from '../services/CacheService';
import { CacheUserDto } from '../dtos/cache.dto';

// Exemplo 1: Cachear dados de usuário
export async function exemploUsuarioCache(userId: number) {
    const userCacheKey = CacheService.generateUserCacheKey(userId);
    
    // Buscar no cache primeiro
    const cachedUser = await CacheService.getByKey<CacheUserDto>(userCacheKey);
    
    if (cachedUser.success && cachedUser.data) {
        console.log('✅ Usuário encontrado no cache:', cachedUser.data);
        return cachedUser.data;
    }
    
    // Se não encontrou no cache, buscar no banco
    // ... busca no banco de dados ...
    
    // Armazenar no cache para próximas consultas
    const userData: CacheUserDto = {
        id: userId,
        name: "Nome do Usuário",
        email: "email@exemplo.com",
        login: "usuario123",
        type: "aluno" as any
    };
    
    await CacheService.setByKey(userCacheKey, userData);
    return userData;
}

// Exemplo 2: Cachear lista de cursos
interface CacheCourseDto {
    id: number;
    name: string;
    description: string;
    instructorId: number;
}

export async function exemploCursosCache() {
    const coursesCacheKey = 'courses:all';
    
    // Buscar no cache
    const cachedCourses = await CacheService.getByKey<CacheCourseDto[]>(coursesCacheKey);
    
    if (cachedCourses.success && cachedCourses.data) {
        console.log('✅ Cursos encontrados no cache');
        return cachedCourses.data;
    }
    
    // Buscar no banco se não estiver no cache
    const coursesFromDb: CacheCourseDto[] = [
        { id: 1, name: "Node.js", description: "Curso de Node.js", instructorId: 1 }
    ];
    
    // Cachear por 30 minutos (1800 segundos)
    await CacheService.setByKey(coursesCacheKey, coursesFromDb, 1800);
    
    return coursesFromDb;
}

// Exemplo 3: Invalidar cache quando dados são atualizados
export async function exemploInvalidarCache(userId: number) {
    const userCacheKey = CacheService.generateUserCacheKey(userId);
    
    // Atualizar dados no banco...
    console.log('📝 Atualizando dados do usuário no banco...');
    
    // Invalidar cache após atualização
    const deleteResult = await CacheService.deleteByKey(userCacheKey);
    
    if (deleteResult.success) {
        console.log('🗑️ Cache do usuário invalidado com sucesso');
    } else {
        console.error('❌ Erro ao invalidar cache:', deleteResult.error);
    }
}

// Exemplo 4: Cache com TTL customizado
export async function exemploCacheComTTL() {
    const sessionKey = 'session:user123';
    const sessionData = {
        userId: 123,
        role: 'admin',
        lastActivity: new Date().toISOString()
    };
    
    // Cachear por apenas 5 minutos (300 segundos)
    await CacheService.setByKey(sessionKey, sessionData, 300);
    
    console.log('💾 Dados de sessão cacheados por 5 minutos');
} 