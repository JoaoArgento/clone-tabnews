import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";

async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: request.method === "GET",
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  const migrations = await migrationRunner(defaultMigrationOptions);
  await dbClient.end();

  if (request.method === "POST") {
    return response.status(migrations.length > 0 ? 201 : 200).json(migrations);
  }
  if (request.method === "GET") {
    return response.status(200).json(migrations);
  }
  return response.status(405).end();
}

export default migrations;
