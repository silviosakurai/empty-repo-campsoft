import { PaymentSplitRulesViewerRepository } from "@core/repositories/payment/PaymentSplitRulesViewer.repository";
import { injectable } from "tsyringe";

@injectable()
export class FinanceService {
  constructor(
    private readonly splitRulesViewerRepository: PaymentSplitRulesViewerRepository
  ) {}

  readSplitRules = async (ruleId: number) => {
    return this.splitRulesViewerRepository.view(ruleId);
  };
}
