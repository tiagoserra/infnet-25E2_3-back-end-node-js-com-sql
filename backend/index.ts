import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const { logRequest } = require('./src/middlewares/log.middleware');
//const { authenticateToken } = require('./src/middlewares/auth.middleware');
const { rateLimiter } = require('./src/middlewares/limiter.middleware');

// Middlewares
app.use(logRequest);
app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API funcionando com TypeScript!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'API está funcionando corretamente',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api', routes);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});