import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { ResponseService } from '@core/common/interfaces/IResponseServices';
import { generalEnvironment } from '@core/config/environments';
import { ITransactionFullTicketRequest, ITransactionFullTicketResponse } from '@core/interfaces/services/zoop/ITransactionFullTicket';
import { IZoopError } from '@core/interfaces/services/zoop/IZoopError';
import axios from 'axios';

export async function createTransactionFullTicket(input: ITransactionFullTicketRequest): Promise<ResponseService<ITransactionFullTicketResponse>> {
  try {
    const response = await axios.post<ITransactionFullTicketResponse & IZoopError>(
      `${generalEnvironment.zoopBaseUrl}marketplaces/${generalEnvironment.zoopMarketPlace}/transactions`,
      {
        on_behalf_of: input.sellerId,
        customer: input.customerId,
        amount: input.amount,
        currency: 'BRL',
        description: input.description,
        payment_type: 'boleto',
        reference_id: input.reference_id,
        logo: input.logo,
        payment_method: {
          expiration_date: input.expirationDate,
          payment_limit_date: input.paymentLimitDate,
          body_instructions: input.bodyInstructions,
          billing_instructions: {
            late_fee: {
              mode: input.lateFee?.mode,
              amount: input.lateFee?.amount,
              percentage: input.lateFee?.percentage,
              start_date: input.lateFee?.startDate,
            },
            interest: {
              mode: input.interest?.mode,
              amount: input.interest?.amount,
              percentage: input.interest?.percentage,
              start_date: input.interest?.startDate,
            },
            discount: input.discounts?.map((item) => {
              return {
                mode: item.mode,
                amount: item.amount,
                limit_date: item.limitDate,
              };
            }),
          },
        },
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
