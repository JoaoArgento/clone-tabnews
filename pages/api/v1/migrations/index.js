import migrationRunner from "node-pg-migrate";
import { resolve } from "path";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";
const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const migrations = await getMigrations(true);
  return response.status(200).json(migrations);
}

async function postHandler(request, response) {
  const migrations = await getMigrations(false);
  return response.status(migrations.length > 0 ? 201 : 200).json(migrations);
}

async function getMigrations(dryRun) {
  let dbClient = await database.getNewClient();
  if (dbClient == null) {
    throw new ReferenceError("db client não foi definido");
  }
  const migrationOptions = getMigrationOptions(dbClient, dryRun);
  const migrations = await migrationRunner(migrationOptions);
  dbClient.end();

  return migrations;
}

function getMigrationOptions(dbClient, dryRun) {
  return {
    dbClient: dbClient,
    dryRun: dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}
