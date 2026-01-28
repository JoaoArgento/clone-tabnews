import user from "models/user.js";
import password from "models/password.js";

async function checkUserInputValidation(userInput) {
  const storedUser = await user.findOneBy("email", userInput.email);

  if (storedUser == null) return null;

  const isPasswordCorrect = await password.compare(
    userInput.password,
    storedUser.password,
  );
  if (!isPasswordCorrect) {
    return null;
  }
  return storedUser;
}

const authenticator = {
  checkUserInputValidation,
};

export default authenticator;
