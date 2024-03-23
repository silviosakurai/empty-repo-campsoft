import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";

@injectable()
export class ListOrdersRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async list(companyId: number, query: ListPlanRequest) {}
}
