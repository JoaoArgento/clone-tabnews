import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import authenticator from "models/authenticator.js";
import session from "models/session.js";
import { errorFactory } from "infra/errors";
import * as cookie from "cookie";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInput = request.body;
  let authenticatedUser;

  try {
    authenticatedUser = await authenticator.checkUserInputValidation(userInput);

    if (authenticatedUser == null) {
      throw errorFactory.getUnauthorizedError();
    }
  } catch (error) {
    throw errorFactory.getUnauthorizedError();
  }
  console.log("Sessão: ", authenticatedUser);

  const newSession = await session.create(authenticatedUser.id);

  const cookieInfo = cookie.serialize("session_id", newSession.token, {
    path: "/",
    maxAge: session.getExpirationDayInMS() / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", cookieInfo);

  return response.status(201).json(newSession);
}
