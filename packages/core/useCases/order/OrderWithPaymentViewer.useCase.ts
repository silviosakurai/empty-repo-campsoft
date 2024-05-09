import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ClientService, OrderService } from "@core/services";
import { ClientPaymentExternalGeneratorUseCase } from "../client/ClientPaymentExternalGenerator.useCase";
import { PaymentSplitRulesViewerRepository } from "@core/repositories/payment/PaymentSplitRulesViewer.repository";
import { FinanceSplitListIsMain } from "@core/common/enums/models/financeSplitList";

@injectable()
export class OrderWithPaymentReaderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly splitRulesViewerRepository: PaymentSplitRulesViewerRepository,
    private readonly paymentExternalGeneratorUseCase: ClientPaymentExternalGeneratorUseCase
  ) {}

  async view(t: TFunction<"translation", undefined>, orderId: string) {
    const order = await this.orderService.listOrderById(orderId);

    if (!order) {
      throw new Error(t("order_not_found"));
    }

    const { sellerId, splitList } = await this.generateSellers(
      order.split_rule_id
    );

    if (!sellerId) {
      throw new Error(t("seller_not_found"));
    }

    const client = await this.clientService.view(order.client_id);

    if (!client) {
      throw new Error(t("client_not_found"));
    }

    const clientPayment = await this.clientService.viewPaymentClient(
      client.client_id
    );

    const externalId = clientPayment
      ? clientPayment.external_id
      : await this.paymentExternalGeneratorUseCase.generate(t, client);

    return { order, sellerId, externalId, splitList };
  }

  private async generateSellers(ruleId: number) {
    const sellers = await this.splitRulesViewerRepository.view(ruleId);

    if (!sellers) {
      throw new Error("");
    }

    const mainSeller = sellers.find(
      (item) => item.isMain === FinanceSplitListIsMain.YES
    );

    if (!mainSeller) throw new Error("");

    const splitList = sellers.filter(
      (item) => item.recipient !== mainSeller.recipient
    );

    return { sellerId: mainSeller.recipient, splitList };
  }
}
// TODO: inserir mensagem nos erros && alterar injeção do repository para o service
