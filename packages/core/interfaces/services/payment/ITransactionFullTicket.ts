import { ITransactionSimpleTicketRequest, ITransactionSimpleTicketResponse } from './ITransactionSimpleTicket';

export interface ITransactionFullTicketRequest extends ITransactionSimpleTicketRequest {
  logo?: string;
  expirationDate?: string;
  paymentLimitDate?: string;
  bodyInstructions?: string[];
  lateFee?: {
    mode: FeeEnum;
    amount?: number;
    percentage?: number;
    startDate?: string;
  };
  interest?: {
    mode?: InterestEnum;
    amount?: number;
    percentage?: number;
    startDate?: string;
  };
  discounts?: [
    {
      mode?: FeeEnum;
      amount?: number;
      limitDate?: string;
    },
  ];
}

export interface ITransactionFullTicketResponse extends ITransactionSimpleTicketResponse {}

export enum FeeEnum {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export enum InterestEnum {
  DAILY_AMOUNT = 'DAILY_AMOUNT',
  DAILY_PERCENTAGE = 'DAILY_PERCENTAGE',
  MONTHLY_PERCENTAGE = 'MONTHLY_PERCENTAGE',
}
