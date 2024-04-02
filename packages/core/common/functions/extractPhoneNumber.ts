export function extractPhoneNumber(whatsappString: string): string {
  const phoneRegex = /\+?\d+/;
  const match = phoneRegex.exec(whatsappString);

  return match ? match[0] : "";
}
