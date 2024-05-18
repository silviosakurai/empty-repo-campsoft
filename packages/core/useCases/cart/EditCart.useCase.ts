import { CreateCartRequest } from "./dtos/CreateCartRequest.dto";
import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CartValidationService } from "@core/services/cartValidation.service";
import { PlanService } from "@core/services/plan.service";
import { ProductService } from "@core/services/product.service";
import { SignatureService } from "@core/services/signature.service";
import { ClientSignatureRecorrencia } from "@core/common/enums/models/signature";
import { ISignatureActiveByClient } from "@core/interfaces/repositories/signature";
import { PriceService } from "@core/services/price.service";
import OpenSearchService from "@core/services/openSearch.service";
import { CartDocumentResponse } from "@core/interfaces/repositories/cart";
import { CartService } from "@core/services/cart.service";

@injectable()
export class EditCartUseCase {
  constructor(
    private readonly cartValidationService: CartValidationService,
    private readonly planService: PlanService,
    private readonly productService: ProductService,
    private readonly signatureService: SignatureService,
    private readonly priceService: PriceService,
    private readonly openSearchService: OpenSearchService,
    private readonly cartService: CartService
  ) {}

  async edit(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    cartId: string,
    payload: CreateCartRequest
  ): Promise<CartDocumentResponse> {
    const getCart = await this.openSearchService.getCart(cartId);

    if (!getCart) {
      throw new Error(t("cart_not_found"));
    }

    await this.cartValidationService.validate(t, tokenJwtData, payload);

    const [isPlanProductAndProductGroups, isPlanProductCrossSell, productsIds] =
      await Promise.all([
        this.planService.isPlanProductAndProductGroups(tokenKeyData, payload),
        this.productService.isPlanProductCrossSell(tokenKeyData, payload),
        this.planService.listPlanByOrderComplete(tokenKeyData, payload),
      ]);

    if (!isPlanProductAndProductGroups || !isPlanProductCrossSell) {
      throw new Error(t("product_not_eligible_for_plan"));
    }

    if (!productsIds) {
      throw new Error(t("error_list_products_order"));
    }

    const findSignatureActiveByClientId =
      await this.signatureService.findSignatureActiveByClientId(
        tokenJwtData.clientId,
        payload.plan.plan_id,
        productsIds
      );

    const productsIdByOrder = await this.findSignatureActiveByClientId(
      findSignatureActiveByClientId,
      productsIds
    );

    if (!productsIdByOrder.length) {
      throw new Error(t("you_already_have_all_active_products"));
    }

    const totalPrices = await this.priceService.totalPricesOrder(
      t,
      tokenKeyData,
      tokenJwtData,
      payload,
      findSignatureActiveByClientId
    );

    if (!totalPrices) {
      throw new Error(t("plan_price_not_found"));
    }

    const getCartEdit = await this.openSearchService.updateCart(
      cartId,
      payload,
      totalPrices,
      productsIdByOrder,
      findSignatureActiveByClientId
    );

    if (!getCartEdit) {
      throw new Error(t("error_update_cart"));
    }

    return this.cartService.getCartWithInfo(getCartEdit);
  }

  private async findSignatureActiveByClientId(
    findSignatureActiveByClientId: ISignatureActiveByClient[],
    productsIds: string[]
  ): Promise<string[]> {
    if (findSignatureActiveByClientId.length > 0) {
      const idsProductsToRemove = findSignatureActiveByClientId
        .filter(
          (signature) => signature.recurrence === ClientSignatureRecorrencia.YES
        )
        .map((signature) => signature.product_id);

      productsIds = productsIds.filter(
        (product) => !idsProductsToRemove.includes(product)
      );
    }

    return productsIds;
  }
}
