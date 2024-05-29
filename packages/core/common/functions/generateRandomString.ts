import { generate } from "randomstring";

export function generateRandomString(hashLength: number = 256) {
  return generate({
    length: hashLength,
    charset: "alphanumeric",
  });
}
