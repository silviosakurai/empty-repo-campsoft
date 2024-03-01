import ClientController from '@/controllers/client.controller';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function clientRoutes(server: FastifyInstance) {
  const clientController = container.resolve(ClientController);

  server.get('/client', {
    preHandler: server.authenticate,
    handler: clientController.findClientByCPF,
  });
}
