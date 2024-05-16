import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { PlanService } from "@core/services/plan.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { TFunction } from "i18next";
import {
  CreateOrder,
  OrderByNumberByManagerResponse,
} from "@core/interfaces/repositories/order";
import { SignatureService } from "@core/services/signature.service";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { PriceService } from "@core/services/price.service";
import { ClientSignatureRecorrencia } from "@core/common/enums/models/signature";
import { ISignatureActiveByClient } from "@core/interfaces/repositories/signature";
import { PaymentService } from "@core/services/payment.service";
import { VoucherService } from "@core/services/voucher.service";
import { ProductService } from "@core/services/product.service";
import { ClientService } from "@core/services/client.service";
import { OrderValidationService } from "@core/services/orderValidation.service";

@injectable()
export class CreateOrderByManagerUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly planService: PlanService,
    private readonly productService: ProductService,
    private readonly clientService: ClientService,
    private readonly signatureService: SignatureService,
    private readonly priceService: PriceService,
    private readonly paymentService: PaymentService,
    private readonly voucherService: VoucherService,
    private readonly orderValidationService: OrderValidationService
  ) {}

  async execute(
    t: TFunction<"translation", undefined>,
    sellerId: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    splitRuleId: number
  ) {
    await this.orderValidationService.validatePaymentMethod(
      t,
      tokenJwtData,
      payload
    );

    const userFounded = await this.clientService.view(tokenJwtData.clientId);

    if (!userFounded) {
      throw new Error(t("client_not_found"));
    }

    const [
      isPlanProductAndProductGroups,
      isPlanProductCrossSell,
      isProductsVoucher,
    ] = await Promise.all([
      this.planService.isPlanProductAndProductGroups(tokenKeyData, payload),
      this.productService.isPlanProductCrossSell(tokenKeyData, payload),
      this.voucherService.isProductsVoucherEligible(
        tokenKeyData,
        payload.payment?.voucher,
        payload?.products
      ),
    ]);

    if (
      !isPlanProductAndProductGroups ||
      (!isPlanProductCrossSell && !payload.payment?.voucher) ||
      (!isProductsVoucher && payload.payment?.voucher)
    ) {
      throw new Error(t("product_not_eligible_for_plan"));
    }

    let productsOrder = await this.planService.listPlanByOrderComplete(
      tokenKeyData,
      payload
    );

    if (!productsOrder) {
      throw new Error(t("error_list_products_order"));
    }

    const findSignatureActiveByClientId =
      await this.signatureService.findSignatureActiveByClientId(
        tokenJwtData.clientId,
        payload.plan.plan_id,
        productsOrder
      );

    if (findSignatureActiveByClientId.length > 0) {
      const idsProductsToRemove = findSignatureActiveByClientId
        .filter(
          (signature) => signature.recurrence === ClientSignatureRecorrencia.YES
        )
        .map((signature) => signature.product_id);

      productsOrder = productsOrder.filter(
        (product) => !idsProductsToRemove.includes(product)
      );
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

    const totalPricesInstallments =
      this.priceService.calculatePriceInstallments(payload, totalPrices);

    if (!totalPricesInstallments) {
      throw new Error(t("installments_not_calculated"));
    }

    const createOrder = await this.orderService.createByManager(
      sellerId,
      tokenKeyData,
      tokenJwtData,
      payload,
      totalPrices,
      userFounded,
      totalPricesInstallments,
      splitRuleId
    );

    if (!createOrder) {
      throw new Error(t("error_create_order"));
    }

    await this.createSignature(
      t,
      tokenKeyData,
      tokenJwtData,
      payload,
      createOrder,
      productsOrder,
      findSignatureActiveByClientId
    );

    await this.payWith(
      t,
      tokenKeyData,
      tokenJwtData,
      payload,
      createOrder.order_id
    );

    return this.viewOrderCreated(
      tokenKeyData,
      tokenJwtData,
      createOrder.order_id
    );
  }

  private async payWith(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    orderId: string
  ): Promise<void> {
    const paymentType = payload.payment?.type?.toString();

    switch (paymentType) {
      case OrderPaymentsMethodsEnum.VOUCHER:
        if (payload.payment?.voucher) {
          return this.paymentService.payWithVoucher(
            t,
            tokenKeyData,
            tokenJwtData,
            orderId,
            payload.payment.voucher
          );
        }
        break;
      case OrderPaymentsMethodsEnum.CARD:
        return this.paymentService.payWithCard(t, orderId, payload.payment);
      case OrderPaymentsMethodsEnum.BOLETO:
        return this.paymentService.payWithBoleto(t, orderId);
      case OrderPaymentsMethodsEnum.PIX:
        return this.paymentService.payWithPix(t, orderId);
    }
  }

  private async createSignature(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    createOrder: CreateOrder,
    productsOrder: string[],
    findSignatureActiveByClientId: ISignatureActiveByClient[]
  ) {
    const createSignature = await this.signatureService.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      createOrder.order_id
    );

    if (!createSignature) {
      throw new Error(t("error_create_signature"));
    }

    await this.createSignatureProducts(
      t,
      productsOrder,
      createSignature.id_assinatura_cliente,
      findSignatureActiveByClientId
    );

    return createSignature;
  }

  private async createSignatureProducts(
    t: TFunction<"translation", undefined>,
    productsOrder: string[],
    signatureId: string,
    findSignatureActiveByClientId: ISignatureActiveByClient[]
  ) {
    const createSignatureProducts = await this.signatureService.createSignatureProducts(
      productsOrder,
      signatureId,
      findSignatureActiveByClientId
    );

    if (!createSignatureProducts) {
      throw new Error(t("error_create_signature_products"));
    }
  }

  async viewOrderCreated(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    orderId: string
  ): Promise<OrderByNumberByManagerResponse | null> {
    const results = await this.orderService.viewOrderByNumberByManager(
      orderId,
      tokenKeyData,
      tokenJwtData
    );

    if (!results) {
      return null;
    }

    return results;
  }
}
