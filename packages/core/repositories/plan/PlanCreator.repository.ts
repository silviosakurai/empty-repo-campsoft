import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { CreatePlanRequest } from "@core/useCases/plan/dtos/CreatePlanRequest.dto";

@injectable()
export class PlanCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: CreatePlanRequest): Promise<boolean> {
    return true;
  }
}
