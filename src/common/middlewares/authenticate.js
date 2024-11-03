const jwt = require("jsonwebtoken");
const { CustomError } = require("./errorHandler");
const User = require("../../users/model");
const { JWT_SECRET } = require("../config/envVars");

async function authenticate(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return next(
      new CustomError({
        type: "AuthenticationError",
        message: "Authentication failed. No token provided.",
        statusCode: 401,
      })
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(
        new CustomError({
          type: "AuthenticationError",
          message: "Authentication failed. Invalid token.",
          statusCode: 401,
        })
      );
    }

    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new CustomError({
        type: "AuthenticationError",
        message: "Authentication failed. Invalid token.",
        statusCode: 401,
      })
    );
  }
}

module.exports = authenticate;
