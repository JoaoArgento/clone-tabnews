import { createRouter } from "next-connect";
import database from "infra/database.js";
const router = createRouter();
import controller from "infra/controller";

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = parseFloat(
    databaseVersionResult.rows[0].server_version,
  );
  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(maxConnectionsResult.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const connectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1;",
    values: [databaseName],
  });
  const openConnections = connectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: maxConnections,
        open_connections: openConnections,
      },
    },
  });
}
