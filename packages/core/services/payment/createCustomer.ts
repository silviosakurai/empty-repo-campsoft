import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import {
  ICreateCustomer,
  ICreateCustomerResponse,
} from "@core/interfaces/services/payment/ICreateCustomer";
import { paymentApiInstance } from "./paymentApiInstance";
import { IZoopError } from "@core/interfaces/services/payment/IZoopError";
import { existsInApiErrorCategoryZoop } from "@core/common/functions/existsInApiErrorCategoryZoop";
import { ApiErrorCategoryZoop } from "@core/common/enums/ApiErrorCategoryZoop";

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
  } catch (error: any) {
    if (existsInApiErrorCategoryZoop(error.response.data.error.category)) {
      throw new Error(error.response.data.error.category);
    }

    throw new Error(ApiErrorCategoryZoop.CreateCustomerError);
  }
}
