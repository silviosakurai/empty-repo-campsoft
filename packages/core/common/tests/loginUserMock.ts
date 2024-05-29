import { LoginUserTFA } from "@core/interfaces/services/IClient.service";
import { faker } from "@faker-js/faker";

export function loginUserMock(input?: Partial<LoginUserTFA>) {
  const loginUser: LoginUserTFA = {
    clientId: input?.clientId ?? faker.string.uuid(),
    login: input?.login ?? faker.internet.email(),
  };

  return loginUser;
}
