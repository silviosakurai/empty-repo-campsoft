import { Permissions } from '@core/common/enums/Permissions';

export const orderListPermissions = [Permissions.ORDER_LIST];

export const orderCreatePermissions = [Permissions.ORDER_CREATE];

export const orderViewPermissions = [Permissions.ORDER_VIEW];

export const orderNumberPaymentViewPermissions = [
  Permissions.ORDER_PAYMENTS_VIEW,
];

export const orderNumberCancelPermissions = [Permissions.ORDER_CANCEL];

export const orderPaymentBoletoPermissions = [Permissions.ORDER_PAYMENT_BOLETO];

export const orderPaymentCreditCardPermissions = [
  Permissions.ORDER_PAYMENT_CREDIT_CARD,
];

export const orderPaymentPixPermissions = [Permissions.ORDER_PAYMENT_PIX];
