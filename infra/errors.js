export class CustomError extends Error {
  constructor(name, message, action, statusCode, cause) {
    super(message, { cause });
    this.name = name;
    this.action = action;
    this.statusCode = statusCode;
  }
  withCause(cause) {
    this.cause = cause;
    return this;
  }

  withStatusCode(statusCode) {
    this.statusCode = statusCode;
    return this;
  }
  withMessage(message) {
    this.message = message;
    return this;
  }

  withAction(action) {
    this.action = action;
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

let errorFactory = {
  getInternalServerError: () => {
    return new CustomError(
      "InternalServerError",
      "Um erro interno inesperado aconteceu!",
      "Entre em contato com o suporte",
      500,
    );
  },
  getMethodNotAllowedError: () => {
    return new CustomError(
      "MethodNotAllowedError",
      "Método não permitido para este endpoint",
      "Verifique se o método HTTP é válido para este endpoint",
      405,
    );
  },

  getServiceError: () => {
    return new CustomError(
      "ServiceError",
      "Serviço indisponivel no momento",
      "Verifique se esse serviço existe!",
      503,
    );
  },
  getValidationError: (validatingInfo) => {
    return new CustomError(
      "ValidationError",
      `o ${validatingInfo} já está em uso`,
      `Utilize um ${validatingInfo} diferente`,
      400,
    );
  },
};

export { errorFactory };
