const Joi = require("joi");

const booksSchema = {
  addBook: {
    body: Joi.object({
      title: Joi.string().min(1).max(255).required().messages({
        "string.empty": "Title cannot be empty.",
        "string.min": "Title must be at least 1 character long.",
        "string.max": "Title must be at most 255 characters long.",
      }),
      author: Joi.string().min(1).max(255).required().messages({
        "string.empty": "Author cannot be empty.",
        "string.min": "Author must be at least 1 character long.",
        "string.max": "Author must be at most 255 characters long.",
      }),
      ISBN: Joi.string()
        .required()
        .pattern(
          /^(?:ISBN(?:-13)?:? )?(?=[-0-9 ]{13}$|(?=[0-9X]{10}$)0?[\dX]{10}|(?:[0-9]{3}[- ]?){3}[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X])[-0-9X ]+$/
        )
        .messages({
          "string.empty": "ISBN cannot be empty.",
          "string.pattern.base": "Invalid ISBN format.",
        }),
      totalQuantity: Joi.number().integer().min(0).required().messages({
        "number.base": "Total quantity must be a number.",
        "number.integer": "Total quantity must be an integer.",
        "number.min": "Total quantity cannot be less than 0.",
      }),
      shelfLocation: Joi.string().required().messages({
        "string.empty": "Shelf location cannot be empty.",
      }),
    }),
  },
  updateBook: {
    params: Joi.object({
      id: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required(),
    }),
    body: Joi.object({
      title: Joi.string().min(1).max(255).messages({
        "string.empty": "Title cannot be empty.",
        "string.min": "Title must be at least 1 character long.",
        "string.max": "Title must be at most 255 characters long.",
      }),
      author: Joi.string().min(1).max(255).messages({
        "string.empty": "Author cannot be empty.",
        "string.min": "Author must be at least 1 character long.",
        "string.max": "Author must be at most 255 characters long.",
      }),
      ISBN: Joi.string()
        .pattern(
          /^(?:ISBN(?:-13)?:? )?(?=[-0-9 ]{13}$|(?=[0-9X]{10}$)0?[\dX]{10}|(?:[0-9]{3}[- ]?){3}[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X])[-0-9X ]+$/
        )
        .messages({
          "string.pattern.base": "Invalid ISBN format.",
        }),
      totalQuantity: Joi.number().integer().min(0).messages({
        "number.base": "Total quantity must be a number.",
        "number.integer": "Total quantity must be an integer.",
        "number.min": "Total quantity cannot be less than 0.",
      }),
      shelfLocation: Joi.string().messages({
        "string.empty": "Shelf location cannot be empty.",
      }),
    })
  },
  deleteBook: {
    params: Joi.object({
      id: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required(),
    }),
  },
  getBooks: {
    query: Joi.object({
      searchTerm: Joi.string().allow(""),
      orderBy: Joi.string().valid(
        "title",
        "author",
        "ISBN",
        "totalQuantity",
        "shelfLocation",
        "createdAt",
        "updatedAt"
      ),
      orderDirection: Joi.string().valid("asc", "desc"),
      limit: Joi.number().min(5).max(100).default(10),
      page: Joi.number().min(1).default(1),
    }),
  },
};

module.exports = booksSchema;
