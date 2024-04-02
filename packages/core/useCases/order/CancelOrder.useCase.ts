import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { ProductService } from "@core/services/product.service";
import { OrderPayments } from "@core/interfaces/repositories/order";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { SignatureService } from "@core/services/signature.service";
import { product } from "@core/models";
import { ProductResponse } from "../product/dtos/ProductResponse.dto";
import { CancelOrderResponse } from "./dtos/CancelOrderResponse.dto";

@injectable()
export class CancelOrderUseCase {
  private orderService: OrderService;
  private signatureService: SignatureService;
  private productService: ProductService;

  constructor(
    orderService: OrderService,
    signatureService: SignatureService,
    productService: ProductService,
  ) {
    this.orderService = orderService;
    this.signatureService = signatureService;
    this.productService = productService;
  }

  async execute(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<CancelOrderResponse | null> {
    const productsToInative = await this.signatureService.findByOrderNumber(orderNumber);

    if (!productsToInative) { return null }

    const isOrderCanceled = await this.signatureService.cancelByOrderNumber(orderNumber, tokenKeyData, tokenJwtData);

    if (!isOrderCanceled) { return null }

    const signatureId = productsToInative[0].signature_id;
    const onlyProducts = productsToInative.map(product => {
      return product.product_id;
    })

    const isProductsCanceled = await this.signatureService.cancelProducts(signatureId, onlyProducts);

    if (!isProductsCanceled) { return null }

    const products = await this.productService.listByIds(tokenKeyData.company_id, onlyProducts);

    return {
      status: 'canceled',
      products
    }
  }
}
