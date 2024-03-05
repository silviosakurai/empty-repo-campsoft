import 'reflect-metadata';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import dbConnector from '@core/config/database';
import cacheRedisConnector from '@core/config/cache';

const server = fastify({
  logger: true,
});

server.register(dbConnector);
server.register(cacheRedisConnector);

server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
