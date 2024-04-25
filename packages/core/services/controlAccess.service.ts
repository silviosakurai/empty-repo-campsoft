import { injectable } from "tsyringe";
import {
  ITokenJwtAccess,
  ITokenJwtData,
  UniqueAccessPermission,
} from "@core/common/interfaces/ITokenJwtData";
import { and, eq, or, sql, SQL } from "drizzle-orm";
import { client, clientGroupsTree, order } from "@core/models";
import { RoleContext } from "@core/common/enums/models/role";
import { ClientListerGroupTreeRepository } from "@core/repositories/client/ClientListerGroupTree.repository";
import { ListClientByGroupAndPartner } from "@core/interfaces/repositories/client";

@injectable()
export class ControlAccessService {
  constructor(
    private readonly clientListerGroupTreeRepository: ClientListerGroupTreeRepository
  ) {}

  listPartnersIds = (tokenJwtData: ITokenJwtData): number[] => {
    const uniquePartnerIds = new Set<number>();

    tokenJwtData.access.forEach((accessItem) => {
      uniquePartnerIds.add(Number(accessItem.id_parceiro));
    });

    const uniquePartnerIdsArray = [...uniquePartnerIds];

    return uniquePartnerIdsArray;
  };

  filterClientByPermission = async (
    tokenJwtData: ITokenJwtData,
    permissionsRoute: string[]
  ): Promise<SQL<unknown> | undefined> => {
    const accessByPermissions = this.selectAccessByPermissions(
      tokenJwtData,
      permissionsRoute
    );

    const uniqueAccessItems = this.getUniqueAccessItems(accessByPermissions);

    const hasGroupContext = uniqueAccessItems.some(
      (item) => item.contexto === RoleContext.GROUP
    );

    let whereCondition = or(
      eq(
        client.id_cliente_cadastro,
        sql`UUID_TO_BIN(${tokenJwtData.clientId})`
      ),
      eq(order.id_vendedor, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
    );

    if (hasGroupContext) {
      const whereConditionGroupContext =
        this.generateWhereConditionByViewGroupsTree(uniqueAccessItems);

      const clientsGroups =
        await this.clientListerGroupTreeRepository.listClientByGroupAndPartner(
          whereConditionGroupContext
        );

      whereCondition = this.generateWhereCondition(
        tokenJwtData,
        whereCondition,
        clientsGroups
      );
    }

    return whereCondition;
  };

  private generateWhereCondition = (
    tokenJwtData: ITokenJwtData,
    whereCondition: SQL<unknown> | undefined,
    listClientByGroupAndPartner: ListClientByGroupAndPartner[]
  ): SQL<unknown> | undefined => {
    listClientByGroupAndPartner.forEach((item: ListClientByGroupAndPartner) => {
      if (item.id_cliente !== tokenJwtData.clientId) {
        const combinedConditions = or(
          eq(client.id_cliente, sql`UUID_TO_BIN(${item.id_cliente})`),
          and(
            eq(
              client.id_cliente_cadastro,
              sql`UUID_TO_BIN(${item.id_cliente})`
            ),
            eq(client.id_parceiro_cadastro, item.id_parceiro)
          ),
          and(
            eq(order.id_vendedor, sql`UUID_TO_BIN(${item.id_cliente})`),
            eq(order.id_parceiro, item.id_parceiro)
          )
        );

        whereCondition = or(whereCondition, combinedConditions);
      }
    });

    return whereCondition;
  };

  private generateWhereConditionByViewGroupsTree = (
    uniqueAccessItems: UniqueAccessPermission[]
  ): SQL<unknown> | undefined => {
    let whereConditionGroupContext = or();

    uniqueAccessItems.forEach((item: UniqueAccessPermission) => {
      if (item.contexto === RoleContext.GROUP) {
        const combinedConditions = and(
          eq(clientGroupsTree.id_grupo, Number(item.id_grupo)),
          eq(clientGroupsTree.id_parceiro, Number(item.id_parceiro))
        );

        whereConditionGroupContext = or(
          whereConditionGroupContext,
          combinedConditions
        );
      }
    });

    return whereConditionGroupContext;
  };

  private selectAccessByPermissions = (
    tokenJwtData: ITokenJwtData,
    permissionsRoute: string[]
  ): ITokenJwtAccess[] => {
    return tokenJwtData.access.filter((accessItem) =>
      permissionsRoute.includes(accessItem.acao)
    );
  };

  private getUniqueAccessItems = (
    accessItems: ITokenJwtAccess[]
  ): UniqueAccessPermission[] => {
    const uniqueItemStrings = new Set<string>();

    accessItems.forEach((item) => {
      const uniqueKey = JSON.stringify({
        id_grupo: item.id_grupo,
        id_parceiro: item.id_parceiro,
        id_cargo: item.id_cargo,
        contexto: item.contexto,
      });

      uniqueItemStrings.add(uniqueKey);
    });

    const uniqueItems = Array.from(uniqueItemStrings).map(
      (itemString) => JSON.parse(itemString) as UniqueAccessPermission
    );

    return uniqueItems;
  };
}
