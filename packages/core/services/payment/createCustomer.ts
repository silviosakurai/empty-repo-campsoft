import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { ICreateCustomer } from "@core/interfaces/services/payment/ICreateCustomer";
import { paymentApiInstance } from "./paymentApiInstance";

export async function createCustomer(input: ICreateCustomer) {
  try {
    const response = await paymentApiInstance.post("/buyers", input);

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
    console.log((error as any).response);
    return {
      status: false,
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    };
  }
}
