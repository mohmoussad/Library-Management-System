const {
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
} = require("./httpStatusCodes");

module.exports = {
  ValidationError: { code: BAD_REQUEST, defaultMessage: "The request data contains validation errors." },
  ConflictError: {
    code: CONFLICT,
    defaultMessage: "Unique constraint violation or this identifier is already existed.",
  },
  AuthenticationError: { code: UNAUTHORIZED, defaultMessage: "Authentication failed." },
  AuthorizationError: { code: FORBIDDEN, defaultMessage: "You are not authorized to access this resource." },
  NotFound: { code: NOT_FOUND, defaultMessage: "The requested resource was not found." },
  RateLimitExceeded: { code: TOO_MANY_REQUESTS, defaultMessage: "Rate limit exceeded." },
  InternalServerError: { code: INTERNAL_SERVER_ERROR, defaultMessage: "An unexpected error occurred on the server." },
};
