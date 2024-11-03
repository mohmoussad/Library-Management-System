const Joi = require("joi");

const borrowingsSchema = {
  borrowBook: {
    body: Joi.object({
      userId: Joi.string()
        .guid({ version: ["uuidv4"] })
        .optional(),
      bookId: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required(),
      dueDate: Joi.date().iso().greater("now").required().messages({
        "date.greater": "dueDate must be a future date.",
      }),
    }),
  },
  returnBook: {
    params: Joi.object({
      id: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required(),
    }),
  },
  getUserBorrowings: {
    params: Joi.object({
      userId: Joi.string()
        .guid({ version: ["uuidv4"] })
        .optional(),
    }),
    query: Joi.object({
      orderBy: Joi.string().valid("createdAt", "updatedAt"),
      orderDirection: Joi.string().valid("asc", "desc"),
      limit: Joi.number().min(5).max(100).default(10),
      page: Joi.number().min(1).default(1),
    }),
  },
  getOverdueBorrowings: {
    query: Joi.object({
      orderBy: Joi.string().valid("createdAt", "updatedAt"),
      orderDirection: Joi.string().valid("asc", "desc"),
      limit: Joi.number().min(5).max(100).default(10),
      page: Joi.number().min(1).default(1),
    }),
  },
};

module.exports = borrowingsSchema;
