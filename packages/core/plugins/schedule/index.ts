import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { fastifySchedule } from "@fastify/schedule";

const schedulePlugin = async (fastify: FastifyInstance) => {
  fastify.register(fastifySchedule);
};
export default fp(schedulePlugin, { name: "schedule-service-plugin" });
