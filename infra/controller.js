import { errorFactory } from "infra/errors";

function onErrorHandler(error, request, response) {
  // const internalError = errorFactory
  //   .getInternalServerError()
  //   .withStatusCode(error.statusCode);
  console.log(error);
  response.status(error.statusCode).json(error);
}

function onNoMatchHandler(request, response) {
  const methodNotAllowedError = errorFactory.getMethodNotAllowedError();
  response.status(methodNotAllowedError.statusCode).json(methodNotAllowedError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
