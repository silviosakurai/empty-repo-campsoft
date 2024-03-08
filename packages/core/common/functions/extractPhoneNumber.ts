export function extractPhoneNumber(whatsappString: string): string {
  const match = whatsappString.match(/\+?\d+/);

  return match ? match[0] : "";
}
