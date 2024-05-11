import { RouteMethod, RouteModule } from "@core/common/enums/models/route";

export interface ViewApiJwtRequest {
  clientId: string;
  routePath: string;
  routeMethod: RouteMethod;
  routeModule: RouteModule;
}
