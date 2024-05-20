import { CronJob } from "toad-scheduler";
import * as tasks from "@core/useCases/task";

export function cronJobs() {
  const jobs = Object.values(tasks).map(
    (useCase) =>
      new CronJob({ cronExpression: "*/5 * * * * *" }, useCase.task())
  );

  return jobs;
}
