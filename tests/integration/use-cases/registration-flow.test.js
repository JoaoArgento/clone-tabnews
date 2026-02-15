import orchestrator from "tests/orchestrator.js";
import activator from "models/activator.js";
beforeAll(async () =>
{
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase(); 
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () =>
{
  let createdUserBody = undefined;

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

    createdUserBody = await response.json();

    expect(createdUserBody).toEqual({
        id: createdUserBody.id,
        username: "RegistrationFlow",
        email: "RegistrationFlow@gmail.com", 
        features: ["read:activation_token"],
        password: createdUserBody.password,
        created_at: createdUserBody.created_at,
        updated_at: createdUserBody.updated_at,
      });

    })

  test("Receive activation email", async () =>
  {
      const lastEmail = await orchestrator.getLastEmail();
      const activationToken = await activator.findOneById(createdUserBody.id);

      expect(lastEmail.sender).toBe("<contato@brabo.com.br>");
      expect(lastEmail.recipients[0]).toBe("<RegistrationFlow@gmail.com>");
      expect(lastEmail.subject).toBe("Ative seu Cadastro!");
      expect(lastEmail.text).toContain("RegistrationFlow");
      expect(lastEmail.text).toContain(activationToken.id);

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