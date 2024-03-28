import { IAccessCreate } from "@core/interfaces/repositories/access";
import { AccessCreator } from "@core/repositories/access/AccessCreator";
import { injectable } from "tsyringe";

@injectable()
export class AccessService {
  constructor(private readonly accessCreator: AccessCreator) {}

  create = async (input: IAccessCreate) => {
    try {
      return await this.accessCreator.create(input);
    } catch (error) {
      throw error;
    }
  };
}
