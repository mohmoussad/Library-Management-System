const booksService = require("../service");
const {
  httpStatusCodes: { CREATED, OK },
} = require("../../common/constants");
const { BOOK_CREATED, BOOK_UPDATED, BOOK_DELETED } = require("./constants.js");

const booksController = {
  async addBook(req, res, next) {
    try {
      const book = await booksService.addBook(req.body);
      res.status(CREATED).json({ book, message: BOOK_CREATED });
    } catch (error) {
      next(error);
    }
  },

  async updateBook(req, res, next) {
    try {
      const book = await booksService.updateBook(req.params.id, req.body);
      res.status(OK).json({ book, message: BOOK_UPDATED });
    } catch (error) {
      next(error);
    }
  },

  async deleteBook(req, res, next) {
    try {
      await booksService.deleteBook(req.params.id);
      res.status(OK).json({ message: BOOK_DELETED });
    } catch (error) {
      next(error);
    }
  },

  async getBooks(req, res, next) {
    try {
      const { books, count } = await booksService.getBooks(req.query);
      res.status(OK).json({ books, count });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = booksController;
