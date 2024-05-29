import { existsInApiErrorCategoryZoop } from "@core/common/functions/existsInApiErrorCategoryZoop";
import { paymentApiInstance } from "./paymentApiInstance";
import { ILinkCardTokenWithCustomerResponse } from "@core/interfaces/services/payment/ILinkCardTokenWithCustomer";
import { ApiErrorCategoryZoop } from "@core/common/enums/ApiErrorCategoryZoop";

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
    if (existsInApiErrorCategoryZoop(error.response.data.error.category)) {
      throw new Error(error.response.data.error.category);
    }

    throw new Error(ApiErrorCategoryZoop.LinkCardTokenWithCustomerError);
  }
}
