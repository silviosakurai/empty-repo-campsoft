
import { ICampsoftGatewayCustomers } from '@core/interfaces/services/ICampsoftGatewayCustomers.service';
import { getAllCustomers } from './campsoft/customer/getAllCustomer';
import { createCustomer } from './campsoft/customer/createCustomer';
import { getCustomerByUsername } from './campsoft/customer/getCustomerByUsername';
import { updateCustomer } from './campsoft/customer/updateCustomer';
import { inactiveCustomer } from './campsoft/customer/inactiveCustomer';
import { deleteAddressCustomer } from './campsoft/customer/deleteAddressCustomer';
import { generateHashCustomer } from './campsoft/customer/generateHashCustomer';
import { injectable } from 'tsyringe';

@injectable()
export class CampsoftGatewayCustomer implements ICampsoftGatewayCustomers {
  getAllCustomers = getAllCustomers;
  createCustomer = createCustomer;
  getCustomerByUsername = getCustomerByUsername;
  updateCustomer = updateCustomer;
  inactiveCustomer = inactiveCustomer; 
  deleteAddressCustomer = deleteAddressCustomer;
  generateHashCustomer = generateHashCustomer;
}
