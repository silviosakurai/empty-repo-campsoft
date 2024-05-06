import { existsInApiErrorCategoryZoop } from "@core/common/functions/existsInApiErrorCategoryZoop";
import { paymentApiInstance } from "./paymentApiInstance";
import { ApiErrorCategoryZoop } from "@core/common/enums/ApiErrorCategoryZoop";

export async function removeCardById(cardId: string) {
  try {
    const result = await paymentApiInstance.delete(`/cards/${cardId}`);

    return result.data;
  } catch (error: any) {
    if (existsInApiErrorCategoryZoop(error.response.data.error.category)) {
      throw new Error(error.response.data.error.category);
    }

    throw new Error(ApiErrorCategoryZoop.RemoveCardById);
  }
}
