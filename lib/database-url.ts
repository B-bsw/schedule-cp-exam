function encodePart(value: string): string {
  return encodeURIComponent(value);
}

function buildMysqlUrl(config: {
  username: string;
  password?: string;
  host: string;
  port: string;
  database: string;
}): string {
  const credentials = config.password
    ? `${encodePart(config.username)}:${encodePart(config.password)}`
    : encodePart(config.username);

  return `mysql://${credentials}@${config.host}:${config.port}/${encodePart(config.database)}`;
}

export function resolveDatabaseUrl(): string {
  const host = process.env.db_host;
  const port = process.env.db_port ?? "3306";
  const username = process.env.db_username;
  const password = process.env.db_password ?? "";
  const database = process.env.db_name;

  if (host && username && database) {
    return buildMysqlUrl({
      username,
      password,
      host,
      port,
      database,
    });
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  throw new Error(
    "DATABASE_URL is not configured and db_host/db_username/db_name are missing",
  );
}
