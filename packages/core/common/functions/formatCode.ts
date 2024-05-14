export function formatCode(code: string): string {
  if (code.length < 4) {
    return code;
  }

  const lastFourDigits = code.slice(-4);

  return `**${lastFourDigits}`;
}
