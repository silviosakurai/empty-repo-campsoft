import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientByIdUpdaterUseCase } from '@core/useCases/client/ClientByIdUpdater.useCase';
import { UpdateClientByIdRequestDto } from '@core/useCases/client/dtos/updateClientByIdRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const updateClient = async (
  request: FastifyRequest<{
    Body: UpdateClientByIdRequestDto;
    Params: { userId: string };
  }>,
  reply: FastifyReply
) => {
  const clientUseCase = container.resolve(ClientByIdUpdaterUseCase);
  const { t, tokenJwtData, permissionsRoute } = request;
  const { redis } = request.server;
  try {
    const response = await clientUseCase.update(
      tokenJwtData,
      permissionsRoute,
      request.params.userId,
      redis,
      request.body
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      message: t('user_updated_successfully'),
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};