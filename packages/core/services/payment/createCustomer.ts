import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { generalEnvironment } from "@core/config/environments";
import { ICreateCustomer } from "@core/interfaces/services/payment/ICreateCustomer";
import axios from "axios";

export async function createCustomer(input: ICreateCustomer) {
  try {
    const response = await axios.post(
      `${generalEnvironment.paymentApiBaseUrl}/v1/marketplaces/${generalEnvironment.paymentMarketPlace}}/buyers`
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
