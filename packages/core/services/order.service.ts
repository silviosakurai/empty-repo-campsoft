import { injectable } from "tsyringe";
import { OrdersListerRepository } from "@core/repositories/order/OrdersLister.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";
import { PaymentListerRepository } from "@core/repositories/order/PaymentsLister.repository";
import { OrderByNumberViewerRepository } from "@core/repositories/order/OrderByNumberViewer.repository";
import { OrderCreatedViewerRepository } from "@core/repositories/order/OrderCreatedViewer.repository";
import { OrderCreatorRepository } from "@core/repositories/order/OrderCreator.repository";
import {
  CreateOrderRequestDto,
  ViewOrderCreatedRequestDto,
} from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { PlanPrice } from "@core/common/enums/models/plan";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import {
  CreateOrder,
  ListOrderById,
  OrderCreatePaymentsCard,
} from "@core/interfaces/repositories/order";
import { OrderPaymentCreatorRepository } from "@core/repositories/order/OrderPaymentCreator.repository";
import { OrderStatusEnum } from "@core/common/enums/models/order";

@injectable()
export class OrderService {
  constructor(
    private readonly ordersListerRepository: OrdersListerRepository,
    private readonly paymentListerRepository: PaymentListerRepository,
    private readonly orderByNumberViewerRepository: OrderByNumberViewerRepository,
    private readonly orderCreatorRepository: OrderCreatorRepository,
    private readonly orderPaymentCreatorRepository: OrderPaymentCreatorRepository,
    private readonly OrderCreatedViewerRepository: OrderCreatedViewerRepository
  ) {}

  list = async (
    input: ListOrderRequestDto,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    return this.ordersListerRepository.list(input, tokenKeyData, tokenJwtData);
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
    planPrice: PlanPrice,
    user: ViewClientResponse,
    totalPricesInstallments: OrderCreatePaymentsCard
  ): Promise<CreateOrder | null> => {
    return this.orderCreatorRepository.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      planPrice,
      user,
      totalPricesInstallments
    );
  };

  createOrderPayment = async (
    order: ListOrderById,
    signatureId: string,
    methodId: string,
    statusPayment: OrderStatusEnum,
    voucher: string | null
  ) => {
    return this.orderPaymentCreatorRepository.create(
      order,
      signatureId,
      methodId,
      statusPayment,
      voucher
    );
  };

  viewOrderCreated = async (
    input: ViewOrderCreatedRequestDto,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    orderId: string
  ) => {
    try {
      return await this.OrderCreatedViewerRepository.viewOrderCreated(
        input,
        tokenKeyData,
        tokenJwtData,
        orderId
      );
    } catch (error) {
      throw error;
    }
  };
}
