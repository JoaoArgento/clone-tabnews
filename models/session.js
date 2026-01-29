import database from "infra/database";
import { errorFactory } from "infra/errors";

import crypto from "node:crypto";

const EXPIRATION_DAY_COUNT = 30;

function daysToMS(days) {
  return 60 * 60 * 24 * days * 1000;
}

async function create(userId) {
  const session = await runInsertQuery({
    token: crypto.randomBytes(48).toString("hex"),
    userId: userId,
    expiresAt: new Date(Date.now() + daysToMS(EXPIRATION_DAY_COUNT)),
  });

  return session;
}

async function runInsertQuery(sessionInfo) {
  const results = await database.query({
    text: "INSERT INTO sessions (token, user_id, expires_at) VALUES($1, $2, $3) RETURNING *;",
    values: [sessionInfo.token, sessionInfo.userId, sessionInfo.expiresAt],
  });
  if (results.rowCount == 0) {
    throw errorFactory.getNotFoundError();
  }
  return results.rows[0];
}
const session = {
  create,
  getExpirationDayInMS: () => {
    return daysToMS(EXPIRATION_DAY_COUNT);
  },
};

export default session;
