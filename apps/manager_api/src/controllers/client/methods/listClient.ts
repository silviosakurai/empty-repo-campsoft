import { ListClientRequest } from '@core/useCases/client/dtos/ListClientRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientsWithCompaniesListerUseCase } from '@core/useCases/client/ClientsWithCompaniesLister.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const listClient = async (
  request: FastifyRequest<{
    Querystring: ListClientRequest;
  }>,
  reply: FastifyReply
) => {
  const clientListWithCompaniesUseCase = container.resolve(
    ClientsWithCompaniesListerUseCase
  );
  const { t, tokenJwtData, permissionsRoute } = request;
  const { redis } = request.server;

  try {
    const response = await clientListWithCompaniesUseCase.execute(
      tokenJwtData,
      permissionsRoute,
      request.query,
      redis
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

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
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
