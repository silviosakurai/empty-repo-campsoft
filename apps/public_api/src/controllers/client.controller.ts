import { ClientService, LoggerService } from '@core/services';
import { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';

interface IQuery {
  cpf: string;
}

@injectable()
class ClientController {
  private clientService: ClientService;
  private logger: LoggerService = new LoggerService();

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  public findClientByCPF = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    try {
      const cpf = (request.query as IQuery).cpf;

      this.logger.info({ cpf }, request.id);

      const client = await this.clientService.findClientByCPF(cpf);

      return reply.send({ result: client });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Erro ao buscar cliente.' });
    }
  };
}

export default ClientController;
