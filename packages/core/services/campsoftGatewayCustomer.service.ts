import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { ResponseService } from '@core/common/interfaces/IResponseServices';
import { generalEnvironment } from '@core/config/environments';
import {
  ICampsoftCreateCustomerInput,
  ICampsoftGatewayCustomers,
  ICampsoftGetAllCustomersInput,
  ICampsoftGetAllCustomersResponse,
  ICampsoftUptadeCustomerInput,
  ICustomerResponse,
  IHashResponse,
  IResponseError,
  IUsernameInput,
} from '@core/interfaces/services/ICampsoftGatewayCustomers.service';
import axios from 'axios';

export class CampsoftGatewayCustomer implements ICampsoftGatewayCustomers {
  async getAllCustomers(
    input: ICampsoftGetAllCustomersInput,
  ): Promise<ResponseService<ICampsoftGetAllCustomersResponse>> {
    try {
      const response = await axios.get<ICampsoftGetAllCustomersResponse & IResponseError>(
        `${generalEnvironment.apiCampsoft}/customers${this.generateQueryString(input)}`,
        {
          ...this.getHeaders(),
        },
      );
      if (response.status === HTTPStatusCode.OK) {
        return {
          status: true,
          data: response.data,
        };
      }
      return { status: false, message: response?.data?.message };
    } catch (error) {
      return { status: false };
    }
  }

  async createCustomer(input: ICampsoftCreateCustomerInput): Promise<ResponseService<ICustomerResponse>> {
    try {
      const response = await axios.post<ICustomerResponse & IResponseError>(
        `${generalEnvironment.apiCampsoft}/customers`,
        input,
        {
          ...this.getHeaders(),
        },
      );
      if (response.status === HTTPStatusCode.OK) {
        return {
          status: true,
          data: response.data,
        };
      }
      return { status: false, message: response?.data?.message };
    } catch (error) {
      return { status: false };
    }
  }

  async getCustomerByUsername(input: IUsernameInput): Promise<ResponseService<ICustomerResponse>> {
    try {
      const response = await axios.get<ICustomerResponse & IResponseError>(
        `${generalEnvironment.apiCampsoft}/customers/${input.username}`,
        {
          ...this.getHeaders(),
        },
      );
      if (response.status === HTTPStatusCode.OK) {
        return {
          status: true,
          data: response.data,
        };
      }
      return { status: false, message: response?.data?.message };
    } catch (error) {
      return { status: false };
    }
  }

  async updateCustomer(input: ICampsoftUptadeCustomerInput): Promise<ResponseService<ICustomerResponse>> {
    try {
      const params = input as Record<string, unknown>;
      delete params.username;

      const response = await axios.put<ICustomerResponse & IResponseError>(
        `${generalEnvironment.apiCampsoft}/customers/${input.username}`,
        params,
        {
          ...this.getHeaders(),
        },
      );
      if (response.status === HTTPStatusCode.OK) {
        return {
          status: true,
          data: response.data,
        };
      }
      return { status: false, message: response?.data?.message };
    } catch (error) {
      return { status: false };
    }
  }
  async inactiveCustomer(input: IUsernameInput): Promise<ResponseService<ICustomerResponse>> {
    try {
      const response = await axios.patch<ICustomerResponse & IResponseError>(
        `${generalEnvironment.apiCampsoft}/customers/${input.username}/inactive`,
        {},
        {
          ...this.getHeaders(),
        },
      );
      if (response.status === HTTPStatusCode.OK) {
        return {
          status: true,
          data: response.data,
        };
      }
      return { status: false, message: response?.data?.message };
    } catch (error) {
      return { status: false };
    }
  }

  async deleteAddressCustomer(input: IUsernameInput): Promise<ResponseService<ICampsoftGetAllCustomersResponse>> {
    try {
      const response = await axios.delete<ICustomerResponse & IResponseError>(
        `${generalEnvironment.apiCampsoft}/customers/${input.username}/address`,
        {
          ...this.getHeaders(),
        },
      );
      if (response.status === HTTPStatusCode.OK) {
        return {
          status: true,
          data: response.data,
        };
      }
      return { status: false, message: response?.data?.message };
    } catch (error) {
      return { status: false };
    }
  }

  async generateHashCustomer(input: IUsernameInput): Promise<ResponseService<IHashResponse>> {
    try {
      const response = await axios.get<IHashResponse & IResponseError>(
        `${generalEnvironment.apiCampsoft}/customers/${input.username}/sso`,
        {
          ...this.getHeaders(),
        },
      );
      if (response.status === HTTPStatusCode.OK) {
        return {
          status: true,
          data: response.data,
        };
      }
      return { status: false, message: response?.data?.message };
    } catch (error) {
      return { status: false };
    }
  }

  private getHeaders() {
    return {
      headers: {
        'Content-Type': 'application/json',
        ApiKey: generalEnvironment.apiKeyCampsoft,
        'User-Agent': 'Mania de App (API)',
      },
    };
  }

  private generateQueryString(input: ICampsoftGetAllCustomersInput): string {
    const keys = Object.keys(input);
    const query = keys.reduce((previousValue, key, index) => {
      const plainInput = input as Record<string, unknown>;
      if (index === 0) previousValue += `?${key}=${plainInput[key]}`;
      else previousValue += `&${key}=${plainInput[key]}`;
      return previousValue;
    }, '');

    return query;
  }
}
