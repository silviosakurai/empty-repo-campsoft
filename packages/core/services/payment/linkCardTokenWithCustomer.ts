import { paymentApiInstance } from "./paymentApiInstance";
import { ILinkCardTokenWithCustomerResponse } from "@core/interfaces/services/payment/ILinkCardTokenWithCustomer";

export async function linkCardTokenWithCustomer(input: {
  token: string;
  customer: string;
}): Promise<ILinkCardTokenWithCustomerResponse> {
  try {
    const result =
      await paymentApiInstance.post<ILinkCardTokenWithCustomerResponse>(
        "/cards",
        input
      );

    return result.data;
  } catch (error: any) {
    throw new Error(error.response.data.error.category);
  }
}
