export function generateQueryString(input: Record<string, unknown>): string {
  const keys = Object.keys(input);
  const query = keys.reduce((previousValue, key, index) => {
    const value = input[key];
    const stringValue =
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? String(value)
        : JSON.stringify(value);

    const encodedValue = encodeURIComponent(stringValue);
    const prefix = index === 0 ? "?" : "&";
    return previousValue + `${prefix}${key}=${encodedValue}`;
  }, "");

  return query;
}
