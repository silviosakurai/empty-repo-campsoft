import { PermissionCreatorRepository } from "@core/repositories/permission/PermissionCreator.repository";
import { injectable } from "tsyringe";

@injectable()
export class PermissionService {
  constructor(
    private readonly permissionCreatorRepository: PermissionCreatorRepository
  ) {}

  create = async (cliendId: string) => {
    return this.permissionCreatorRepository.create(cliendId);
  };
}
