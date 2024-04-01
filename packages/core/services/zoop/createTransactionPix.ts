import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { ResponseService } from '@core/common/interfaces/IResponseServices';
import { generalEnvironment } from '@core/config/environments';
import { ITransactionPixRequest, ITransactionPixResponse } from '@core/interfaces/services/zoop/ITransactionPix';
import { IZoopError } from '@core/interfaces/services/zoop/IZoopError';
import axios from 'axios';

export async function createTransactionPix(input: ITransactionPixRequest): Promise<ResponseService<ITransactionPixResponse>> {
  try {
    const response = await axios.post<ITransactionPixResponse & IZoopError>(
      `${generalEnvironment.zoopBaseUrl}/marketplaces/${generalEnvironment.zoopMarketPlace}}/transactions`,
      {
        on_behalf_of: input.sellerId,
        description: input.description,
        currency: 'BRL',
        amount: input.amount,
        payment_type: 'pix',
        pix_expiration_date_time: input.expiration,
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
