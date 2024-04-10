import * as schema from "@core/models";
import { eq, sql, and, or } from "drizzle-orm";
import { clientAddress } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import {
  ClientAddress,
  ClientShippingAddress,
} from "@core/common/enums/models/client";
import {
  ViewClientBillingAddressResponse,
  ViewClientShippingAddressResponse,
} from "@core/useCases/client/dtos/ViewClientAddressResponse.dto";

@injectable()
export class ClientAddressViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async viewBilling(
    userId: string
  ): Promise<ViewClientBillingAddressResponse | null> {
    const result = await this.db
      .select({
        shipping_address: sql<boolean>`CASE 
            WHEN ${clientAddress.endereco_envio} = ${ClientShippingAddress.YES} THEN true
          ELSE false
        END`.mapWith(Boolean),
        zip_code: clientAddress.cep,
        street: clientAddress.rua,
        number: clientAddress.numero,
        complement: clientAddress.complemento,
        neighborhood: clientAddress.bairro,
        phone: clientAddress.telefone,
        city: clientAddress.cidade,
        state: clientAddress.uf,
        created_at: clientAddress.created_at,
        updated_at: clientAddress.updated_at,
      })
      .from(clientAddress)
      .where(
        and(
          eq(clientAddress.id_cliente, sql`UUID_TO_BIN(${userId})`),
          eq(clientAddress.tipo, ClientAddress.BILLING)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewClientBillingAddressResponse;
  }

  async viewShipping(
    userId: string
  ): Promise<ViewClientShippingAddressResponse | null> {
    const result = await this.db
      .select({
        zip_code: clientAddress.cep,
        street: clientAddress.rua,
        number: clientAddress.numero,
        complement: clientAddress.complemento,
        neighborhood: clientAddress.bairro,
        phone: clientAddress.telefone,
        city: clientAddress.cidade,
        state: clientAddress.uf,
        created_at: clientAddress.created_at,
        updated_at: clientAddress.updated_at,
      })
      .from(clientAddress)
      .where(
        and(
          or(
            eq(clientAddress.endereco_envio, ClientShippingAddress.YES),
            and(
              eq(clientAddress.id_cliente, sql`UUID_TO_BIN(${userId})`),
              eq(clientAddress.tipo, ClientAddress.SHIPPING)
            )
          )
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewClientShippingAddressResponse;
  }
}
