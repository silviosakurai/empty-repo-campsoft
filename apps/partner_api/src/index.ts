import 'reflect-metadata';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import dbConnector from '@core/config/database';
import { LoggerService } from '@core/services/logger.service';

const logger = new LoggerService();

const server = fastify();

server.register(dbConnector);

server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    logger.info('Server running');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
