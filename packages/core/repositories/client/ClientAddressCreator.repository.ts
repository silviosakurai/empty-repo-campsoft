import { sql } from "drizzle-orm";
import * as schema from "@core/models";
import { clientAddress } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { ClientAddress, ClientShippingAddress } from "@core/common/enums/models/client";
import { UpdateClientAddressRequest } from "@core/useCases/client/dtos/UpdateClientAddressRequest.dto";

@injectable()
export class ClientAddressCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(
    userId: string,
    type: ClientAddress,
    data: UpdateClientAddressRequest,
  ): Promise<boolean> {
    const result = await this.db
      .insert(clientAddress)
      .values({
        id_cliente: sql`UUID_TO_BIN(${userId})`,
        tipo: type,
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
