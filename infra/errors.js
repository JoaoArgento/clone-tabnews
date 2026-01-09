// export class InternalServerError extends Error {
//   constructor({ cause }) {
//     super("Um erro interno inesperado aconteceu!", {
//       cause,
//     });
//     this.name = "InternalServerError";
//     this.action = "Entre em contato com o suporte";
//     this.statusCode = 500;
//   }
//   toJSON() {
//     return {
//       name: this.name,
//       message: this.message,
//       action: this.action,
//       status_code: this.statusCode,
//     };
//   }
// }

class CustomError extends Error {
  constructor({ name, message, action, statusCode }) {
    super(message);
    this.name = name;
    this.action = action;
    this.statusCode = statusCode;
    this.cause = undefined;
  }
  withCause(cause) {
    this.cause = cause;
    return this;
  }

  withStatusCode(statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

// export class MethodNotAllowedError extends Error {
//   constructor() {
//     super("Método não permitido para este endpoint");
//     this.name = "MethodNotAllowedError";
//     this.action = "Verifique se o método HTTP é válido para este endpoint";
//     this.statusCode = 405;
//   }
//   toJSON() {
//     return {
//       name: this.name,
//       message: this.message,
//       action: this.action,
//       status_code: this.statusCode,
//     };
//   }
// }

let errors = {
  getInternalServerError: () =>
    new CustomError(
      "InternalServerError",
      "Um erro interno inesperado aconteceu!",
      "Entre em contato com o suporte",
      500,
    ),
  getMethodNotAllowedError: () =>
    new CustomError(
      "MethodNotAllowedError",
      "Método não permitido para este endpoint",
      "Verifique se o método HTTP é válido para este endpoint",
      405,
    ),

  getServiceError: () =>
    new CustomError(
      "ServiceError",
      "Serviço indisponivel no momento",
      "Verifique se esse serviço existe!",
      503,
    ),
};

export { errors };
