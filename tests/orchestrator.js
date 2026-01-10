/* eslint-disable no-unused-vars */
import AsyncRetry from "async-retry";
import database from "infra/database.js";
import migrator from "models/migrator";
async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return AsyncRetry(
      async (_bail, _tryNumber) => {
        try {
          const response = await fetch("http://localhost:3000/api/v1/status");

          if (!response.ok) {
            throw new Error(`deu erro ${response.status}`);
          }
        } catch (error) {
          console.log(error);

          throw error;
        }
      },
      { retries: 100, maxTimeout: 3000 },
    );
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.listPendingMigrations(false);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};

export default orchestrator;
