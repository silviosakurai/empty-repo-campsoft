import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ListOrdersUseCase } from '@core/useCases/order/ListOrders.useCase';
import { container } from 'tsyringe';
import { ListPlanRequest } from '@core/useCases/plan/dtos/ListPlanRequest.dto';

export const listOrder = async (
  request: FastifyRequest<{
    Querystring: ListPlanRequest;
  }>,
  reply: FastifyReply
) => {
  const listOrdersUseCase = container.resolve(ListOrdersUseCase);
  const { t, tokenKeyData } = request;

  try {
    const response = await listOrdersUseCase.execute(
      tokenKeyData.company_id,
      request.query
    );
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
