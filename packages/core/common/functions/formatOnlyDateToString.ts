import { tz } from "moment-timezone";

export function formatOnlyDateToString(date: Date) {
  const timeZone = "America/Sao_Paulo";
  const timeDate = tz(date, timeZone);

  return timeDate.format("YYYY-MM-DD");
}
