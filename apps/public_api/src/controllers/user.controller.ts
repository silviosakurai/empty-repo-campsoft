import { CreateClientUseCase } from '@core/useCases/client/CreateClient.useCase';
import { injectable } from 'tsyringe';
import type { CreateClientRequestDto } from '@core/useCases/client/dtos/CreateClientRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { t } from 'i18next';

@injectable()
export default class UserController {
  private clientUseCase: CreateClientUseCase;

  constructor(clientUseCase: CreateClientUseCase) {
    this.clientUseCase = clientUseCase;
  }

  async create(
    request: FastifyRequest<{ Body: CreateClientRequestDto }>,
    reply: FastifyReply
  ) {
    console.log(this.clientUseCase);
    try {
      const response = await this.clientUseCase.execute(request.body);

      return sendResponse(reply, {
        data: response,
        httpStatusCode: HTTPStatusCode.CREATED,
      });
    } catch (error) {
      return sendResponse(reply, {
        message: t('internal_server_error'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
