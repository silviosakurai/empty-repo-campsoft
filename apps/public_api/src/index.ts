import 'reflect-metadata';
import fastify from 'fastify';
import dbConnector from '@core/config/database';
import routes from '@/routes';
import auth from '@fastify/auth';
import authMiddleware from '@core/middlewares/auth.middleware';
import i18nextPlugin from '@core/plugins/i18next';
import jwtPlugin from '@core/plugins/jwt';
import cacheRedisConnector from '@core/config/cache';

const server = fastify({
  logger: true,
});

server.register(dbConnector);
server.register(auth);
server.register(authMiddleware);
server.register(i18nextPlugin);
server.register(jwtPlugin);
server.register(cacheRedisConnector);
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
