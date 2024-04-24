import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { PaymentType } from "@core/common/enums/PaymentType";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { generalEnvironment } from "@core/config/environments";
import {
  ITransactionCardIdRequest,
  ITransactionCardResponse,
} from "@core/interfaces/services/payment/ITransactionCard";
import { IZoopError } from "@core/interfaces/services/payment/IZoopError";
import axios from "axios";

export async function createTransactionCardId(
  input: ITransactionCardIdRequest
): Promise<ResponseService<ITransactionCardResponse>> {
  try {
    const response = await axios.post<ITransactionCardResponse & IZoopError>(
      `${generalEnvironment.paymentApiBaseUrl}/v1/marketplaces/${generalEnvironment.paymentMarketPlace}}/transactions`,
      {
        on_behalf_of: input.sellerId,
        description: input.description,
        payment_type: PaymentType.credit,
        source: {
          usage: input.usage,
          amount: input.amount,
          currency: "BRL",
          type: "card",
          card: {
            id: input.cardId,
          },
        },
      }
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
