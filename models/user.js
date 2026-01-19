import database from "infra/database";
import { errorFactory } from "infra/errors.js";

async function validateUniqueEmail(email) {
  const result = await database.query({
    text: "SELECT email FROM users WHERE LOWER(email) = LOWER($1)",
    values: [email],
  });

  if (result.rowCount > 0) {
    const error = errorFactory.getValidationError();
    throw error;
  }
}

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

async function create(userInput) {
  await validateUniqueInfo("email", userInput.email);
  await validateUniqueInfo("username", userInput.username);

  const newUser = await runInsertQuery(userInput);

  return newUser;
}

const user = {
  create,
};

export default user;
