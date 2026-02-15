import email from "infra/email.js"

async function sendEmailToUser(user)
{
    await email.send({
      from: "Brabo <contato@brabo.com.br>",
      to: user.email,
      subject: "Ative seu Cadastro!",
      text: `${user.username} clique no link para ativar seu cadastro
      
Atenciosamente, 
PaizãoDeCalcinha
      `,
    }) 
}

const activator = {
  sendEmailToUser
}

export default activator;