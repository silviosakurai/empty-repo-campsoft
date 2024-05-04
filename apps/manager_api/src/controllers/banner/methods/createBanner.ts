import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerCreatorUseCase } from '@core/useCases/banner/BannerCreator.usecase';
import { BannerCreatorRequestDto } from '@core/useCases/banner/dtos/BannerCreatorRequest.dto';

export const createBanner = async (
  request: FastifyRequest<{
    Body: BannerCreatorRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t } = request;
  const bannerCreatorUseCase = container.resolve(BannerCreatorUseCase);

  try {
    const response = await bannerCreatorUseCase.create(request.body);

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
