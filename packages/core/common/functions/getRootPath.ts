import { RouteModule } from "@core/common/enums/models/route";

export function getRootPath(routePath: string, module: RouteModule): string {
  const normalizedPath = routePath.trim().startsWith("/")
    ? routePath.trim()
    : `/${routePath.trim()}`;
  const parts = normalizedPath.split("/");

  return `${module}/${parts[1]}`;
}
