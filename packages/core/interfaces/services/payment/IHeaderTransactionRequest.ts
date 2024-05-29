import { ISplitRuleRequest } from "./ISplitRule";

export interface IHeaderTransactionRequest {
  description?: string;
  sellerId: string;
  amount: number;
  split_rules?: ISplitRuleRequest[];
}
