import { PaymentSplitRulesListerRepository } from "@core/repositories/payment/PaymentSplitRulesLister.repository";
import { injectable } from "tsyringe";

@injectable()
export class FinanceService {
  constructor(
    private readonly splitRulesListerRepository: PaymentSplitRulesListerRepository
  ) {}

  async listSplitRules(ruleId: number) {
    return this.splitRulesListerRepository.list(ruleId);
  }
}
