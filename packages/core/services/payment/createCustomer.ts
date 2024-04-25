import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import {
  ICreateCustomer,
  ICreateCustomerResponse,
} from "@core/interfaces/services/payment/ICreateCustomer";
import { paymentApiInstance } from "./paymentApiInstance";
import { IZoopError } from "@core/interfaces/services/payment/IZoopError";

export async function createCustomer(input: ICreateCustomer) {
  try {
    const response = await paymentApiInstance.post<
      ICreateCustomerResponse & IZoopError
    >("/buyers", input);

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
