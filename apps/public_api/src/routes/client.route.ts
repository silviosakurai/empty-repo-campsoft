import ClientController from '@/controllers/client.controller';
import { FastifyInstance } from 'fastify';

export default async function clientRoutes(server: FastifyInstance) {
  const clientController = new ClientController(server.db);

  server.get('/client', clientController.findClientByCPF);
}
