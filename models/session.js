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

async function findOneValidByToken(token) {
  const results = await database.query({
    text: `SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW() LIMIT 1`,
    values: [token],
  });
  if (results.rowCount == 0) {
    throw errorFactory.getUnauthorizedError();
  }
  return results.rows[0];
}
async function renew(sessionId) {
  const expiresAt = new Date(Date.now() + daysToMS(EXPIRATION_DAY_COUNT));

  const results = await database.query({
    text: "UPDATE sessions SET expires_at = $2, updated_at = NOW() WHERE id = $1 RETURNING *;",
    values: [sessionId, expiresAt],
  });

  if (results.rowCount == 0) {
    throw errorFactory.getNotFoundError();
  }

  return results.rows[0];
}

async function expireOneById(sessionId) {
  const results = await database.query({
    text: "UPDATE sessions SET expires_at = expires_at - interval '1 year', updated_at = NOW() WHERE id = $1 RETURNING *;",
    values: [sessionId],
  });

  return results.rows[0];
}
const session = {
  create,
  renew,
  expireOneById,
  findOneValidByToken,
  getExpirationDayInMS: () => {
    return daysToMS(EXPIRATION_DAY_COUNT);
  },
};

export default session;
