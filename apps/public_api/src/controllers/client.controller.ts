import { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { ViewClientUseCase } from '@core/useCases/client/ViewClient.useCase';
import type { ViewClientRequest } from '@core/useCases/client/dtos/ViewClientRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

@injectable()
class ClientController {
  private viewClientUseCase: ViewClientUseCase;

  constructor(viewClientUseCase: ViewClientUseCase) {
    this.viewClientUseCase = viewClientUseCase;
  }

  public viewClient = async (request: FastifyRequest, reply: FastifyReply) => {
    const { t } = request;
    const { userId } = request.params as ViewClientRequest;

    try {
      const responseAuth = await this.viewClientUseCase.execute({ userId });

      if (!responseAuth) {
        return sendResponse(reply, {
          message: t('client_not_found'),
          httpStatusCode: HTTPStatusCode.NOT_FOUND,
        });
      }

      return sendResponse(reply, {
        data: responseAuth,
        httpStatusCode: HTTPStatusCode.OK,
      });
    } catch (error) {
      return sendResponse(reply, {
        message: t('internal_server_error'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export default ClientController;
