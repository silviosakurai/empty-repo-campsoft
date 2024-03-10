export function createCacheKey(
  nameCache: string,
  id: string | string[] | undefined,
  routePath: string | undefined,
  routeMethod: string,
  routeModule: string
): string {
  if (!id) {
    throw new Error("id is required");
  }

  const idKey = Array.isArray(id) ? id[0] : id;

  const encodedRoutePath = encodeURIComponent(routePath || "");
  const encodedRouteMethod = encodeURIComponent(routeMethod);
  const encodedRouteModule = encodeURIComponent(routeModule);

  return `${nameCache}:${idKey}:${encodedRoutePath}:${encodedRouteMethod}:${encodedRouteModule}`;
}
