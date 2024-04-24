import { injectable } from "tsyringe";
import { ProductService } from "@core/services/product.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { SignatureService } from "@core/services/signature.service";
import { CancelOrderResponse } from "./dtos/CancelOrderResponse.dto";

@injectable()
export class CancelOrderUseCase {
  constructor(
    private readonly signatureService: SignatureService,
    private readonly productService: ProductService
  ) {}

  async execute(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<CancelOrderResponse | null> {
    const productsToInative =
      await this.signatureService.findByOrderNumber(orderNumber);

    if (!productsToInative) {
      return null;
    }

    const isOrderCanceled = await this.signatureService.cancelByOrderNumber(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );

    if (!isOrderCanceled) {
      return null;
    }

    const signatureId = productsToInative[0].signature_id;
    const productCancelDate = productsToInative[0].product_cancel_date;
    const onlyProducts = productsToInative.map((product) => {
      return product.product_id;
    });

    const isProductsCanceled = await this.signatureService.cancelProducts(
      signatureId,
      productCancelDate,
      onlyProducts
    );

    if (!isProductsCanceled) {
      return null;
    }

    const products = await this.productService.listByIds(
      tokenKeyData.id_parceiro,
      onlyProducts
    );

    return {
      status: "canceled",
      products,
    };
  }
}
