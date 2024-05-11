import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerDeleterUseCase } from '@core/useCases/banner/BannerDeleter.usecase';
import { BannerDeleterRequestParamsDto } from '@core/useCases/banner/dtos/BannerDeleterRequest.dto';

export const deleteBanner = async (
  request: FastifyRequest<{
    Params: BannerDeleterRequestParamsDto;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenJwtData } = request;
  const bannerDeleterUseCase = container.resolve(BannerDeleterUseCase);

  try {
    const response = await bannerDeleterUseCase.delete(
      t,
      tokenJwtData,
      parseInt(request.params.bannerId)
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('internal_server_error'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    return sendResponse(reply, {
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
