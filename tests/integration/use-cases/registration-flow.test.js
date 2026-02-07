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
    const createdUser =  await orchestrator.createUser({
      username: "RegistrationFlow",
      email: "RegistrationFlow@gmail.com",
      password: "senhamonstra123",
    })  

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

    expect(createdUser).not.toBe(null);
  })

  test("Receive activation email", async () =>
  {

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