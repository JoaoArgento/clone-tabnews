import migrationRunner from "node-pg-migrate";
import { resolve } from "path";
import database from "infra/database";

async function listPendingMigrations(dryRun) {
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
    migrationsTable: "pgmigrations",
    log: () => {},
  };
}

const migrator = {
  listPendingMigrations,
};

export default migrator;
