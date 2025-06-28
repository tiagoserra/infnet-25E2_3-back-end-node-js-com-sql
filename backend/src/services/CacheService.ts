import redis from '../../config/redis';
import { CacheGetDto, CacheSetDto, CacheDeleteDto } from '../dtos/cache.dto';

class CacheService {
    private readonly ttl: number;

    constructor() {
        this.ttl = parseInt(process.env.REDIS_TTL || '3600');
    }

    /**
     * Busca dados do cache por chave
     * @param key Chave do cache
     * @param dto Tipo do DTO esperado como retorno
     */
    async getByKey<T>(key: string): Promise<CacheGetDto<T>> {
        try {
            const data = await redis.get(key);
            
            if (!data) {
                return {
                    success: false,
                    data: undefined
                };
            }

            const parsedData = JSON.parse(data) as T;
            
            return {
                success: true,
                data: parsedData
            };
        } catch (error) {
            console.error(`Erro ao buscar cache para chave ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            };
        }
    }

    /**
     * Define dados no cache por chave
     * @param key Chave do cache
     * @param data Dados a serem armazenados
     * @param customTtl TTL customizado (opcional)
     */
    async setByKey<T>(key: string, data: T, customTtl?: number): Promise<CacheSetDto> {
        try {
            const ttlToUse = customTtl || this.ttl;
            const serializedData = JSON.stringify(data);
            
            await redis.setex(key, ttlToUse, serializedData);
            
            return {
                success: true
            };
        } catch (error) {
            console.error(`Erro ao definir cache para chave ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            };
        }
    }

    /**
     * Remove dados do cache por chave
     * @param key Chave do cache
     */
    async deleteByKey(key: string): Promise<CacheDeleteDto> {
        try {
            const result = await redis.del(key);
            
            return {
                success: result > 0
            };
        } catch (error) {
            console.error(`Erro ao deletar cache para chave ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            };
        }
    }

    /**
     * Gera chave padronizada para usuários
     * @param userId ID do usuário
     */
    generateUserCacheKey(userId: number): string {
        return `user:${userId}`;
    }

    /**
     * Limpa todo o cache (usar com cuidado)
     */
    async flushAll(): Promise<CacheDeleteDto> {
        try {
            await redis.flushall();
            return {
                success: true
            };
        } catch (error) {
            console.error('Erro ao limpar todo o cache:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            };
        }
    }
}

export default new CacheService(); 