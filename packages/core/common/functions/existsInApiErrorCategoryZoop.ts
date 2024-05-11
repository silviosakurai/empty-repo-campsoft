import { ApiErrorCategoryZoop } from "../enums/ApiErrorCategoryZoop";

export function existsInApiErrorCategoryZoop(message: string): boolean {
  const enumValues = Object.values(ApiErrorCategoryZoop) as string[];

  return enumValues.includes(message);
}
