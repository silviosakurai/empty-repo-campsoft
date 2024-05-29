import { MD5 } from "crypto-js";
import { generateRandomString } from "@core/common/functions/generateRandomString";

export const encodePassword = (
  password: string,
  saltLength: number = 15
): string | null => {
  let encodedPassword: string | null = null;
  if (password.length > 0) {
    const salt: string = generateRandomString(saltLength);
    encodedPassword = MD5(salt + password) + ":" + salt;
  }

  return encodedPassword;
};
