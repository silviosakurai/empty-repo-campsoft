import { sql } from "drizzle-orm";
import * as schema from "@core/models";
import { clientAddress } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import {
  ClientAddress,
  ClientShippingAddress,
} from "@core/common/enums/models/client";
import {
  UpdateClientAddressBillingRequest,
  UpdateClientAddressShippingRequest,
} from "@core/useCases/client/dtos/UpdateClientAddressRequest.dto";

@injectable()
export class ClientAddressCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async createAddressBilling(
    userId: string,
    data: UpdateClientAddressBillingRequest
  ): Promise<boolean> {
    const result = await this.db
      .insert(clientAddress)
      .values({
        id_cliente: sql`UUID_TO_BIN(${userId})`,
        tipo: ClientAddress.BILLING,
        endereco_envio: ClientShippingAddress.NO,
        cep: data.zip_code,
        rua: data.street,
        numero: data.number,
        complemento: data.complement,
        bairro: data.neighborhood,
        cidade: data.city,
        uf: data.state,
        telefone: data.phone,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }

  async createAddressShipping(
    userId: string,
    data: UpdateClientAddressShippingRequest
  ): Promise<boolean> {
    const result = await this.db
      .insert(clientAddress)
      .values({
        id_cliente: sql`UUID_TO_BIN(${userId})`,
        tipo: ClientAddress.SHIPPING,
        endereco_envio: ClientShippingAddress.NO,
        cep: data.zip_code,
        rua: data.street,
        numero: data.number,
        complemento: data.complement,
        bairro: data.neighborhood,
        cidade: data.city,
        uf: data.state,
        telefone: data.phone,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
