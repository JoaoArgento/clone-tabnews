/* eslint-disable no-unused-vars */
import AsyncRetry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return AsyncRetry(
      async (_bail, _tryNumber) => {
        try {
          const response = await fetch("http://localhost:3000/api/v1/status");

          if (!response.ok) {
            throw new Error(`deu erro ${response.status}`);
          }
        } catch (error) {
          console.log(error);

          throw error;
        } finally {
          console.log("Consegui!");
        }
      },
      { retries: 100, maxTimeout: 3000 },
    );
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
