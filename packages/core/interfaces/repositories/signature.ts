import { ClientSignatureRecorrencia } from "@core/common/enums/models/signature";
import { signatureLoginPublicSchema } from "@core/schema/login/loginResponseSchema";
import { productSingleViewSchema } from "@core/schema/product/productSingleViewSchema";
import { Static } from "@sinclair/typebox";

export interface ISignatureFindByClientId {
  product_id: string;
}

export interface ISignatureLister {
  id: string;
}

export interface ISignatureProductLister {
  product_id: string;
}

export interface ISignatureFindByOrder {
  signature_id: string;
  product_id: string;
  product_cancel_date: string;
}

export interface ISignatureByOrder {
  signature_id: string;
  client_id: string;
  plan_id: number;
  recurrence: number;
  recurrence_period: number;
  cycle: number;
  start_date: string;
  signature_date: string;
  next_billing_date: string;
}

export interface ISignatureActiveByClient {
  product_id: string;
  discount_percentage: number;
  recurrence: ClientSignatureRecorrencia;
  expiration_date: string;
}

export interface IUpdateAndSelectProductExpirationDates {
  signature_id: string;
  product_id: string;
  expiration_date: string;
}

export interface ISelectSignatureProductsActive {
  signature_id: string;
  product_id: string;
}

export type IFindSignatureActiveByClientId = Static<
  typeof signatureLoginPublicSchema
>;

export type ProductSingleView = Static<typeof productSingleViewSchema>;
