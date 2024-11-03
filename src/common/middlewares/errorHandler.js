const { errTypes } = require("../constants");
const { ValidationError, UniqueConstraintError } = require("sequelize");

class CustomError extends Error {
  constructor(errProps) {
    super();
    this.type = errProps.type || "InternalServerError";
    this.code = errProps.code || errTypes[this.type].code || errTypes.InternalServerError.code;
    this.message =
      errProps.message || errTypes[this.type].defaultMessage || errTypes.InternalServerError.defaultMessage;
    this.details = errProps.details || [];
  }
}

function errorHandler(err, req, res, next) {
  console.log(err, err.stack);
  if (err instanceof ValidationError) {
    return res.status(errTypes.ValidationError.code).json({
      type: "ValidationError",
      code: errTypes.ValidationError.code,
      message: errTypes.ValidationError.defaultMessage,
      details: err.errors.map((e) => e.message),
    });
  }
  return res.status(err.code || errTypes.InternalServerError.code).json(err);
}

module.exports = { errorHandler, CustomError };
