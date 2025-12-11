import AsyncRetry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return AsyncRetry(
      async () => {
        const response = await fetch("http://localhost:3000/api/v1/status");
        await response.json();
      },
      { retries: 100 },
    );
  }
}

export default {
  waitForAllServices,
};
