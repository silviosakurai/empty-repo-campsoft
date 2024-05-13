import { FastifyInstance } from "fastify";
import { cronJobs } from "./cronJobs";

export default function startJobs(server: FastifyInstance) {
  server.ready().then(() => {
    cronJobs().forEach((item) => server.scheduler.addCronJob(item));
  });
}
