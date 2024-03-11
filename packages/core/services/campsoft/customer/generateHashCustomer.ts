import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { generalEnvironment } from "@core/config/environments";
import { IHashResponse, IResponseError, IUsernameInput } from "@core/interfaces/services/ICampsoftGatewayCustomers.service";
import axios from "axios";

export async function generateHashCustomer(input: IUsernameInput): Promise<ResponseService<IHashResponse>> {
  try {
    const response = await axios.get<IHashResponse & IResponseError>(
      `${generalEnvironment.apiCampsoft}/customers/${input.username}/sso`,
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
