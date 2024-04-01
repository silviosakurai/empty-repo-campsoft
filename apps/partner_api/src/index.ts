import 'reflect-metadata';
import fastify from 'fastify';
import dbConnector from '@core/config/database';
import cacheRedisConnector from '@core/config/cache';
import { requestHook, responseHook } from '@core/hooks';
import { v4 } from 'uuid';

const server = fastify({
  genReqId: () => v4(),
});

server.addHook('preValidation', requestHook);
server.addHook('onSend', responseHook);

server.register(dbConnector);
server.register(cacheRedisConnector);

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    process.exit(1);
  }
};

start();
