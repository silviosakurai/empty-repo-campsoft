import 'reflect-metadata';
import fastify from 'fastify';
import dbConnector from '@core/config/database';
import routes from '@/routes';
import auth from '@fastify/auth';
import authMiddleware from '@core/middlewares/auth/auth.middleware';
import i18nextPlugin from '@core/plugins/i18next';
import jwtPlugin from '@core/plugins/jwt';
import cacheRedisConnector from '@core/config/cache';
import { RouteModule } from '@core/common/enums/models/route';

const server = fastify({
  logger: true,
});

server.decorateRequest('module', RouteModule.PUBLIC);

server.register(dbConnector);
server.register(cacheRedisConnector);
server.register(auth);
server.register(authMiddleware);
server.register(i18nextPlugin);
server.register(jwtPlugin);
server.register(routes);

const start = async () => {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
