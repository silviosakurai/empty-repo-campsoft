type SplitRuleRequestBase = {
  recipient: string;
  charge_processing_fee: boolean;
  liable?: boolean;
};

type SplitRulesBySellerTax = {
  type: "seller_tax_amount";
  amount: number;
};

type SplitByPercentage = {
  type: "percentage";
  percentage: number;
};

type SplitByPercentageRecipient = {
  type: "percentage_recipient";
  charge_recipient_processing_fee: boolean;
  percentage: number;
};

type SplitByAmountRecipient = {
  type: "amount_recipient";
  charge_recipient_processing_fee: boolean;
  amount: number;
};

type SplitByAmountRecipientAssumesFullValue = {
  type: "amount_recipient_assumes_full_value";
  amount: number;
  is_gross_amount: boolean;
};

export type ISplitRuleRequest =
  | (SplitRuleRequestBase & SplitRulesBySellerTax)
  | (SplitRuleRequestBase & SplitByPercentage)
  | (SplitRuleRequestBase & SplitByPercentageRecipient)
  | (SplitRuleRequestBase & SplitByAmountRecipient)
  | (SplitRuleRequestBase & SplitByAmountRecipientAssumesFullValue);
