import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { client, clientDeleted } from "@core/models";
import { ClientStatus } from "@core/common/enums/models/client";
import { ViewClientByIdResponse } from "@core/useCases/client/dtos/ViewClientByIdResponse.dto";

@injectable()
export class ClientEraserRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async delete(
    tokenJwtData: ITokenJwtData,
    userFounded: ViewClientResponse
  ): Promise<boolean> {
    const insertClientDeletedId = await this.insertClientDeleted(userFounded);

    const result = await this.db
      .update(schema.client)
      .set({
        status: ClientStatus.DELETED,
        telefone: `del_${insertClientDeletedId}`,
        email: `del_${insertClientDeletedId}`,
        cpf: `del_${insertClientDeletedId}`,
      })
      .where(eq(client.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`))
      .execute();

    return !!result[0].affectedRows;
  }

  async deleteById(
    userId: string,
    userFounded: ViewClientByIdResponse
  ): Promise<boolean> {
    const insertClientDeletedId =
      await this.insertClientByIdDeleted(userFounded);

    const result = await this.db
      .update(schema.client)
      .set({
        status: ClientStatus.DELETED,
        telefone: `del_${insertClientDeletedId}`,
        email: `del_${insertClientDeletedId}`,
        cpf: `del_${insertClientDeletedId}`,
      })
      .where(eq(client.id_cliente, sql`UUID_TO_BIN(${userId})`))
      .execute();

    return !!result[0].affectedRows;
  }

  async insertClientDeleted(
    userFounded: ViewClientResponse
  ): Promise<number | null> {
    const result = await this.db
      .insert(clientDeleted)
      .values({
        id_cliente: sql`UUID_TO_BIN(${userFounded.client_id})`,
        email: userFounded.email,
        telefone: userFounded.phone,
        cpf: userFounded.cpf,
      })
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return result[0].insertId;
  }

  async insertClientByIdDeleted(
    userFounded: ViewClientByIdResponse
  ): Promise<number | null> {
    const result = await this.db
      .insert(clientDeleted)
      .values({
        id_cliente: sql`UUID_TO_BIN(${userFounded.user_id})`,
        email: userFounded.email,
        telefone: userFounded.phone,
        cpf: userFounded.cpf,
      })
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return result[0].insertId;
  }
}
