import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientService } from '@core/services/client.service';
import { injectable } from 'tsyringe';

interface IQuery {
  cpf: string;
}

@injectable()
class ClientController {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }
}

export default ClientController;
