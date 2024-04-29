import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerItemUpdaterUseCase } from '@core/useCases/banner/BannerItemUpdater.usecase';
import {
  BannerItemUpdaterParamsRequestDto,
  BannerItemUpdaterRequestDto
} from '@core/useCases/banner/dtos/BannerItemUpdaterRequest.dto';

export const updateBannerItem = async (
  request: FastifyRequest<{
    Body: BannerItemUpdaterRequestDto;
    Params: BannerItemUpdaterParamsRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenJwtData } = request;
  const bannerItemUpdaterUseCase = container.resolve(BannerItemUpdaterUseCase);

  try {
    const response = await bannerItemUpdaterUseCase.update(
      t,
      tokenJwtData,
      parseInt(request.params.bannerId),
      parseInt(request.params.bannerItemId),
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
