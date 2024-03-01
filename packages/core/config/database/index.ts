import fp from "fastify-plugin";
import { Pool, createPool } from "mysql2/promise";
import { databaseEnvironment } from "@core/config/environments";
import DatabaseConnectionError from "@core/common/exceptions/DatabaseConnectionError";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { container } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";

async function dbConnector() {
  const pool: Pool = createPool({
    host: databaseEnvironment.dbHost,
    port: databaseEnvironment.dbPort,
    user: databaseEnvironment.dbUser,
    password: databaseEnvironment.dbPassword,
    database: databaseEnvironment.dbDatabase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const connection = drizzle(pool, { schema, mode: "default" });

  if (!connection) {
    throw new DatabaseConnectionError("Could not connect to the database");
  }

  container.register<MySql2Database<typeof schema>>("Database", {
    useValue: connection,
  });
}

export default fp(dbConnector, { name: "db-connector" });
