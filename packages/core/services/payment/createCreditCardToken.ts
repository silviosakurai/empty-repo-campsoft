import {
  ICreateCreditCardTokenRequest,
  ICreateCreditCardTokenResponse,
} from "@core/interfaces/services/payment/ICreateCreditCardToken";
import { paymentApiInstance } from "./paymentApiInstance";
import { existsInApiErrorCategoryZoop } from "@core/common/functions/existsInApiErrorCategoryZoop";
import { ApiErrorCategoryZoop } from "@core/common/enums/ApiErrorCategoryZoop";

export async function createCreditCardToken(
  input: ICreateCreditCardTokenRequest
): Promise<ICreateCreditCardTokenResponse> {
  try {
    const result =
      await paymentApiInstance.post<ICreateCreditCardTokenResponse>(
        "/cards/tokens",
        input
      );

    return result.data;
  } catch (error: any) {
    if (existsInApiErrorCategoryZoop(error.response.data.error.category)) {
      throw new Error(error.response.data.error.category);
    }

    throw new Error(ApiErrorCategoryZoop.CreateCreditCardError);
  }
}
