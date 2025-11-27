function Sum(number1, number2)
{
  if (isNaN(number1) || isNaN(number2))
    return "Error";

  return number1 + number2;
}

function Calculate(number1, number2, operation)
{
    switch (operation)
    {
      case "+":
        return number1 + number2;
      case "-":
        return number1 - number2;
    }
}


exports.Sum = Sum;
exports.Calculate = Calculate;
