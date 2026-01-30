import { errorFactory } from "infra/errors";
import * as cookie from "cookie";
import session from "models/session.js";

function onErrorHandler(error, request, response) {
  if (error.name === "UnauthorizedError") {
    clearSessionCookie(response);
  }
  return response.status(error.statusCode).json(error);
}

function onNoMatchHandler(request, response) {
  const methodNotAllowedError = errorFactory.getMethodNotAllowedError();
  return response
    .status(methodNotAllowedError.statusCode)
    .json(methodNotAllowedError);
}

async function setSessionCookie(sessionToken, response) {
  const cookieInfo = cookie.serialize("session_id", sessionToken, {
    maxAge: session.getExpirationDayInMS() / 1000,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  response.setHeader("Set-Cookie", cookieInfo);
}

async function clearSessionCookie(response) {
  const cookieInfo = cookie.serialize("session_id", "invalid", {
    maxAge: -1,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  response.setHeader("Set-Cookie", cookieInfo);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  setSessionCookie,
  clearSessionCookie,
};

export default controller;
