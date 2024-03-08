import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerReaderUseCase } from '@core/useCases/banner/BannerReader.usecase';
import { BannerReaderRequestDto } from '@core/useCases/banner/dtos/BannerReaderRequest.dto';

export const readBanner = async (
  request: FastifyRequest<{
    Querystring: BannerReaderRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t } = request;
  const bannerUseCase = container.resolve(BannerReaderUseCase);

  try {
    const response = await bannerUseCase.read(request.query);

    return sendResponse(reply, {
      data: response,
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    console.log(error);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
