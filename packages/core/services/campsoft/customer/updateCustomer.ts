import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { generalEnvironment } from "@core/config/environments";
import { ICampsoftUptadeCustomerInput, ICustomerResponse, IResponseError } from "@core/interfaces/services/ICampsoftGatewayCustomers.service";
import axios from "axios";

export async function updateCustomer(input: ICampsoftUptadeCustomerInput): Promise<ResponseService<ICustomerResponse>> {
  try {
    const params = input as Record<string, unknown>;
    delete params.username;

    const response = await axios.put<ICustomerResponse & IResponseError>(
      `${generalEnvironment.apiCampsoft}/customers/${input.username}`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          ApiKey: generalEnvironment.apiKeyCampsoft,
          'User-Agent': 'Mania de App (API)',
        },
      }
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