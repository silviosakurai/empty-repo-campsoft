import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ClientService, FinanceService, OrderService } from "@core/services";
import { ClientPaymentExternalGeneratorUseCase } from "../client/ClientPaymentExternalGenerator.useCase";
import { FinanceSplitListIsMain } from "@core/common/enums/models/financeSplitList";
import { PaymentSplitRulesListerResponse } from "@core/interfaces/repositories/payment";
import { ISplitRuleRequest } from "@core/interfaces/services/payment/ISplitRule";
import { PaymentSplitRulesListerRepository } from "@core/repositories/payment/PaymentSplitRulesLister.repository";

@injectable()
export class OrderWithPaymentReaderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly financeService: FinanceService,
    private readonly paymentExternalGeneratorUseCase: ClientPaymentExternalGeneratorUseCase
  ) {}

  async view(t: TFunction<"translation", undefined>, orderId: string) {
    const order = await this.orderService.listOrderById(orderId);
    if (!order) {
      throw new Error(t("order_not_found"));
    }

    const { sellerId, splitList } = await this.generateSellers(
      order.split_rule_id,
      t
    );

    if (!sellerId) {
      throw new Error(t("seller_not_found"));
    }

    const splitRules = this.generateSplitListRules(splitList);

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

    return { order, sellerId, externalId, splitList: splitRules };
  }

  private async generateSellers(
    ruleId: number,
    t: TFunction<"translation", undefined>
  ) {
    const sellers = await this.financeService.listSplitRules(ruleId);

    if (!sellers) {
      throw new Error(t("seller_not_found"));
    }

    const mainSeller = sellers.find(
      (item) => item.isMain === FinanceSplitListIsMain.YES
    );

    if (!mainSeller) throw new Error(t("main_seller_not_found"));

    const splitList = sellers.filter(
      (item) => item.recipient !== mainSeller.recipient
    );

    return { sellerId: mainSeller.recipient, splitList };
  }

  private generateSplitListRules(list: PaymentSplitRulesListerResponse[]) {
    const result = list.map((item): ISplitRuleRequest => {
      const commonItemsInReturn = {
        recipient: item.recipient,
        liable: item.liable,
        charge_processing_fee: item.charge_processing_fee,
      };

      if (item.percentage_or_amount === "amount") {
        if (item.is_gross_amount && item.charge_processing_fee) {
          return {
            type: "amount_recipient_assumes_full_value",
            ...commonItemsInReturn,
            amount: item.amount,
            is_gross_amount: item.is_gross_amount,
          };
        }

        if (
          item.charge_recipient_processing_fee &&
          !item.charge_processing_fee
        ) {
          return {
            type: "amount_recipient",
            ...commonItemsInReturn,
            amount: item.amount,
            charge_recipient_processing_fee:
              item.charge_recipient_processing_fee,
          };
        }

        return {
          type: "seller_tax_amount",
          ...commonItemsInReturn,
          amount: item.amount,
        };
      }

      if (!item.charge_processing_fee && item.charge_recipient_processing_fee) {
        return {
          type: "percentage_recipient",
          ...commonItemsInReturn,
          charge_recipient_processing_fee: item.charge_recipient_processing_fee,
          percentage: item.amount,
        };
      }

      return {
        type: "percentage",
        ...commonItemsInReturn,
        percentage: item.amount,
      };
    });

    return result;
  }
}
// TODO: inserir mensagem nos erros && alterar injeção do repository para o service
