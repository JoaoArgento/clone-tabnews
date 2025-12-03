import database from "infra/database";

async function ClearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(ClearDatabase);

test("POST in api/v1/migrations", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(201);

  const migrations = await response.json();

  expect(Array.isArray(migrations)).toBe(true);
  expect(migrations.length).toBeGreaterThan(0);

  const migrationsCountRow = await database.query(
    "SELECT count(*)::int FROM pgmigrations;",
  );

  const migrationsCount = migrationsCountRow.rows[0].count;

  expect(migrationsCount).toBe(migrations.length);
});
