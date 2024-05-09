import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerItemDeleterUseCase } from '@core/useCases/banner/BannerItemDeleter.usecase';
import {
  BannerItemDeleterRequestParamsDto,
} from '@core/useCases/banner/dtos/BannerItemDeleterRequest.dto';

export const deleteBannerItem = async (
  request: FastifyRequest<{
    Params: BannerItemDeleterRequestParamsDto;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenJwtData } = request;
  const bannerItemDeleterUseCase = container.resolve(BannerItemDeleterUseCase);

  try {
    const response = await bannerItemDeleterUseCase.delete(
      t,
      tokenJwtData,
      parseInt(request.params.bannerId),
      parseInt(request.params.bannerItemId)
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
