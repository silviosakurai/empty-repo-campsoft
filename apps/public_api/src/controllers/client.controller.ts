import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientService } from '@core/services/client.service';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '@core/models';

interface query {
  cpf: string;
}

class ClientController {
  private clientService: ClientService;

  constructor(client: MySql2Database<typeof schema>) {
    this.clientService = new ClientService(client);
  }

  public findClientByCPF = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    try {
      const cpf = (request.query as query).cpf;

      const client = await this.clientService.findClientByCPF(cpf);

      return reply.send({ result: client[0] });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Erro ao buscar cliente.' });
    }
  };
}

export default ClientController;
