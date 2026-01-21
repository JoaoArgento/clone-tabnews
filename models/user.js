import database from "infra/database";
import { errorFactory } from "infra/errors.js";
import password from "models/password.js";

async function validateUniqueInfo(colName, info) {
  const result = await database.query({
    text: `SELECT ${colName} FROM users WHERE LOWER(${colName}) = LOWER($1)`,
    values: [info],
  });

  if (result.rowCount > 0) {
    const error = errorFactory.getValidationError(colName);
    console.log(error);
    throw error;
  }
}

async function runInsertQuery(userInput) {
  const results = await database.query({
    text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
    values: [userInput.username, userInput.email, userInput.password],
  });

  return results.rows[0];
}

async function findOneByUsername(username) {
  const result = await database.query({
    text: "SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1",
    values: [username],
  });

  if (result.rowCount == 0) {
    throw errorFactory.getNotFoundError();
  }
  return result.rows[0];
}

async function hashPasswordInObject(userInput) {
  const hashedPassword = password.hash(userInput.password);
  userInput.password = hashedPassword;
}

async function create(userInput) {
  await validateUniqueInfo("email", userInput.email);
  await validateUniqueInfo("username", userInput.username);
  await hashPasswordInObject(userInput);

  const newUser = await runInsertQuery(userInput);

  return newUser;
}

const user = {
  create,
  findOneByUsername,
};

export default user;
