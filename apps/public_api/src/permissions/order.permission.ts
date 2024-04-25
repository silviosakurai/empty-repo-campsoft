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
