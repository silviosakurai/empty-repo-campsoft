import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { generalEnvironment } from "@core/config/environments";
import { IZoopError } from "@core/interfaces/services/payment/IZoopError";
import {
  ISaveCardTokenRequest,
  ISaveCardTokenResponse,
} from "@core/interfaces/services/payment/ISaveCardToken";
import axios from "axios";

export async function saveCardToken(
  input: ISaveCardTokenRequest
): Promise<ResponseService<ISaveCardTokenResponse>> {
  try {
    const response = await axios.post<ISaveCardTokenResponse & IZoopError>(
      `${generalEnvironment.paymentApiBaseUrl}/v1/marketplaces/${generalEnvironment.paymentMarketPlace}}/transactions`,
      {
        holder_name: input.holderName,
        expiration_month: input.expirationMonth,
        expiration_year: input.expirationYear,
        card_number: input.cardNumber,
        security_code: input.securityCode,
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
