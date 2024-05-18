import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { injectable } from "tsyringe";
import { OrderService } from "./order.service";
import { SignatureService } from "./signature.service";
import { CartDocument } from "@core/interfaces/repositories/cart";

@injectable()
export class OrderValidationService {
  constructor(
    private readonly orderService: OrderService,
    private readonly signatureService: SignatureService
  ) {}

  async validatePaymentMethod(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    cart: CartDocument
  ) {
    this.validateCardPaymentMethod(t, payload, cart);
    this.validatePaymentMethodType(t, payload);
    this.validateMonthsRequired(t, cart);

    await Promise.all([
      this.validatePreviousOrder(t, cart),
      this.validateSignaturePlan(t, tokenJwtData, cart),
    ]);

    if (
      payload.payment?.type?.toString() === OrderPaymentsMethodsEnum.CARD &&
      !payload.payment.credit_card_id
    ) {
      this.validateCVV(t, payload);
      this.validateExpireMonth(t, payload);
      this.validateExpireYear(t, payload);
      this.validateInstallments(t, payload);
      this.validateCreditCardNumber(t, payload);
      this.validateCreditCardName(t, payload);
    }

    this.validateCreditCardConsistency(t, payload);
  }

  private validateCardPaymentMethod(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto,
    cart: CartDocument
  ) {
    if (
      cart.payload.subscribe &&
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
    cart: CartDocument
  ) {
    if (!cart.payload.months) {
      throw new Error(t("months_required_by_methods"));
    }
  }

  private async validatePreviousOrder(
    t: TFunction<"translation", undefined>,
    cart: CartDocument
  ) {
    if (cart.payload?.previous_order_id) {
      const orderIsExists = await this.orderService.orderIsExists(
        cart.payload.previous_order_id
      );

      if (!orderIsExists) {
        throw new Error(t("previous_order_not_found"));
      }
    }
  }

  private async validateSignaturePlan(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    cart: CartDocument
  ) {
    if (cart.payload.subscribe) {
      const isSignaturePlanActive =
        await this.signatureService.isSignaturePlanActiveByClientId(
          tokenJwtData.clientId,
          cart.payload.plan.plan_id
        );

      if (isSignaturePlanActive) {
        throw new Error(t("plan_already_active"));
      }
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
}
