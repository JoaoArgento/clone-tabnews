import session from "models/session";
import orchestrator from "tests/orchestrator.js";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();

  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE in api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const newUser = await orchestrator.createUser({
        username: "Picamoles",
      });

      const sessionObject = await orchestrator.createSession(newUser.id);

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id = ${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      const responseExpiresAt = Date.parse(responseBody.expires_at);
      const responseUpdatedAt = Date.parse(responseBody.updated_at);

      expect(responseExpiresAt < sessionObject.expires_at).toBe(true);
      expect(responseUpdatedAt > sessionObject.updated_at).toBe(true);

      const parsedCookie = setCookieParser(response, { map: true });

      expect(parsedCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });

    test("With noexistent session", async () => {
      const sessionToken = "AAAAABBBdsfdasdasA";

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id = ${sessionToken}`,
        },
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

    test("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.getExpirationDayInMS()),
      });

      const newUser = await orchestrator.createUser({
        username: "Picamoles2",
      });

      const sessionObject = await orchestrator.createSession(newUser.id);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id = ${sessionObject.token}`,
        },
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

    // test("With session almost expiring", async () => {
    //   jest.useFakeTimers({
    //     now: new Date(Date.now() - (session.getExpirationDayInMS() - 1000)),
    //   });

    //   const newUser = await orchestrator.createUser({
    //     username: "Picão",
    //   });

    //   const sessionObject = await orchestrator.createSession(newUser.id);

    //   jest.useRealTimers();

    //   const response = await fetch("http://localhost:3000/api/v1/user", {
    //     headers: {
    //       Cookie: `session_id = ${sessionObject.token}`,
    //     },
    //   });

    //   expect(response.status).toBe(200);

    //   const responseBody = await response.json();

    //   expect(responseBody).toEqual({
    //     id: newUser.id,
    //     username: "Picão",
    //     email: newUser.email,
    //     password: newUser.password,
    //     created_at: newUser.created_at.toISOString(),
    //     updated_at: newUser.updated_at.toISOString(),
    //   });

    //   expect(uuidVersion(responseBody.id)).toBe(4);
    //   expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    //   expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    //   const renewedSession = await session.findOneValidByToken(
    //     sessionObject.token,
    //   );

    //   expect(renewedSession.expires_at > sessionObject.expires_at).toBe(true);
    //   expect(renewedSession.updated_at > sessionObject.updated_at).toBe(true);

    //   const parsedCookie = setCookieParser(response, { map: true });

    //   expect(parsedCookie.session_id).toEqual({
    //     name: "session_id",
    //     value: renewedSession.token,
    //     maxAge: session.getExpirationDayInMS() / 1000,
    //     path: "/",
    //     httpOnly: true,
    //   });
    // });
  });
});
