import { randomBytes } from "crypto";

export function generateTokenTfa() {
  const buffer = randomBytes(4);
  const token = (parseInt(buffer.toString("hex"), 16) % 900000) + 100000;

  return token.toString();
}
