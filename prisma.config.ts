import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";
import { resolveDatabaseUrl } from "./lib/database-url";

loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
