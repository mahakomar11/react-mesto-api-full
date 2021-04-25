class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "CustomError";
    this.statusCode = status;
  }
}

module.exports = CustomError;
