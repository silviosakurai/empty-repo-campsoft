import { SimpleIntervalJob } from "toad-scheduler";
import * as tasks from "@core/useCases/task";

export function scheduleJobs() {
  const jobs = Object.values(tasks).map(
    (useCase) => new SimpleIntervalJob({ seconds: 20 }, useCase.task())
  );

  return jobs;
}
