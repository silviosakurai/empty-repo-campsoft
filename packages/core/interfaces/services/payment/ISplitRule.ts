export type ISplitRuleRequest = {
  recipient: string;
  charge_processing_fee: boolean;
  liable?: boolean;
} & SplitRulesBySellerTax &
  SplitByPercentage &
  SplitByPercentageRecipient &
  SplitByAmountRecipient &
  SplitByAmountRecipientAssumesFullValue;

type SplitRulesBySellerTax = {
  amount: number;
};

type SplitByPercentage = {
  percentage: number;
};

type SplitByPercentageRecipient = {
  charge_recipient_processing_fee: boolean;
} & SplitByPercentage;

type SplitByAmountRecipient = {
  charge_recipient_processing_fee: boolean;
} & SplitRulesBySellerTax;

type SplitByAmountRecipientAssumesFullValue = {
  is_gross_amount: boolean;
} & SplitRulesBySellerTax;
