import { PermissionCreatorRepository } from "@core/repositories/permission/PermissionCreator.repository";
import { PermissionListerRepository } from "@core/repositories/permission/PermissionLister.repository";
import { injectable } from "tsyringe";

@injectable()
export class PermissionService {
  constructor(
    private readonly permissionCreatorRepository: PermissionCreatorRepository,
    private readonly permissionListerRepository: PermissionListerRepository
  ) {}

  create = async (cliendId: string) => {
    return this.permissionCreatorRepository.create(cliendId);
  };

  findByCliendId = async (cliendId: string) => {
    return this.permissionListerRepository.findByCliendId(cliendId);
  };
}
