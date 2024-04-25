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
import {
  ITokenJwtAccess,
  ITokenJwtData,
} from "@core/common/interfaces/ITokenJwtData";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";

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
      acoes: [] as PermissionsRoles[],
      id_api_key: result[0].id_api_key as number,
      id_parceiro: result[0].id_parceiro as number,
      id_cargo: result[0].id_cargo as number,
    } as ITokenKeyData;

    result.forEach((row) => {
      keyData.acoes.push(row.acao as PermissionsRoles);
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

  private actionPermissionJwt(
    result: ITokenJwtAccess[],
    clientId: string
  ): ITokenJwtData | null {
    const accessList: ITokenJwtAccess[] = result.map((item) => ({
      acao: item.acao,
      id_grupo: item.id_grupo,
      id_parceiro: item.id_parceiro,
      id_cargo: item.id_cargo,
      contexto: item.contexto,
    }));

    return {
      clientId: clientId,
      access: accessList,
    };
  }

  async findApiByJwt(
    clientId: string,
    routeModule: RouteModule
  ): Promise<ITokenJwtData | null> {
    const result = (await this.db
      .select({
        acao: action.acao,
        id_grupo: permission.id_grupo,
        id_parceiro: permission.id_parceiro,
        id_cargo: permission.id_cargo,
        contexto: roleAction.contexto,
      })
      .from(permission)
      .innerJoin(client, eq(client.id_cliente, permission.id_cliente))
      .innerJoin(role, eq(role.id_cargo, permission.id_cargo))
      .innerJoin(roleAction, eq(roleAction.id_cargo, role.id_cargo))
      .innerJoin(action, eq(action.id_acao, roleAction.id_acao))
      .where(
        and(
          eq(client.status, ClientStatus.ACTIVE),
          eq(client.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(action.modulo, routeModule)
        )
      )
      .groupBy(
        action.acao,
        permission.id_grupo,
        permission.id_parceiro,
        permission.id_cargo,
        roleAction.contexto
      )
      .execute()) as ITokenJwtAccess[];

    if (!result || result.length === 0) {
      return null;
    }

    return this.actionPermissionJwt(result, clientId);
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
