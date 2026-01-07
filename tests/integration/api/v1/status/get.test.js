import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET in api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Retrieving the current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.updated_at).toBeDefined();

      const parsedReceivedDate = new Date(
        responseBody.updated_at,
      ).toISOString();

      expect(responseBody.updated_at).toBe(parsedReceivedDate);

      expect(responseBody.dependencies.database).toBeDefined();

      expect(responseBody.dependencies.database.version).toEqual(16.0);

      expect(
        responseBody.dependencies.database.max_connections,
      ).toBeGreaterThan(0);
      expect(responseBody.dependencies.database.open_connections).toEqual(1);
    });
  });
});
