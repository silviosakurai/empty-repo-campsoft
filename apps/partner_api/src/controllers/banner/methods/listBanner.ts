import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { BannerListerUseCase } from '@core/useCases/banner/BannerLister.usecase';
import { BannerReaderRequestDto } from '@core/useCases/banner/dtos/BannerReaderRequest.dto';

export const listBanner = async (
  request: FastifyRequest<{
    Querystring: BannerReaderRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t } = request;
  const bannerListerUseCase = container.resolve(BannerListerUseCase);

  try {
    const response = await bannerListerUseCase.list(
      request.query.company_id,
      request.query
    );

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
