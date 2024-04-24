export function createCacheKey(
  nameCache: string,
  id: string | string[] | undefined,
  routeModule: string
): string {
  if (!id) {
    throw new Error("id is required");
  }

  const idKey = Array.isArray(id) ? id[0] : id;

  const encodedRouteModule = encodeURIComponent(routeModule);

  return `${nameCache}:${idKey}:${encodedRouteModule}`;
}
