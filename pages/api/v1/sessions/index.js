import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import authenticator from "models/authenticator.js";
import session from "models/session.js";
import { errorFactory } from "infra/errors";

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

  controller.setSessionCookie(newSession.token, response);

  return response.status(201).json(newSession);
}
