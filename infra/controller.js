import { errorFactory } from "infra/errors";

function onErrorHandler(error, request, response) {
  const internalError = errorFactory.getInternalServerError();
  response.status(internalError.statusCode).json(internalError);
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
