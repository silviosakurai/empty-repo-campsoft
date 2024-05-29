import { SQL, BuildQueryConfig } from "drizzle-orm";

export function convertSqlToString(
  sqlCondition: SQL<unknown> | undefined
): string {
  if (!sqlCondition) {
    return "";
  }

  const config: BuildQueryConfig = {
    escapeName: (name: string) => name,
    escapeParam: (num: number) => `@${num}`,
    escapeString: (str: string) => `'${str}'`,
    inlineParams: true,
  };

  return sqlCondition.toQuery(config).sql;
}
