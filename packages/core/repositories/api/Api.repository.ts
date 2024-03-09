import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import {
  apiAccess,
  company,
  access,
  accessRouteType,
  route,
  client,
  tfaCodes,
} from "@core/models";
import { and, eq, or, sql } from "drizzle-orm";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { ApiStatus } from "@core/common/enums/models/api";
import { CompanyStatus } from "@core/common/enums/models/company";
import { RouteMethod, RouteModule } from "@core/common/enums/models/route";
import { ClientStatus } from "@core/common/enums/models/client";
import { ViewApiTfaResponse } from "@core/useCases/api/dtos/ViewApiTfaResponse.dto";

@injectable()
export class ApiRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async findApiByKey(
    keyApi: string,
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ): Promise<ViewApiResponse | null> {
    const result = await this.db
      .select({
        api_key: apiAccess.api_chave,
        api_access_id: apiAccess.id_api_acesso,
        status: apiAccess.api_status,
        name: company.nome_fantasia,
        company_id: company.id_empresa,
      })
      .from(apiAccess)
      .innerJoin(company, eq(company.id_api_acesso, apiAccess.id_api_acesso))
      .innerJoin(access, eq(access.id_api_acesso, apiAccess.id_api_acesso))
      .innerJoin(
        accessRouteType,
        eq(accessRouteType.id_acesso_tipo, access.id_acesso_tipo)
      )
      .innerJoin(route, eq(route.id_rota, accessRouteType.id_rota))
      .where(
        and(
          and(
            or(
              eq(apiAccess.api_chave, keyApi),
              eq(apiAccess.api_chave_sandbox, keyApi)
            )
          ),
          and(
            eq(apiAccess.api_status, ApiStatus.ACTIVE),
            eq(company.status, CompanyStatus.ACTIVE),
            eq(route.rota, routePath),
            eq(route.metodo, routeMethod),
            eq(route.module, routeModule)
          )
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewApiResponse;
  }

  async findApiByJwt(
    clientId: string,
    apiAccessKey: ViewApiResponse,
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ): Promise<boolean> {
    const result = await this.db
      .select({
        client_id: client.id_cliente,
        client_type_id: client.id_cliente_tipo,
        name: client.nome,
        status: client.status,
      })
      .from(client)
      .innerJoin(access, eq(access.id_cliente, client.id_cliente))
      .innerJoin(
        accessRouteType,
        eq(accessRouteType.id_acesso_tipo, access.id_acesso_tipo)
      )
      .innerJoin(route, eq(route.id_rota, accessRouteType.id_rota))
      .where(
        and(
          eq(client.status, ClientStatus.ACTIVE),
          eq(client.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(access.id_empresa, apiAccessKey.company_id),
          eq(route.rota, routePath),
          eq(route.metodo, routeMethod),
          eq(route.module, routeModule)
        )
      )
      .execute();

    return result.length > 0;
  }

  async findApiByTfa(token: string): Promise<ViewApiTfaResponse | null> {
    const result = await this.db
      .select({
        type: tfaCodes.tipo,
        destiny: tfaCodes.destino,
      })
      .from(tfaCodes)
      .where(eq(tfaCodes.token, sql`UUID_TO_BIN(${token})`))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewApiTfaResponse;
  }
}
