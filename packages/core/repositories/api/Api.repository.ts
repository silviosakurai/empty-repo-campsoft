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
import { and, eq, sql } from "drizzle-orm";
import { ApiStatus } from "@core/common/enums/models/api";
import { CompanyStatus } from "@core/common/enums/models/company";
import { RouteMethod, RouteModule } from "@core/common/enums/models/route";
import { ClientStatus } from "@core/common/enums/models/client";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";
import {
  ITokenJwtAccess,
  ITokenJwtData,
} from "@core/common/interfaces/ITokenJwtData";
import { AccessStatus } from "@core/common/enums/models/access";

@injectable()
export class ApiRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async findApiByKey(
    keyApi: string,
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ): Promise<ITokenKeyData | null> {
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
          and(eq(apiAccess.api_chave, keyApi)),
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

    return result[0] as unknown as ITokenKeyData;
  }

  async findApiByJwt(
    clientId: string,
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ): Promise<ITokenJwtData | null> {
    const result = await this.db
      .select({
        companyId: sql<number>`${access.id_empresa}`.mapWith(Number),
        accessTypeId: sql<number>`${access.id_acesso_tipo}`.mapWith(Number),
      })
      .from(access)
      .innerJoin(client, eq(client.id_cliente, access.id_cliente))
      .innerJoin(
        accessRouteType,
        eq(accessRouteType.id_acesso_tipo, access.id_acesso_tipo)
      )
      .innerJoin(route, eq(route.id_rota, accessRouteType.id_rota))
      .where(
        and(
          eq(client.status, ClientStatus.ACTIVE),
          eq(client.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(access.status, AccessStatus.ACTIVE),
          eq(route.rota, routePath),
          eq(route.metodo, routeMethod),
          eq(route.module, routeModule)
        )
      )
      .groupBy(access.id_cliente, access.id_empresa, access.id_acesso_tipo)
      .execute();

    if (!result || result.length === 0) {
      return null;
    }

    const accessData: ITokenJwtAccess[] = result
      .filter((item) => item.companyId !== null && item.accessTypeId !== null)
      .map((item) => ({
        companyId: item.companyId,
        accessTypeId: item.accessTypeId,
      }));

    const tokenJwtData: ITokenJwtData = {
      clientId,
      access: accessData,
    };

    return tokenJwtData;
  }

  async findApiByTfa(token: string): Promise<ITokenTfaData | null> {
    const result = await this.db
      .select({
        clientId: sql`BIN_TO_UUID(${tfaCodes.id_cliente})`,
        type: tfaCodes.tipo,
        destiny: tfaCodes.destino,
      })
      .from(tfaCodes)
      .where(eq(tfaCodes.token, sql`UUID_TO_BIN(${token})`))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ITokenTfaData;
  }
}
