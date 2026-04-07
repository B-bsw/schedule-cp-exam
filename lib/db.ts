import mysql, { Pool } from "mysql2/promise";
import { resolveDatabaseUrl } from "./database-url";

const globalForDb = globalThis as unknown as { mysqlPool?: Pool };

export const db =
  globalForDb.mysqlPool ??
  mysql.createPool({
    uri: resolveDatabaseUrl(),
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.mysqlPool = db;
}
