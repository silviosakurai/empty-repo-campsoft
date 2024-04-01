import 'reflect-metadata';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import dbConnector from '@core/config/database';
import cacheRedisConnector from '@core/config/cache';
import { requestHook, responseHook, errorHook } from '@core/hooks';
import { v4 } from 'uuid';
import loggerServicePlugin from '@core/plugins/logger';
import { RouteModule } from '@core/common/enums/models/route';

const server = fastify({
  genReqId: () => v4(),
  logger: true,
});

server.addHook('preValidation', requestHook);
server.addHook('onSend', responseHook);
server.addHook('onError', errorHook);

server.decorateRequest('module', RouteModule.PARTNER);

server.register(dbConnector);
server.register(cacheRedisConnector);
server.register(loggerServicePlugin);

server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.logger.info('Server running');
  } catch (err) {
    server.logger.error(err);
    process.exit(1);
  }
};

start();
