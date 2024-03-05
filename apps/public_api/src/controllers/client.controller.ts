import { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { ViewClientUseCase } from '@core/useCases/client/ViewClient.useCase';
import type { ViewClientRequest } from '@core/useCases/client/dtos/ViewClientRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { CreateClientUseCase } from '@core/useCases/client/CreateClient.useCase';
import { CreateClientRequestDto } from '@core/useCases/client/dtos/CreateClientRequest.dto';

@injectable()
class ClientController {
  private viewClientUseCase: ViewClientUseCase;
  private clientUseCase: CreateClientUseCase;

  constructor(
    viewClientUseCase: ViewClientUseCase,
    clientUseCase: CreateClientUseCase
  ) {
    this.clientUseCase = clientUseCase;
    this.viewClientUseCase = viewClientUseCase;
  }

  public viewClient = async (request: FastifyRequest, reply: FastifyReply) => {
    const { t, apiAccess } = request;
    const { userId } = request.params as ViewClientRequest;

    try {
      const response = await this.viewClientUseCase.execute({
        apiAccess,
        userId,
      });

      if (!response) {
        return sendResponse(reply, {
          message: t('client_not_found'),
          httpStatusCode: HTTPStatusCode.NOT_FOUND,
        });
      }

      return sendResponse(reply, {
        data: response,
        httpStatusCode: HTTPStatusCode.OK,
      });
    } catch (error) {
      return sendResponse(reply, {
        message: t('internal_server_error'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  async create(
    request: FastifyRequest<{ Body: CreateClientRequestDto }>,
    reply: FastifyReply
  ) {
    const { t, apiAccess } = request;
    console.log(this.clientUseCase);
    try {
      const response = await this.clientUseCase.execute(request.body);

      return sendResponse(reply, {
        data: response,
        httpStatusCode: HTTPStatusCode.CREATED,
      });
    } catch (error) {
      console.log(error);
      return sendResponse(reply, {
        message: t('internal_server_error'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

export default ClientController;
