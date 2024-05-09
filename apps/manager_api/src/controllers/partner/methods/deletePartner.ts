import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { PartnerDeleterUseCase } from '@core/useCases/partner/PartnerDeleter.useCase';

export const deletePartner = async (
  request: FastifyRequest<{
    Params: { partnerId: number };
  }>,
  reply: FastifyReply
) => {
  const partnerDeleterUseCase = container.resolve(
    PartnerDeleterUseCase
  );
  const { t } = request;

  try {
    const response = await partnerDeleterUseCase.execute(
      request.params.partnerId,
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('internal_server_error'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
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
