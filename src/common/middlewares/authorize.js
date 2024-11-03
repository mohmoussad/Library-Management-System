const { CustomError } = require("./errorHandler");

function authorize(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError({ type: "AuthorizationError" });
    }
    next();
  };
}

module.exports = authorize;
