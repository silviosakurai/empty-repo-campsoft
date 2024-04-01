import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { ResponseService } from '@core/common/interfaces/IResponseServices';
import { generalEnvironment } from '@core/config/environments';
import { ITransactionSimpleTicketRequest, ITransactionSimpleTicketResponse } from '@core/interfaces/services/zoop/ITransactionSimpleTicket';
import { IZoopError } from '@core/interfaces/services/zoop/IZoopError';
import axios from 'axios';

export async function createTransactionSimpleTicket(
  input: ITransactionSimpleTicketRequest,
): Promise<ResponseService<ITransactionSimpleTicketResponse>> {
  try {
    const response = await axios.post<ITransactionSimpleTicketResponse & IZoopError>(
      `${generalEnvironment.zoopBaseUrl}marketplaces/${generalEnvironment.zoopMarketPlace}/transactions`,
      {
        on_behalf_of: input.sellerId,
        customer: input.customerId,
        amount: input.amount,
        currency: 'BRL',
        description: input.description,
        payment_type: 'boleto',
        reference_id: input.reference_id,
      },
    );

    if (response.status === HTTPStatusCode.CREATED) {
      return {
        status: true,
        data: response.data,
      };
    }

    return {
      status: false,
      httpStatusCode: response.status,
      message: response.data.error.message,
    };
  } catch (error) {
    return {
      status: false,
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    };
  }
}
