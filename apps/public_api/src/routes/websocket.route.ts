import { FastifyInstance } from 'fastify';

export default async function websocketRoute(server: FastifyInstance) {
  server.register(async function (fastify) {
    fastify.get('/', { websocket: true }, (socket, req) => {
      socket.on('message', (message) => {
        socket.send('hi from server');
      });
    });
  });
}
