import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { PartnerCreatorUseCase } from '@core/useCases/partner/PartnerCreator.useCase';
import { CreatePartnerRequest } from '@core/useCases/partner/dtos/CreatePartnerRequest.dto';

export const createPartner = async (
  request: FastifyRequest<{
    Body: CreatePartnerRequest;
  }>,
  reply: FastifyReply
) => {
  const partnerCreatorUseCase = container.resolve(
    PartnerCreatorUseCase
  );
  const { t } = request;

  try {
    const response = await partnerCreatorUseCase.execute(
      request.body,
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('internal_server_error'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    return sendResponse(reply, {
      data: request.body,
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
