import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { PlanService } from "@core/services/plan.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { TFunction } from "i18next";
import { ClientService, ProductService } from "@core/services";
import { CreateOrder } from "@core/interfaces/repositories/order";
import { SignatureService } from "@core/services/signature.service";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { PriceService } from "@core/services/price.service";

@injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly planService: PlanService,
    private readonly productService: ProductService,
    private readonly clientService: ClientService,
    private readonly signatureService: SignatureService,
    private readonly priceService: PriceService
  ) {}

  async execute(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ) {
    this.validatePaymentMethod(payload, t);

    const userFounded = await this.clientService.view(
      tokenKeyData,
      tokenJwtData.clientId
    );

    if (!userFounded) {
      throw new Error(t("client_not_found"));
    }

    const [isPlanProductAndProductGroups, isPlanProductCrossSell] =
      await Promise.all([
        this.planService.isPlanProductAndProductGroups(tokenKeyData, payload),
        this.productService.isPlanProductCrossSell(tokenKeyData, payload),
      ]);

    if (!isPlanProductCrossSell || !isPlanProductAndProductGroups) {
      throw new Error(t("product_not_eligible_for_plan"));
    }

    const totalPrices = await this.priceService.totalPricesOrder(
      t,
      tokenKeyData,
      tokenJwtData,
      payload
    );

    if (!totalPrices) {
      throw new Error(t("plan_price_not_found"));
    }

    const totalPricesInstallments =
      this.priceService.calculatePriceInstallments(payload, totalPrices);

    if (!totalPricesInstallments) {
      throw new Error(t("installments_not_calculated"));
    }

    const createOrder = await this.orderService.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      totalPrices,
      userFounded,
      totalPricesInstallments
    );

    if (!createOrder) {
      throw new Error(t("error_create_order"));
    }

    await this.createSignature(
      t,
      tokenKeyData,
      tokenJwtData,
      payload,
      createOrder
    );

    await this.signatureService.activePaidSignature(
      createOrder.order_id,
      payload.previous_order_id,
      payload.activate_now
    );

    return createOrder;
  }

  private validatePaymentMethod(
    payload: CreateOrderRequestDto,
    t: TFunction<"translation", undefined>
  ) {
    if (
      payload.subscribe &&
      payload.payment?.type?.toString() !== OrderPaymentsMethodsEnum.CARD
    ) {
      throw new Error(t("payment_method_not_card"));
    }

    if (
      payload.payment?.type?.toString() !== OrderPaymentsMethodsEnum.BOLETO &&
      payload.payment?.type?.toString() !== OrderPaymentsMethodsEnum.PIX &&
      payload.payment?.type?.toString() !== OrderPaymentsMethodsEnum.CARD &&
      payload.payment?.type?.toString() !== OrderPaymentsMethodsEnum.VOUCHER
    ) {
      throw new Error(t("payment_method_invalid"));
    }
  }

  private async createSignature(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    createOrder: CreateOrder
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

    const productsOrder = await this.planService.listPlanByOrderComplete(
      tokenKeyData,
      payload
    );

    if (!productsOrder) {
      throw new Error(t("error_list_products_order"));
    }

    const createSignatureProducts =
      await this.signatureService.createSignatureProducts(
        productsOrder,
        createSignature.id_assinatura_cliente
      );

    if (!createSignatureProducts) {
      throw new Error(t("error_create_signature_products"));
    }

    return createSignature;
  }
}
