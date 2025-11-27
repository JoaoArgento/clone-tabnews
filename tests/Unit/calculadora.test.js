const calculadora = require("../../models/calculadora.js")

test("Teste na soma", () =>
{
  const resultado = calculadora.Sum(10, 10)
  expect(resultado).toBe(20);
});  

test("Teste na calculadora 02", () =>
{
  const resultado = calculadora.Sum("Babata", 10)
  expect(resultado).toBe("Error");
});

test("Teste na calculadora 02", () =>
{
  const resultado = calculadora.Sum(0/0, 1.5);
  expect(resultado).toBe("Error");
});

test("Teste na função sum", () =>
{
  const operation = "+";
  const validOptions = ["+", "-", "/", "*", "**"];

  const result = calculadora.Calculate(10, 20, operation);
  expect(validOptions).toContain(operation);

});