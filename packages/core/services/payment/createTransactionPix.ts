import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { PaymentType } from "@core/common/enums/PaymentType";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { generalEnvironment } from "@core/config/environments";
import {
  ITransactionPixRequest,
  ITransactionPixResponse,
} from "@core/interfaces/services/payment/ITransactionPix";
import { IZoopError } from "@core/interfaces/services/payment/IZoopError";
import axios from "axios";

export async function createTransactionPix(
  input: ITransactionPixRequest
): Promise<ResponseService<ITransactionPixResponse>> {
  try {
    const response = await axios.post<ITransactionPixResponse & IZoopError>(
      `${generalEnvironment.paymentApiBaseUrl}/v1/marketplaces/${generalEnvironment.paymentMarketPlace}}/transactions`,
      {
        on_behalf_of: input.sellerId,
        description: input.description,
        currency: "BRL",
        amount: input.amount,
        payment_type: PaymentType.pix,
        pix_expiration_date_time: input.expiration,
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
