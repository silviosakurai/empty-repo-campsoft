import 'reflect-metadata';
import fastify from 'fastify';
import dbConnector from '@core/config/database';
import routes from '@/routes';
import auth from '@fastify/auth';
import authMiddleware from '@core/middlewares/auth.middleware';
import i18nextPlugin from '@core/plugins/i18next';
import { LoggerService } from '@core/services/logger.service';
import { requestHook, responseHook } from '@core/hooks';
import { v4 } from 'uuid';

const logger = new LoggerService();

const server = fastify({
  genReqId: () => v4(),
});

server.addHook('preValidation', requestHook);
server.addHook('onSend', responseHook);

server.register(dbConnector);
server.register(auth);
server.register(authMiddleware);
server.register(routes);
server.register(i18nextPlugin);

const start = async () => {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    logger.info('Server running');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
