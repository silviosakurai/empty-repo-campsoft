import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerViewerUseCase } from '@core/useCases/banner/BannerViewer.usecase';
import { BannerViewerRequestDto } from '@core/useCases/banner/dtos/BannerViewerRequest.dto';

export const viewBanner = async (
  request: FastifyRequest<{
    Params: BannerViewerRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenJwtData } = request;
  const bannerUseCase = container.resolve(BannerViewerUseCase);

  try {
    const response = await bannerUseCase.view(
      tokenJwtData,
      parseInt(request.params.bannerId),
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('banner_not_found'),
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
