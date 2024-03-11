import { IAccessCreate } from "@core/interfaces/repositories/access";
import { AccessCreator } from "@core/repositories/access/AccessCreator";
import { injectable } from "tsyringe";

@injectable()
export class AccessService {
  private accessCreator: AccessCreator;

  constructor(accessCreator: AccessCreator) {
    this.accessCreator = accessCreator;
  }

  create = async (input: IAccessCreate) => {
    try {
      return await this.accessCreator.create(input);
    } catch (error) {
      throw error;
    }
  };
}
