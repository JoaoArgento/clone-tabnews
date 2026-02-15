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
  await activator.sendEmailToUser(newUser);
  return response.status(201).json(newUser);
}
