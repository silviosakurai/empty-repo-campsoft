import { PermissionsRoles } from '@core/common/enums/PermissionsRoles';

export const orderListPermissions = [PermissionsRoles.ORDER_LIST];

export const orderCreatePermissions = [PermissionsRoles.ORDER_CREATE];

export const orderViewPermissions = [PermissionsRoles.ORDER_VIEW];

export const orderNumberPaymentViewPermissions = [
  PermissionsRoles.ORDER_PAYMENTS_VIEW,
];

export const orderNumberCancelPermissions = [PermissionsRoles.ORDER_CANCEL];

export const orderPaymentBoletoPermissions = [
  PermissionsRoles.ORDER_PAYMENT_BOLETO,
];

export const orderPaymentCreditCardPermissions = [
  PermissionsRoles.ORDER_PAYMENT_CREDIT_CARD,
];

export const orderPaymentPixPermissions = [PermissionsRoles.ORDER_PAYMENT_PIX];

export const orderHistoricViewPermissions = [
  PermissionsRoles.ORDER_HISTORIC_VIEW,
];

export const orderVoucherPermissions = [PermissionsRoles.ORDER_VOUCHER];
