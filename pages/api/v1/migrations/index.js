import migrationRunner from "node-pg-migrate";
import { resolve } from "path";
import database from "infra/database";

async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `METODO ${request.method} NÃO PERMITIDO!` });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    // const migrationsDir =
    //   process.env.NODE_ENV === "production"
    //     ? join("infra", "migrations")
    //     : resolve("infra", "migrations");

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: request.method === "GET",
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

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
    console.log(exception);
    throw exception;
  } finally {
    await dbClient.end();
  }
}

export default migrations;
