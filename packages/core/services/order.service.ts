import { injectable } from "tsyringe";
import { OrdersListerRepository } from "@core/repositories/order/OrdersLister.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";
import { PaymentListerRepository } from "@core/repositories/order/PaymentsLister.repository";
import { OrderByNumberViewerRepository } from "@core/repositories/order/OrderByNumberViewer.repository";
import { OrderCreatorRepository } from "@core/repositories/order/OrderCreator.repository";
import { OrderPaymentHistoricViewerRepository } from "@core/repositories/order/OrderPaymentHistoricViewer.repository";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import {
  CreateOrder,
  ListOrderById,
  OrderCreatePaymentsCard,
  OrderPaymentUpdateInput,
} from "@core/interfaces/repositories/order";
import { OrderPaymentCreatorRepository } from "@core/repositories/order/OrderPaymentCreator.repository";
import {
  OrderPaymentsMethodsEnum,
  OrderStatusEnum,
} from "@core/common/enums/models/order";
import { CouponService } from "./coupon.service";
import { OrderStatusUpdaterRepository } from "@core/repositories/order/OrderStatusUpdater.repository";
import { OrderViewerByTransactionIdRepository } from "@core/repositories/order/OrderViewerByTransactionId.repository";
import { OrderByNumberViewerByManagerRepository } from "@core/repositories/order/OrderByNumberViewerByManager.repository";
import { OrderCreatorByManagerRepository } from "@core/repositories/order/OrderCreatorByManager.repository";
import {
  CartDocument,
  CartDocumentManager,
} from "@core/interfaces/repositories/cart";

@injectable()
export class OrderService {
  constructor(
    private readonly couponService: CouponService,
    private readonly orderCreatorRepository: OrderCreatorRepository,
    private readonly orderCreatorByManagerRepository: OrderCreatorByManagerRepository,
    private readonly ordersListerRepository: OrdersListerRepository,
    private readonly paymentListerRepository: PaymentListerRepository,
    private readonly orderStatusUpdaterRepository: OrderStatusUpdaterRepository,
    private readonly orderByNumberViewerRepository: OrderByNumberViewerRepository,
    private readonly orderByNumberViewerByManagerRepository: OrderByNumberViewerByManagerRepository,
    private readonly orderPaymentCreatorRepository: OrderPaymentCreatorRepository,
    private readonly viewerByTransactionIdRepository: OrderViewerByTransactionIdRepository,
    private readonly orderPaymentHistoricViewerRepository: OrderPaymentHistoricViewerRepository
  ) {}

  list = async (
    input: ListOrderRequestDto,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    return this.ordersListerRepository.list(input, tokenKeyData, tokenJwtData);
  };

  listWithRecurrence = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    return this.ordersListerRepository.listWithRecurrence(
      tokenKeyData,
      tokenJwtData
    );
  };

  countTotal = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    return this.ordersListerRepository.countTotal(tokenKeyData, tokenJwtData);
  };

  viewOrderByNumber = async (
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    return this.orderByNumberViewerRepository.view(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );
  };

  viewOrderByNumberByManager = async (
    orderNumber: string,
    tokenJwtData: ITokenJwtData,
    cart: CartDocumentManager
  ) => {
    return this.orderByNumberViewerByManagerRepository.view(
      orderNumber,
      tokenJwtData,
      cart
    );
  };

  listPayment = async (orderId: string) => {
    return this.paymentListerRepository.list(orderId);
  };

  listOrderById = async (orderId: string) => {
    return this.ordersListerRepository.listOrderById(orderId);
  };

  orderIsExists = async (orderId: string) => {
    return this.ordersListerRepository.orderIsExists(orderId);
  };

  create = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    cart: CartDocument,
    user: ViewClientResponse,
    totalPricesInstallments: OrderCreatePaymentsCard,
    splitRuleId: number
  ): Promise<string | null> => {
    const create = await this.orderCreatorRepository.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      cart,
      user,
      totalPricesInstallments,
      splitRuleId
    );

    if (!create) {
      return null;
    }

    if (cart.payload.coupon_code) {
      await this.couponService.updateCoupon(cart.payload.coupon_code);
    }

    return create;
  };

  createByManager = async (
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    cart: CartDocumentManager,
    user: ViewClientResponse,
    totalPricesInstallments: OrderCreatePaymentsCard,
    splitRuleId: number
  ): Promise<string | null> => {
    const create = await this.orderCreatorByManagerRepository.create(
      tokenJwtData,
      payload,
      cart,
      user,
      totalPricesInstallments,
      splitRuleId
    );

    if (!create) {
      return null;
    }

    if (cart.payload.coupon_code) {
      await this.couponService.updateCoupon(cart.payload.coupon_code);
    }

    return create;
  };

  createOrderPayment = async (
    order: ListOrderById,
    signatureId: string,
    methodId: OrderPaymentsMethodsEnum,
    statusPayment: OrderStatusEnum,
    input: OrderPaymentUpdateInput
  ) => {
    return this.orderPaymentCreatorRepository.create(
      order,
      signatureId,
      methodId,
      statusPayment,
      input
    );
  };

  updateStatusByOrderId = async (orderId: string, status: OrderStatusEnum) => {
    return this.orderStatusUpdaterRepository.update(orderId, status);
  };

  viewByTransactionId = async (transactionId: string) => {
    return this.viewerByTransactionIdRepository.find(transactionId);
  };

  viewPaymentHistoric = async (
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    return this.orderPaymentHistoricViewerRepository.view(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );
  };
}
