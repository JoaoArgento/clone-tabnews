import { Client } from "pg";

async function Query(queryInfo) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });
  try {
    await client.connect();
    const result = await client.query(queryInfo);
    return result;
  } catch (exception) {
    console.log(exception);
    throw exception;
  } finally {
    await client.end();
  }
  return "";
}

export default {
  query: Query,
};
