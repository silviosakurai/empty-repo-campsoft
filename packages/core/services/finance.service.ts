import { injectable } from "tsyringe";
import { PaymentSplitRulesListerRepository } from "@core/repositories/payment/PaymentSplitRulesLister.repository";

@injectable()
export class FinanceService {
  constructor(
    private readonly paymentSplitRulesListerRepository: PaymentSplitRulesListerRepository
  ) {}

  listSplitRules = async (ruleId: number) => {
    return this.paymentSplitRulesListerRepository.list(ruleId);
  };
}
