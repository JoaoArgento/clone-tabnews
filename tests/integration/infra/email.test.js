import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(() => {
  orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Joao <Joaoargento@gmail.com>",
      to: "Joaoargento12@gmail.com",
      subject: "Test de assunto",
      text: "test de corpo",
    });

    await email.send({
      from: "Joao <Joaoargento@gmail.com>",
      to: "Joaoargento12@gmail.com",
      subject: "Ultimo email enviado",
      text: "é hoje paizão, falta 2 horas!!",
    });

    const lastEmail = await orchestrator.getLastEmail();
    console.log(lastEmail);

    expect(lastEmail.sender).toBe("<Joaoargento@gmail.com>");
    expect(lastEmail.recipients[0]).toBe("<Joaoargento12@gmail.com>");
    expect(lastEmail.subject).toBe("Ultimo email enviado");
    expect(lastEmail.text).toBe("é hoje paizão, falta 2 horas!!\r\n");
  });
});
