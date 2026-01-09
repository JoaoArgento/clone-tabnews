import { errors } from "infra/errors";

function onErrorHandler(error, request, response) {
  const internalError = errors.getInternalServerError().withCause(error);

  response.status(internalError.statusCode).json(internalError);
}

function onNoMatchHandler(request, response) {
  const methodNotAllowedError = errors.getMethodNotAllowedError();
  response.status(methodNotAllowedError.statusCode).json(methodNotAllowedError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
