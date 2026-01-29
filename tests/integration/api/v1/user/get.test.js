import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET in api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const newUser = await orchestrator.createUser({
        username: "Picamoles",
      });

      const response = await fetch("http://localhost:3000/api/v1/user");

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: newUser.id,
        username: "Picamoles",
        email: newUser.email,
        password: newUser.password,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
    });
  });
});
