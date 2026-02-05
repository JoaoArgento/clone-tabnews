/* eslint-disable no-unused-vars */
import AsyncRetry from "async-retry";
import database from "infra/database.js";
import migrator from "models/migrator";
import user from "models/user.js";
import { faker } from "@faker-js/faker";
import session from "models/session.js";

const emailHttpURL = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitForAllServices() {
  await waitForWebServer();
  await waitForService(emailHttpURL);
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
        }
      },
      { retries: 100, maxTimeout: 3000 },
    );
  }
}
async function waitForService(serviceURL) {
  return AsyncRetry(
    async (_bail, _tryNumber) => {
      try {
        const response = await fetch(serviceURL);

        if (!response.ok) {
          throw new Error(`deu erro ${response.status}`);
        }
      } catch (error) {
        console.log(error);

        throw error;
      }
    },
    { retries: 100, maxTimeout: 3000 },
  );
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.listPendingMigrations(false);
}

async function createUser(userInfo) {
  return await user.create({
    username:
      userInfo.username || faker.internet.username().replace("/[_.-]/g", ""),
    email: userInfo.email || faker.internet.email(),
    password: userInfo.password || "validPassword",
  });
}
async function createSession(userId) {
  return await session.create(userId);
}

async function deleteAllEmails() {
  await fetch(`${emailHttpURL}/messages`, {
    method: "DELETE",
  });
}

async function getLastEmail() {
  const emailsResponse = await fetch(`${emailHttpURL}/messages`, {
    method: "GET",
  });
  const emailsBody = await emailsResponse.json();

  const lastEmailItem = emailsBody.pop();

  const emailTextResponse = await fetch(
    `${emailHttpURL}/messages/${lastEmailItem.id}.plain`,
  );

  const emailTextBody = await emailTextResponse.text();
  lastEmailItem.text = emailTextBody;

  return lastEmailItem;
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createSession,
  deleteAllEmails,
  getLastEmail,
};

export default orchestrator;
