import { YesOrNo } from '@core/common/enums/YesOrNo';
import { IPaginationServiceRequest } from '@core/common/interfaces/IPaginationServiceRequest';
import { IPaginationServiceResponse } from '@core/common/interfaces/IPaginationServiceResponse';
import { ResponseService } from '@core/common/interfaces/IResponseServices';

export interface ICampsoftGatewayCustomers {
  getAllCustomers: (input: ICampsoftGetAllCustomersInput) => Promise<ResponseService<ICampsoftGetAllCustomersResponse>>;
  createCustomer: (input: ICampsoftCreateCustomerInput) => Promise<ResponseService<ICustomerResponse>>;
  getCustomerByUsername: (input: IUsernameInput) => Promise<ResponseService<ICustomerResponse>>;
  updateCustomer: (input: ICampsoftUptadeCustomerInput) => Promise<ResponseService<ICampsoftGetAllCustomersResponse>>;
  inactiveCustomer: (input: IUsernameInput) => Promise<ResponseService<ICampsoftGetAllCustomersResponse>>;
  deleteAddressCustomer: (input: IUsernameInput) => Promise<ResponseService<ICampsoftGetAllCustomersResponse>>;
  generateHashCustomer: (input: IUsernameInput) => Promise<ResponseService<IHashResponse>>;
};

export type IHashResponse = {
  username: string;
  status: string;
  name: string;
  login: string;
  password: string;
  meuApp: IMeuApp;
  createdAt: string;
  updatedAt: string;
};

export type IMeuApp = {
  hash: string;
  link: string;
  expires: string;
};

export type ICustomerResponse = ICustomer & {
  phone: IPhone;
  address: IAddress;
};

export type ICampsoftUptadeCustomerInput = ICustomer & {
  phone: IPhone;
  address: IAddress;
};

export type ICampsoftCreateCustomerInput = ICustomer & {
  phone: IPhone;
  address: IAddress;
};

export type IUsernameInput = {
  username: string;
};

export type ICustomer = {
  username: string;
  status: string;
  name: string;
  login: string;
  password: string;
  username_type: string;
};

export type ICampsoftGetAllCustomersResponse = IPaginationServiceResponse &
  ICustomer & {
    data?: [
      ICustomer & {
        document: IDocument;
        email: IEmail;
        phone: IPhone;
        address: IAddress;
      },
    ];
  };

export type ICampsoftGetAllCustomersInput = IPaginationServiceRequest & {
  status?: string;
  name?: string;
  document?: string;
  phone?: string;
  email?: string;
  username?: string;
};

export type IAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

export type IPhone = {
  ddi: string;
  ddd: string;
  number: string;
  mobile: YesOrNo;
  repeat: YesOrNo;
};

export type IDocument = {
  type: string;
  number: string;
};

export type IEmail = {
  data: string;
  repeat: YesOrNo;
};

export type IResponseError = {
  status: string;
  error_id: string;
  origem: string;
  message: string;
};
