import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { VoucherViewerUseCase } from '@core/useCases/voucher/VoucherViewer.usecase';
import { VoucherViewRequestDto } from '@core/useCases/voucher/dtos/VoucherViewRequest.dto';
import { VoucherError } from '@core/common/exceptions/VoucherError';

export const viewVoucher = async (
  request: FastifyRequest<{
    Params: VoucherViewRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenKeyData } = request;
  const { voucherCode } = request.params;
  const voucherViewUseCase = container.resolve(VoucherViewerUseCase);

  try {
    const response = await voucherViewUseCase.view(
      t,
      tokenKeyData,
      voucherCode
    );

    return sendResponse(reply, {
      data: response,
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    if (error instanceof VoucherError) {
      return sendResponse(reply, {
        message: error.message,
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
