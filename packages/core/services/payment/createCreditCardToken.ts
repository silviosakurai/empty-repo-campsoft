import {
  ICreateCreditCardTokenRequest,
  ICreateCreditCardTokenResponse,
} from "@core/interfaces/services/payment/ICreateCreditCardToken";
import { paymentApiInstance } from "./paymentApiInstance";

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
    throw new Error(error.response.data.error.category);
  }
}
