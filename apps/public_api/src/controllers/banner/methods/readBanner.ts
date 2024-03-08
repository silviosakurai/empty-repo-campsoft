import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerReaderUseCase } from '@core/useCases/banner/BannerReader.usecase';
import { BannerReaderRequestDto } from '@core/useCases/banner/dtos/BannerReaderRequest.dto';

export const readBanner = async (
  request: FastifyRequest<{
    Body: BannerReaderRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t, apiAccess } = request;
  const bannerUseCase = container.resolve(BannerReaderUseCase);

  try {
    const response = await bannerUseCase.read(request.body);

    // if (!response) {
    //   return sendResponse(reply, {
    //     message: t('client_not_found'),
    //     httpStatusCode: HTTPStatusCode.NOT_FOUND,
    //   });
    // }

    return sendResponse(reply, {
      // data: response,
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
