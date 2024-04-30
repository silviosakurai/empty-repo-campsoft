import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerUpdaterUseCase } from '@core/useCases/banner/BannerUpdater.usecase';
import {
  BannerUpdaterRequestDto,
  BannerUpdaterRequestParamsDto,
  BannerUpdaterRequestQueryDto,
} from '@core/useCases/banner/dtos/BannerUpdaterRequest.dto';

export const updateBanner = async (
  request: FastifyRequest<{
    Body: BannerUpdaterRequestDto;
    Params: BannerUpdaterRequestParamsDto;
    Querystring: BannerUpdaterRequestQueryDto;
  }>,
  reply: FastifyReply
) => {
  const { t } = request;
  const bannerUpdaterUseCase = container.resolve(BannerUpdaterUseCase);

  try {
    const response = await bannerUpdaterUseCase.update(
      t,
      request.query.company_id,
      parseInt(request.params.bannerId),
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
