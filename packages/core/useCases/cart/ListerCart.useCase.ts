import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import OpenSearchService from "@core/services/openSearch.service";
import { CartDocument } from "@core/interfaces/repositories/cart";

@injectable()
export class ListerCartUseCase {
  constructor(private readonly openSearchService: OpenSearchService) {}

  async getCart(
    t: TFunction<"translation", undefined>,
    cartId: string
  ): Promise<CartDocument> {
    const getCart = await this.openSearchService.getCart(cartId);

    if (!getCart) {
      throw new Error(t("cart_not_found"));
    }

    console.log("getCart", getCart);

    return getCart;
  }
}
