const borrowingsService = require("../service");
const {
  httpStatusCodes: { CREATED, OK },
} = require("../../common/constants");
const { BOOK_BORROWED, BOOK_RETURNED } = require("./constants.js");

const borrowingsController = {
  async borrowBook(req, res, next) {
    try {
      const borrowing = await borrowingsService.borrowBook(req.body, req.user);
      res.status(CREATED).json({ borrowing, message: BOOK_BORROWED });
    } catch (error) {
      next(error);
    }
  },

  async returnBook(req, res, next) {
    try {
      const borrowing = await borrowingsService.returnBook(req.params.id);
      res.status(OK).json({ borrowing, message: BOOK_RETURNED });
    } catch (error) {
      next(error);
    }
  },

  async getUserBorrowings(req, res, next) {
    try {
      const { borrowings, count } = await borrowingsService.getUserBorrowings(req.body, req.user, req.query);
      res.status(OK).json({ borrowings, count });
    } catch (error) {
      next(error);
    }
  },
  async getOverdueBorrowings(req, res, next) {
    try {
      const { overdueBorrowings, count } = await borrowingsService.getOverdueBorrowings(req.query);
      res.status(OK).json({ overdueBorrowings, count });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = borrowingsController;
