import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";

@injectable()
export class ListCrossSellProductRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async list(input: CrossSellProductRequest) {}

  private setFilters() {}
}
