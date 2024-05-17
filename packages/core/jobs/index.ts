import { FastifyInstance } from "fastify";
import { cronJobs } from "./cronJobs";
import { scheduleJobs } from "./scheduleJobs";

export default function startJobs(server: FastifyInstance) {
  server.ready().then(() => {
    cronJobs().forEach((item) => server.scheduler.addCronJob(item));
    scheduleJobs().forEach((item) =>
      server.scheduler.addSimpleIntervalJob(item)
    );
  });
}
