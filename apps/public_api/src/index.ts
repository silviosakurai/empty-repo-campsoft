import 'reflect-metadata';
import fastify from 'fastify';
import dbConnector from '@core/config/database';
import routes from '@/routes';
import auth from '@fastify/auth';
import authenticateJwt from '@core/middlewares/auth/jwt.middleware';
import authenticateTfa from '@core/middlewares/auth/tfa.middleware';
import authenticateKeyApi from '@core/middlewares/auth/keyapi.middleware';
import i18nextPlugin from '@core/plugins/i18next';
import { requestHook, responseHook, errorHook } from '@core/hooks';
import jwtPlugin from '@core/plugins/jwt';
import cacheRedisConnector from '@core/config/cache';
import { RouteModule } from '@core/common/enums/models/route';
import { v4 } from 'uuid';
import loggerServicePlugin from '@core/plugins/logger';

const server = fastify({
  genReqId: () => v4(),
  logger: true,
});

server.addHook('preValidation', requestHook);
server.addHook('onSend', responseHook);
server.addHook('onError', errorHook);

server.decorateRequest('module', RouteModule.PUBLIC);

server.register(loggerServicePlugin).after(() => {
  server.register(dbConnector);
  server.register(cacheRedisConnector);
  server.register(auth);
  server.register(authenticateJwt);
  server.register(authenticateTfa);
  server.register(authenticateKeyApi);
  server.register(i18nextPlugin);
  server.register(jwtPlugin);
  server.register(routes);
});

const start = async () => {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });

    server.logger.info('Server running');
  } catch (err) {
    console.log(err);

    server.logger.error(err);
    process.exit(1);
  }
};

start();
