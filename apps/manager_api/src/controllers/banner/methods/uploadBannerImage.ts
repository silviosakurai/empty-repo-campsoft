import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerImageUploaderUseCase } from '@core/useCases/banner/BannerImageUploader.usecase';
import {
  BannerImageRequestParamsDto,
  BannerImageRequestBodyDto,
} from '@core/useCases/banner/dtos/BannerImageUploaderRequest.dto';

export const uploadBannerImage = async (
  request: FastifyRequest<{
    Params: BannerImageRequestParamsDto;
    Body: BannerImageRequestBodyDto;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenJwtData } = request;
  const bannerImageUploaderUseCase = container.resolve(
    BannerImageUploaderUseCase
  );

  try {
    const response = await bannerImageUploaderUseCase.upload(
      t,
      tokenJwtData,
      parseInt(request.params.bannerId),
      parseInt(request.params.bannerItemId),
      request.params.type,
      request.body
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('banner_update_not_allowed'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    console.log('error:', error);
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
