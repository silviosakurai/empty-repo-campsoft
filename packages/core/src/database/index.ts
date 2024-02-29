import fp from "fastify-plugin";
import mysql, { Pool } from "mysql2/promise";
import { environment } from "@core/environments";
import { FastifyInstance } from "fastify";
import DatabaseConnectionError from "@core/common/exceptions/DatabaseConnectionError";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@core/models";

async function dbConnector(fastify: FastifyInstance) {
  const pool: Pool = mysql.createPool({
    host: environment.dbHost,
    port: environment.dbPort,
    user: environment.dbUser,
    password: environment.dbPassword,
    database: environment.dbDatabase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const connection = drizzle(pool, { schema, mode: "default" });

  if (!connection) {
    throw new DatabaseConnectionError("Could not connect to the database");
  }

  fastify.decorate("db", connection);

  fastify.addHook("onClose", async () => {
    await pool.end();
  });
}

export default fp(dbConnector, { name: "db-connector" });
