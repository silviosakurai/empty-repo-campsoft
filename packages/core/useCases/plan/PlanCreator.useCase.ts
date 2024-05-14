import { injectable } from "tsyringe";
import { CreatePlanRequest } from "./dtos/CreatePlanRequest.dto";
import { PlanService } from "@core/services";

@injectable()
export class PlanCreatorUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(body: CreatePlanRequest): Promise<boolean> {
    return await this.planService.create(body);
  }
}
