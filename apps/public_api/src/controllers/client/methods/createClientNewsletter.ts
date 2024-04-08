import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientEmailNewsletterCreatorUseCase } from '@core/useCases/client/ClientEmailNewsletterCreator.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const createClientNewsletter = async (
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ClientEmailNewsletterCreatorUseCase);
  const { t, tokenJwtData } = request;

  try {
    const response = await service.create(
      tokenJwtData.clientId,
      request.body.email
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('email_registered_previously'),
        httpStatusCode: HTTPStatusCode.CONFLICT,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.CREATED,
    });
  } catch (error) {
    console.log(error);
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
