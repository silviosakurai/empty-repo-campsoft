import * as schema from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { clientAddress } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { UpdateClientAddressRequest } from "@core/useCases/client/dtos/UpdateClientAddressRequest.dto";
import {
  ClientAddress,
  ClientShippingAddress,
} from "@core/common/enums/models/client";

@injectable()
export class ClientAddressUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async updateAddress(
    userId: string,
    data: UpdateClientAddressRequest,
    clientAdd: ClientAddress
  ): Promise<boolean> {
    const result = await this.db
      .update(clientAddress)
      .set({
        cep: data.zip_code,
        rua: data.street,
        numero: data.number,
        complemento: data.complement,
        bairro: data.neighborhood,
        cidade: data.city,
        uf: data.state,
        telefone: data.phone,
      })
      .where(
        and(
          eq(clientAddress.id_cliente, sql`UUID_TO_BIN(${userId})`),
          eq(clientAddress.tipo, clientAdd)
        )
      )
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }

  async updateShippingAddress(
    userId: string,
    type: ClientAddress,
    shippingAddress: ClientShippingAddress
  ): Promise<boolean> {
    const result = await this.db
      .update(clientAddress)
      .set({
        endereco_envio: shippingAddress,
      })
      .where(
        and(
          eq(clientAddress.id_cliente, sql`UUID_TO_BIN(${userId})`),
          eq(clientAddress.tipo, type)
        )
      )
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
