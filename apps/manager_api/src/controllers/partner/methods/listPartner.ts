import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { PartnerListerUseCase } from '@core/useCases/partner/PartnerLister.useCase';
import { ListPartnerRequest } from '@core/useCases/partner/dtos/ListPartnerRequest.dto';

export const listPartner = async (
  request: FastifyRequest<{
    Querystring: ListPartnerRequest;
  }>,
  reply: FastifyReply
) => {
  const partnerListerUseCase = container.resolve(PartnerListerUseCase);
  const { t } = request;

  try {
    const response = await partnerListerUseCase.execute(request.query);

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('partner_not_found'),
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
