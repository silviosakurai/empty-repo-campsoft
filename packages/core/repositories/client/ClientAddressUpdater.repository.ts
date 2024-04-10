import * as schema from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { clientAddress } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import {
  UpdateClientAddressBillingRequest,
  UpdateClientAddressShippingRequest,
} from "@core/useCases/client/dtos/UpdateClientAddressRequest.dto";
import {
  ClientAddress,
  ClientShippingAddress,
} from "@core/common/enums/models/client";

@injectable()
export class ClientAddressUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async updateAddressBilling(
    userId: string,
    data: UpdateClientAddressBillingRequest
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
          eq(clientAddress.tipo, ClientAddress.BILLING)
        )
      )
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }

  async updateAddressShipping(
    userId: string,
    data: UpdateClientAddressShippingRequest
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
          eq(clientAddress.tipo, ClientAddress.SHIPPING)
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
