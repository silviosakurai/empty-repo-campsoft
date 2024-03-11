export function generateQueryString(input: Record<string, unknown>):string {
  const keys = Object.keys(input);
  const query = keys.reduce((previousValue, key, index) => {
    const plainInput = input as Record<string, unknown>;
    if (index === 0) previousValue += `?${key}=${plainInput[key]}`;
    else previousValue += `&${key}=${plainInput[key]}`;
    return previousValue;
  }, '');
  return query;
}