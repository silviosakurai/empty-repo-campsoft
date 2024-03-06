import { RouteMethod, RouteModule } from "@core/common/enums/models/route";

export interface ViewApiKeyRequest {
  keyApi: string;
  routePath: string;
  routeMethod: RouteMethod;
  routeModule: RouteModule;
}
