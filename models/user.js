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
  const hashedPassword = await password.hash(userInput.password);
  userInput.password = hashedPassword;
}

async function update(username, userInput) {
  const targetUser = await findOneByUsername(username);
  if ("username" in userInput) {
    await validateUniqueInfo("username", userInput.username);
  }
  if ("email" in userInput) {
    await validateUniqueInfo("email", userInput.email);
  }
  if ("password" in userInput) {
    await hashPasswordInObject(userInput);
  }

  const newUser = { ...targetUser, ...userInput };
  const updatedUser = await runUpdateQuery(newUser);
  return updatedUser;
}

async function runUpdateQuery(user) {
  const results = await database.query({
    text: "UPDATE users SET username = $2, email = $3, password = $4, updated_at = timezone('utc', now()) WHERE id = $1 RETURNING *;",
    values: [user.id, user.username, user.email, user.password],
  });

  return results.rows[0];
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
  update,
  findOneByUsername,
};

export default user;
