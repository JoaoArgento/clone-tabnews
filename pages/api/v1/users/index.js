import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import orchestrator from "tests/orchestrator";
const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  await orchestrator.runPendingMigrations();

  const userInput = request.body;
  const newUser = await user.create(userInput);

  return response.status(201).json(newUser);
}
