import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { PartnerUpdaterUseCase } from '@core/useCases/partner/PartnerUpdater.useCase';
import { CreatePartnerRequest } from '@core/useCases/partner/dtos/CreatePartnerRequest.dto';

export const updatePartner = async (
  request: FastifyRequest<{
    Params: { partnerId: number };
    Body: CreatePartnerRequest;
  }>,
  reply: FastifyReply
) => {
  const partnerUpdaterUseCase = container.resolve(PartnerUpdaterUseCase);
  const { t } = request;

  try {
    const response = await partnerUpdaterUseCase.execute(
      request.params.partnerId,
      request.body
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
