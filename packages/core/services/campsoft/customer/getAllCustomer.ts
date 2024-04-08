import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { generateQueryString } from "@core/common/functions/generateQueryString";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { generalEnvironment } from "@core/config/environments";
import { ICampsoftGetAllCustomersInput, ICampsoftGetAllCustomersResponse, IResponseError } from "@core/interfaces/services/ICampsoftGatewayCustomers.service";
import axios from "axios";

export async function getAllCustomers(
  input: ICampsoftGetAllCustomersInput,
): Promise<ResponseService<ICampsoftGetAllCustomersResponse>> {
  try {
    const response = await axios.get<ICampsoftGetAllCustomersResponse & IResponseError>(
      `${generalEnvironment.apiCampsoft}/customers${generateQueryString(input)}`,
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