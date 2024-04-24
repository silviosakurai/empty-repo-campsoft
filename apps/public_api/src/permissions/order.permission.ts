import { Permissions } from '@core/common/enums/Permissions';

export const orderViewPermissions = [Permissions.ORDER_VIEW];

export const orderCreatePermissions = [Permissions.ORDER_CREATE];

export const orderNumberViewPermissions = [Permissions.ORDER_VIEW];

export const orderNumberPaymentViewPermissions = [
  Permissions.ORDER_PAYMENTS_VIEW,
];

export const orderNumberCancelPermissions = [Permissions.ORDER_CANCEL];

export const orderPaymentBoletoPermissions = [Permissions.ORDER_PAYMENT_BOLETO];
