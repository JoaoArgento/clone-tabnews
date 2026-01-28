import { createRouter } from "next-connect";
import controller from "infra/controller";
import authenticator from "models/authenticator.js";
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

  return response.status(201).json(authenticatedUser);
}
