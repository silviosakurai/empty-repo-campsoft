import { tz } from "moment-timezone";

export function addMonthsToCurrentDate(
  validUntil: string,
  months: number
): string {
  const timeZone = "America/Sao_Paulo";
  const dateInTimeZone = tz(validUntil, "YYYY-MM-DD HH:mm:ss", timeZone);

  dateInTimeZone.add(months, "months");

  return dateInTimeZone.format("YYYY-MM-DD HH:mm:ss");
}
