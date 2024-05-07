import 'reflect-metadata';
import fastify from 'fastify';
import dbConnector from '@core/config/database';
import auth from '@fastify/auth';
import i18nextPlugin from '@core/plugins/i18next';
import { requestHook, responseHook, errorHook } from '@core/hooks';
import cacheRedisConnector from '@core/config/cache';
import { RouteModule } from '@core/common/enums/models/route';
import { v4 } from 'uuid';
import loggerServicePlugin from '@core/plugins/logger';
import swaggerPlugin from '@/plugins/swagger';
import corsPlugin from '@core/plugins/cors';

const server = fastify({
  genReqId: () => v4(),
  logger: true,
});

server.addHook('preValidation', requestHook);
server.addHook('onSend', responseHook);
server.addHook('onError', errorHook);

server.decorateRequest('module', RouteModule.TOOLS);

server.register(dbConnector);
server.register(loggerServicePlugin);
server.register(cacheRedisConnector);
server.register(auth);
server.register(i18nextPlugin);
server.register(swaggerPlugin);
server.register(corsPlugin);

const start = async () => {
  try {
    await server.listen({ port: 3002, host: '0.0.0.0' });

    server.logger.info('Server running');
  } catch (err) {
    console.log(err);

    server.logger.error(err);
    process.exit(1);
  }
};

start();
