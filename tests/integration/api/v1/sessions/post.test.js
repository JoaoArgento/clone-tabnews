import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST in api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With incorrect email but correct password", async () => {
      await orchestrator.createUser({
        email: "Joaozera@gmail.com",
        password: "senhabraba123",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "Joaozera1@gmail.com",
          password: "senhabraba123",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não encontrados",
        action: "Verifique se os dados digitados estão corretos",
        status_code: 401,
      });
    });

    test("With correct email but incorrect password", async () => {
      await orchestrator.createUser({
        email: "Joaozera1@gmail.com",
        password: "senhabraba123",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "Joaozera1@gmail.com",
          password: "senhabraba1234",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não encontrados",
        action: "Verifique se os dados digitados estão corretos",
        status_code: 401,
      });
    });
  });
});
