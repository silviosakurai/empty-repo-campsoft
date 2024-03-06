import { RouteMethod, RouteModule } from "@core/common/enums/models/route";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

export interface ViewApiJwtRequest {
  clientId: string;
  apiAccess: ViewApiResponse;
  routePath: string;
  routeMethod: RouteMethod;
  routeModule: RouteModule;
}
