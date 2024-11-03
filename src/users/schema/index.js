const Joi = require("joi");

const usersSchema = {
  register: {
    body: Joi.object({
      name: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .trim()
        .required()
        .messages({
          "string.pattern.base": "Name can only contain alphabetic characters and spaces.",
          "string.min": "Name should have at least 3 characters.",
          "string.max": "Name should not exceed 50 characters.",
        }),
      email: Joi.string().email().trim().required(),
      password: Joi.string().min(8).max(30).required().messages({
        "string.min": "Password should have at least 8 characters.",
        "string.max": "Password should not exceed 30 characters.",
      }),
      role: Joi.string().valid("borrower", "admin").required(),
    }),
  },
  updateUser: {
    params: Joi.object({
      id: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required(),
    }),
    body: Joi.object({
      name: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .trim()
        .messages({
          "string.pattern.base": "Name can only contain alphabetic characters and spaces.",
          "string.min": "Name should have at least 3 characters.",
          "string.max": "Name should not exceed 50 characters.",
        }),
      email: Joi.string().trim().email(),
      password: Joi.string().min(8).max(30).messages({
        "string.min": "Password should have at least 8 characters.",
        "string.max": "Password should not exceed 30 characters.",
      }),
    }),
  },
  deleteUser: {
    params: Joi.object({
      id: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required(),
    }),
  },
  getUsers: {
    query: Joi.object({
      searchTerm: Joi.string().allow(""),
      role: Joi.string().valid("borrower", "admin"),
      orderBy: Joi.string().valid("name", "email"),
      orderDirection: Joi.string().valid("asc", "desc"),
      limit: Joi.number().min(5).max(100).default(10),
      page: Joi.number().min(1).default(1),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().email().trim().required(),
      password: Joi.string().required(),
    }),
  },
};

module.exports = usersSchema;
