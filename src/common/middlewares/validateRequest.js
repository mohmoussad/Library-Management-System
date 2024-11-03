const { CustomError } = require("./errorHandler");

const validateInput = (schema, input, res) => {
  if (!schema || !input) return null;
  const { error } = schema.validate(input);
  if (error) {
    throw new CustomError({
      type: "ValidationError",
      details: [error.details?.[0]?.message],
    });
  }
};

const validateRequest = (schema) => (req, res, next) => {
  const { body: bodySchema, query: querySchema, params: paramsSchema } = schema;
  validateInput(bodySchema, req.body, res);
  validateInput(querySchema, req.query, res);
  validateInput(paramsSchema, req.params, res);
  next();
};

module.exports = validateRequest;
