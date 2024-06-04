import 'reflect-metadata';
import fastify from 'fastify';
import schedulePlugin from '@core/plugins/schedule';
import routes from './routes';
import startJobs from '@core/jobs';
import dbConnector from '@core/config/database';
import loggerServicePlugin from '@core/plugins/logger';
import cacheRedisConnector from '@core/config/cache';
import { v4 } from 'uuid';
import i18nextPlugin from '@core/plugins/i18next';

const server = fastify({
  genReqId: () => v4(),
  logger: true,
});

server.register(dbConnector);
server.register(schedulePlugin);
server.register(loggerServicePlugin);
server.register(cacheRedisConnector);
server.register(i18nextPlugin);
server.register(routes);

startJobs(server);

server.listen({ port: 3005, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.log(err);

    server.logger.error(err);
    process.exit(1);
  }

  console.log(`Server is running on port: ${address}`);
  server.logger.info(`Server is running on port: ${address}`);
});
