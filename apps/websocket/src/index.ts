import 'reflect-metadata';
import fastify from 'fastify';
import websocketPlugin from '@core/plugins/websocket';
import routes from './routes';

const server = fastify({
  logger: true,
});
server.register(websocketPlugin);
server.register(routes);

server.listen({ port: 3003, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }

  console.log(`Server is running on port: ${address}`);
});
