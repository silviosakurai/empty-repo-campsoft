import { injectable } from "tsyringe";
import { OrdersListerRepository } from "@core/repositories/order/OrdersLister.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";
import { PaymentListerRepository } from "@core/repositories/order/PaymentsLister.repository";
import { OrderByNumberViewerRepository } from "@core/repositories/order/OrderByNumberViewer.repository";
import { OrderCreaterRepository } from "@core/repositories/order/OrderCreater.repository";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { PlanPrice } from "@core/common/enums/models/plan";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { OrderCreatePaymentsCard } from "@core/interfaces/repositories/order";

@injectable()
export class OrderService {
  constructor(
    private readonly ordersListerRepository: OrdersListerRepository,
    private readonly paymentListerRepository: PaymentListerRepository,
    private readonly orderByNumberViewerRepository: OrderByNumberViewerRepository,
    private readonly orderCreaterRepository: OrderCreaterRepository
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

  create = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    planPrice: PlanPrice,
    user: ViewClientResponse,
    totalPricesInstallments: OrderCreatePaymentsCard
  ) => {
    return this.orderCreaterRepository.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      planPrice,
      user,
      totalPricesInstallments
    );
  };
}
