import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientNewsletterViewerUseCase } from '@core/useCases/client/ClientNewsletterViewer.useCase';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';

export const viewClientNewsletter = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const service = container.resolve(ClientNewsletterViewerUseCase);
  const { t } = request;

  try {
    await service.execute();
  } catch (error) {
    console.log(error);

    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
