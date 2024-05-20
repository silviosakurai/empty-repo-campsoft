import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import OpenSearchService from "@core/services/openSearch.service";
import { CartDocumentResponse } from "@core/interfaces/repositories/cart";
import { CartService } from "@core/services/cart.service";

@injectable()
export class ListerCartUseCase {
  constructor(
    private readonly openSearchService: OpenSearchService,
    private readonly cartService: CartService
  ) {}

  async getCart(
    t: TFunction<"translation", undefined>,
    cartId: string
  ): Promise<CartDocumentResponse> {
    const getCart = await this.openSearchService.getCart(cartId);

    if (!getCart) {
      throw new Error(t("cart_not_found"));
    }

    return this.cartService.getCartWithInfo(getCart);
  }
}
