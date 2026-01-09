import { Client } from "pg";
import { errors } from "./errors.js";
async function query(queryInfo) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryInfo);
    return result;
  } catch (exception) {
    throw errors.getServiceError().withCause(exception);
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV === "production",
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};
export default database;
