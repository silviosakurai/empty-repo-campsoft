export function isUuid(test: string): boolean {
  const formatPattern = /^.{8}-.{4}-.{4}-.{4}-.{12}$/;

  return formatPattern.test(test);
}
