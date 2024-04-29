import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerItemCreatorUseCase } from '@core/useCases/banner/BannerItemCreator.usecase';
import { BannerItemCreatorRequest } from '@core/useCases/banner/dtos/BannerItemCreatorRequest.dto';
import { BannerViewerRequestDto } from '@core/useCases/banner/dtos/BannerViewerRequest.dto';

export const createBannerItem = async (
  request: FastifyRequest<{
    Body: BannerItemCreatorRequest;
    Params: BannerViewerRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t } = request;
  const bannerItemCreatorUseCase = container.resolve(BannerItemCreatorUseCase);

  try {
    const response = await bannerItemCreatorUseCase.create(
      parseInt(request.params.bannerId),
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
