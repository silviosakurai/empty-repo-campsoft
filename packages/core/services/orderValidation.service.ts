import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { injectable } from "tsyringe";
import { OrderService } from "./order.service";
import { SignatureService } from "./signature.service";

@injectable()
export class OrderValidationService {
  constructor(
    private readonly orderService: OrderService,
    private readonly signatureService: SignatureService
  ) {}

  async validatePaymentMethod(
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
}
