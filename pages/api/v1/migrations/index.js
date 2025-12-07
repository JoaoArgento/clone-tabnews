import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";

async function migrations(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: request.method === "GET",
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    console.log(request.method);
    const migrations = await migrationRunner(defaultMigrationOptions);

    if (request.method === "POST") {
      return response
        .status(migrations.length > 0 ? 201 : 200)
        .json(migrations);
    }
    if (request.method === "GET") {
      return response.status(200).json(migrations);
    }
    return response.status(405).end();
  } catch (exception) {
    throw exception;
  } finally {
    await dbClient.end();
  }
}

export default migrations;
