import email from "infra/email.js"
import database from "infra/database.js";
import webServer from "infra/webserver";
import { errorFactory } from "infra/errors";

async function sendEmailToUser(user, activationToken)
{
    await email.send({
      from: "Brabo <contato@brabo.com.br>",
      to: user.email,
      subject: "Ative seu Cadastro!",
      text: `${user.username} clique no link para ativar seu cadastro
${webServer.origin}/cadastro/ativar/${activationToken.id}
Atenciosamente, 
PaizãoDeCalcinha
      `,
    }) 
}

const EXPIRATION_IN_MS = 60 * 15 * 1000

async function create(userId)
{
  const expires_at = new Date(Date.now() + EXPIRATION_IN_MS);

  const result = await database.query({
    text: "INSERT INTO user_activation_tokens (user_id, expires_at) VALUES ($1, $2) RETURNING *;",
    values:  [userId, expires_at]
  });

  return result.rows[0]; 
}

async function findOneById(userId)
{
  const result = await database.query({
    text: "SELECT * FROM user_activation_tokens WHERE user_id = $1 LIMIT 1;",
    values: [userId],
  })

  if (result.rowCount == 0)
  {
    throw errorFactory.getNotFoundError();
  }
  return result.rows[0];
}

const activator = {
  sendEmailToUser,
  create,
  findOneById,
}

export default activator;