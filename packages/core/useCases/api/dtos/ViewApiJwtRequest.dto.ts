import { RouteMethod, RouteModule } from "@core/common/enums/models/route";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

export interface ViewApiJwtRequest {
  clientId: string;
  tokenKeyData: ITokenKeyData;
  routePath: string;
  routeMethod: RouteMethod;
  routeModule: RouteModule;
}
