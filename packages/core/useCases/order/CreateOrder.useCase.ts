import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { PlanService } from "@core/services/plan.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { TFunction } from "i18next";
import { ClientService, ProductService } from "@core/services";
import {
  CreateOrder,
  OrderByNumberResponse,
} from "@core/interfaces/repositories/order";
import { SignatureService } from "@core/services/signature.service";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { PriceService } from "@core/services/price.service";
import { ClientSignatureRecorrencia } from "@core/common/enums/models/signature";
import { ISignatureActiveByClient } from "@core/interfaces/repositories/signature";
import { PaymentService } from "@core/services/payment.service";
import { VoucherService } from "@core/services/voucher.service";

@injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly planService: PlanService,
    private readonly productService: ProductService,
    private readonly clientService: ClientService,
    private readonly signatureService: SignatureService,
    private readonly priceService: PriceService,
    private readonly paymentService: PaymentService,
    private readonly voucherService: VoucherService
  ) {}

  async execute(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ) {
    await this.validatePaymentMethod(t, tokenJwtData, payload);

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
    if (
      payload.payment?.voucher &&
      payload.payment?.type?.toString() === OrderPaymentsMethodsEnum.VOUCHER
    ) {
      return this.paymentService.payWithVoucher(
        t,
        tokenKeyData,
        tokenJwtData,
        orderId,
        payload.payment.voucher
      );
    }

    if (payload.payment?.type?.toString() === OrderPaymentsMethodsEnum.CARD) {
      return this.paymentService.payWithCard(t, orderId, payload.payment);
    }
  }

  private async validatePaymentMethod(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ) {
    this.validateCardPaymentMethod(t, payload);
    this.validatePaymentMethodType(t, payload);
    this.validateMonthsRequired(t, payload);

    await this.validatePreviousOrder(t, payload);
    await this.validateSignaturePlan(t, tokenJwtData, payload);

    this.validateVoucherUsage(t, payload);
    this.validateCouponAndVoucherIncompatibility(t, payload);

    if (payload.payment?.type?.toString() === OrderPaymentsMethodsEnum.CARD) {
      this.validateCVV(t, payload);
      this.validateExpireMonth(t, payload);
      this.validateExpireYear(t, payload);
      this.validateInstallments(t, payload);
      this.validateCreditCardNumber(t, payload);
      this.validateCreditCardName(t, payload);
      this.validateCreditCardConsistency(t, payload);
    }
  }

  private validateCardPaymentMethod(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (
      payload.subscribe &&
      payload.payment?.type?.toString() !== OrderPaymentsMethodsEnum.CARD
    ) {
      throw new Error(t("payment_method_not_card"));
    }
  }

  private validatePaymentMethodType(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    const validTypes = [
      OrderPaymentsMethodsEnum.CARD,
      OrderPaymentsMethodsEnum.BOLETO,
      OrderPaymentsMethodsEnum.PIX,
      OrderPaymentsMethodsEnum.VOUCHER,
    ];
    if (
      !validTypes.includes(
        payload.payment?.type?.toString() as OrderPaymentsMethodsEnum
      )
    ) {
      throw new Error(t("payment_method_invalid"));
    }
  }

  private validateMonthsRequired(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (
      payload.payment?.type?.toString() !== OrderPaymentsMethodsEnum.VOUCHER &&
      !payload.months
    ) {
      throw new Error(t("months_required_by_methods"));
    }
  }

  private async validatePreviousOrder(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (payload?.previous_order_id) {
      const orderIsExists = await this.orderService.orderIsExists(
        payload.previous_order_id
      );

      if (!orderIsExists) {
        throw new Error(t("previous_order_not_found"));
      }
    }
  }

  private async validateSignaturePlan(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ) {
    if (payload.subscribe) {
      const isSignaturePlanActive =
        await this.signatureService.isSignaturePlanActiveByClientId(
          tokenJwtData.clientId,
          payload.plan.plan_id
        );

      if (isSignaturePlanActive) {
        throw new Error(t("plan_already_active"));
      }
    }
  }

  private validateVoucherUsage(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (
      payload.payment?.type?.toString() === OrderPaymentsMethodsEnum.VOUCHER &&
      payload?.activate_now === false
    ) {
      throw new Error(t("voucher_activate_now_false"));
    }
  }

  private validateCouponAndVoucherIncompatibility(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (payload.coupon_code && payload.payment?.voucher) {
      throw new Error(t("coupon_code_with_voucher_not_allowed"));
    }
  }

  private validateCVV(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (payload.payment.credit_card?.cvv.length !== 3) {
      throw new Error(t("cvv_invalid"));
    }
  }

  private validateExpireMonth(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (
      payload.payment.credit_card &&
      payload.payment.credit_card?.expire_month < 1
    ) {
      throw new Error(t("expire_month_invalid"));
    }
  }

  private validateExpireYear(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (
      payload.payment.credit_card &&
      payload.payment.credit_card?.expire_year < new Date().getFullYear()
    ) {
      throw new Error(t("expire_year_invalid"));
    }
  }

  private validateInstallments(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (
      payload.payment.credit_card &&
      payload.payment.credit_card?.installments < 1
    ) {
      throw new Error(t("installments_invalid"));
    }
  }

  private validateCreditCardNumber(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (
      payload.payment.credit_card &&
      payload.payment.credit_card?.number.length !== 16
    ) {
      throw new Error(t("credit_card_number_invalid"));
    }
  }

  private validateCreditCardName(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (payload.payment.credit_card && !payload.payment.credit_card?.name) {
      throw new Error(t("credit_card_name_invalid"));
    }
  }

  private validateCreditCardConsistency(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto
  ) {
    if (payload.payment.credit_card && payload.payment.credit_card_id) {
      throw new Error(t("select_credit_card_or_credit_card_id"));
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

    const createSignatureProducts =
      await this.signatureService.createSignatureProducts(
        productsOrder,
        createSignature.id_assinatura_cliente,
        findSignatureActiveByClientId
      );

    if (!createSignatureProducts) {
      throw new Error(t("error_create_signature_products"));
    }

    return createSignature;
  }

  async viewOrderCreated(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    orderId: string
  ): Promise<OrderByNumberResponse | null> {
    const results = await this.orderService.viewOrderByNumber(
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
