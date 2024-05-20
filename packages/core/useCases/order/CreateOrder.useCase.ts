import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { TFunction } from "i18next";
import { OrderByNumberCreateResponse } from "@core/interfaces/repositories/order";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { PriceService } from "@core/services/price.service";
import { PaymentService } from "@core/services/payment.service";
import { ClientService } from "@core/services/client.service";
import { OrderValidationService } from "@core/services/orderValidation.service";
import OpenSearchService from "@core/services/openSearch.service";

@injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly priceService: PriceService,
    private readonly paymentService: PaymentService,
    private readonly orderValidationService: OrderValidationService,
    private readonly openSearchService: OpenSearchService
  ) {}

  async execute(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    splitRuleId: number
  ) {
    const cart = await this.openSearchService.getCart(payload.cart_id);

    if (!cart) {
      throw new Error(t("cart_not_found"));
    }

    await this.orderValidationService.validatePaymentMethod(
      t,
      tokenJwtData,
      payload,
      cart
    );

    const userFounded = await this.clientService.view(tokenJwtData.clientId);

    if (!userFounded) {
      throw new Error(t("client_not_found"));
    }

    const totalPricesInstallments =
      this.priceService.calculatePriceInstallments(payload, cart.total_prices);

    if (!totalPricesInstallments) {
      throw new Error(t("installments_not_calculated"));
    }

    const createOrder = await this.orderService.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      cart,
      userFounded,
      totalPricesInstallments,
      splitRuleId
    );

    if (!createOrder) {
      throw new Error(t("error_create_order"));
    }

    await this.payWith(t, payload, createOrder);

    return this.viewOrderCreated(tokenKeyData, tokenJwtData, createOrder);
  }

  private async payWith(
    t: TFunction<"translation", undefined>,
    payload: CreateOrderRequestDto,
    orderId: string
  ): Promise<void> {
    const paymentType = payload.payment?.type?.toString();

    switch (paymentType) {
      case OrderPaymentsMethodsEnum.CARD:
        return this.paymentService.payWithCard(t, orderId, payload.payment);
      case OrderPaymentsMethodsEnum.BOLETO:
        return this.paymentService.payWithBoleto(t, orderId);
      case OrderPaymentsMethodsEnum.PIX:
        return this.paymentService.payWithPix(t, orderId);
    }
  }

  async viewOrderCreated(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    orderId: string
  ): Promise<OrderByNumberCreateResponse | null> {
    const results = await this.orderService.viewOrderByNumberByCreate(
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
