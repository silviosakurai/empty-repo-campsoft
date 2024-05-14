import {
  FinanceSplitListIsMain,
  FinanceSplitListPercentageAmount,
} from "@core/common/enums/models/financeSplitList";

export interface PaymentSplitRulesListerResponse {
  name: string | null;
  recipient: string;
  liable: boolean;
  charge_processing_fee: boolean;
  amount: number;
  charge_recipient_processing_fee: boolean;
  is_gross_amount: boolean;
  isMain: FinanceSplitListIsMain | null;
  percentage_or_amount: FinanceSplitListPercentageAmount;
}
