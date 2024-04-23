import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import {
  permission,
  role,
  roleAction,
  action,
  client,
  apiKey,
  tfaCodes,
} from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { ApiStatus } from "@core/common/enums/models/api";
import { RouteModule } from "@core/common/enums/models/route";
import { ClientStatus } from "@core/common/enums/models/client";
import {
  FindApiByKey,
  ITokenKeyData,
} from "@core/common/interfaces/ITokenKeyData";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { Permissions } from "@core/common/enums/Permissions";

@injectable()
export class ApiRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  private actionPermissionKey(result: FindApiByKey[]): ITokenKeyData | null {
    if (
      !result[0].id_api_key ||
      !result[0].id_parceiro ||
      !result[0].id_cargo
    ) {
      return null;
    }

    const keyData = {
      acoes: [] as Permissions[],
      id_api_key: result[0].id_api_key as number,
      id_parceiro: result[0].id_parceiro as number,
      id_cargo: result[0].id_cargo as number,
    } as ITokenKeyData;

    result.forEach((row) => {
      keyData.acoes.push(row.acao as Permissions);
    });

    return keyData;
  }

  async findApiByKey(
    keyApi: string,
    routeModule: RouteModule
  ): Promise<ITokenKeyData | null> {
    const result = (await this.db
      .select({
        acao: action.acao,
        id_api_key: permission.id_api_key,
        id_parceiro: permission.id_parceiro,
        id_cargo: permission.id_cargo,
      })
      .from(action)
      .innerJoin(roleAction, eq(roleAction.id_acao, action.id_acao))
      .innerJoin(role, eq(role.id_cargo, roleAction.id_cargo))
      .innerJoin(permission, eq(permission.id_cargo, role.id_cargo))
      .innerJoin(apiKey, eq(apiKey.id_api_key, permission.id_api_key))
      .where(
        and(
          eq(apiKey.api_chave, keyApi),
          eq(apiKey.api_status, ApiStatus.ACTIVE),
          eq(action.modulo, routeModule)
        )
      )
      .groupBy(
        action.acao,
        permission.id_api_key,
        permission.id_parceiro,
        permission.id_cargo
      )
      .execute()) as FindApiByKey[];

    if (!result.length) {
      return null;
    }

    return this.actionPermissionKey(result);
  }

  async findApiByJwt(
    clientId: string,
    routeModule: RouteModule
  ): Promise<ITokenJwtData | null> {
    const result = await this.db
      .select({
        id_api_key: permission.id_api_key,
        id_cliente: permission.id_cliente,
        id_grupo: permission.id_grupo,
        id_parceiro: permission.id_parceiro,
        id_cargo: permission.id_cargo,
      })
      .from(permission)
      .innerJoin(client, eq(client.id_cliente, permission.id_cliente))
      .innerJoin(role, eq(role.id_cargo, permission.id_cargo))
      .innerJoin(roleAction, eq(roleAction.id_cargo, role.id_cargo))
      .innerJoin(action, eq(action.id_acao, roleAction.id_acao))
      .innerJoin(apiKey, eq(apiKey.id_api_key, permission.id_api_key))
      .where(
        and(
          eq(client.status, ClientStatus.ACTIVE),
          eq(client.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(action.modulo, routeModule)
        )
      )
      .execute();

    if (!result || result.length === 0) {
      return null;
    }

    return result as unknown as ITokenJwtData;
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
