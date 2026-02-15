import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import activator from "models/activator.js";
const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInput = request.body; 
  const newUser = await user.create(userInput);
  const activationToken = await activator.create(newUser.id);
  await activator.sendEmailToUser(newUser, activationToken);
  return response.status(201).json(newUser);
}
