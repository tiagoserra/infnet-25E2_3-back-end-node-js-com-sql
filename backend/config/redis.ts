import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0'),
    lazyConnect: true,
});

redis.on('connect', () => {
    console.log('✅ Conectado ao Redis');
});

redis.on('error', (err) => {
    console.error('❌ Erro de conexão com Redis:', err);
});

export default redis; 