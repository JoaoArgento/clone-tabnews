class ValidationError extends Error {
  constructor(message) {
    super(message);
  }
}

new ValidationError("pintão gros");
