import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { userReaderSchema } from '../../../packages/core/src/validations/user/user.validation';

const server = fastify({
  logger: true,
});

server.get('/', { schema: userReaderSchema }, helloWorld);
async function helloWorld() {
  return { hello: 'world' };
}

const start = async () => {
  try {
    await server.listen({ port: 3001 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
