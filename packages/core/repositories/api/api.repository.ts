import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { apiAccess } from "@core/models";
import { and, eq, or } from "drizzle-orm";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { ApiStatus } from "@core/common/enums/models/api";

@injectable()
export class ApiRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async viewApi(keyApi: string): Promise<ViewApiResponse | null> {
    const result = await this.db
      .select({
        api_access: apiAccess.id_api_acesso,
        name: apiAccess.api_nome,
        status: apiAccess.api_status,
        company: apiAccess.id_empresa,
      })
      .from(apiAccess)
      .where(
        and(
          or(
            eq(apiAccess.api_chave, keyApi),
            eq(apiAccess.api_chave_sandbox, keyApi)
          ),
          eq(apiAccess.api_status, ApiStatus.ACTIVE)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewApiResponse;
  }
}
