import fastify from 'fastify';
import dbConnector from '@core/database';
import routes from '@/routes';

const server = fastify({
  logger: true,
});

server.register(dbConnector);
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