import orchestrator from "tests/orchestrator.js";

beforeAll(async () =>
{
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase(); 
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () =>
{
  test("Create user account", async () =>
  {
  
    const createRequest = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers:
      {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({
        username: "RegistrationFlow",
        email: "RegistrationFlow@gmail.com",
        password: "senhamonstra123",
      })
    })
    expect(createRequest.status).toBe(201);

    const response = await fetch("http://localhost:3000/api/v1/users/RegistrationFlow");

    const responseBody = await response.json();

    expect(responseBody).toEqual({
        id: responseBody.id,
        username: "RegistrationFlow",
        email: "RegistrationFlow@gmail.com", 
        features: ["read:activation_token"],
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

    })

  test("Receive activation email", async () =>
  {
      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.sender).toBe("<contato@brabo.com.br>");
      expect(lastEmail.recipients[0]).toBe("<RegistrationFlow@gmail.com>");
      expect(lastEmail.subject).toBe("Ative seu Cadastro!");
      expect(lastEmail.text).toContain("RegistrationFlow");
  });

  test("Activate account", async () =>
  {

  });

  test("Login", async () =>
  {

  });

  test("Get user information", async () =>
  {

  });
})