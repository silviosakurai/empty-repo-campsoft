import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";

export async function createCustomer() {
  try {
  } catch (error) {
    return {
      status: false,
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    };
  }
}
