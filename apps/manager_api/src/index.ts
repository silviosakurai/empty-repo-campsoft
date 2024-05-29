import 'reflect-metadata';
import fastify from 'fastify';
import dbConnector from '@core/config/database';
import auth from '@fastify/auth';
import i18nextPlugin from '@core/plugins/i18next';
import jwtPlugin from '@core/plugins/jwt';
import cacheRedisConnector from '@core/config/cache';
import { RouteModule } from '@core/common/enums/models/route';
import { v4 } from 'uuid';
import swaggerPlugin from '@/plugins/swagger';
import corsPlugin from '@core/plugins/cors';

const server = fastify({
  genReqId: () => v4(),
  logger: true,
});

server.decorateRequest('module', RouteModule.MANAGER);

server.register(dbConnector);
server.register(cacheRedisConnector);
server.register(auth);
server.register(i18nextPlugin);
server.register(jwtPlugin);
server.register(swaggerPlugin);
server.register(corsPlugin);

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });

    server.logger.info('Server running');
  } catch (err) {
    console.log(err);

    server.logger.error(err);
    process.exit(1);
  }
};

start();
