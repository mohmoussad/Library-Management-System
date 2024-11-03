const { Op } = require("sequelize");
const Borrowings = require("../model");
const Books = require("../../books/model");
const Users = require("../../users/model");

const { CustomError } = require("../../common/middlewares/errorHandler");
const sequelize = require("../../common/config/database");
const Book = require("../../books/model");
const User = require("../../users/model");

const borrowingsService = {
  async borrowBook({ userId: bodyUserId, bookId, dueDate }, { id: loggedInUserId, role }) {
    const book = await Books.findByPk(bookId);
    if (!book) throw new CustomError({ type: "NotFound", message: "No book with this id" });
    if (book.currentQuantity == 0)
      throw new CustomError({ type: "ConflictError", message: "All copies of this book are already borrowed" });

    let borrowerId = "";
    if (role == "admin") {
      if (!bodyUserId) throw new CustomError({ type: "ValidationError", details: ['"userId" is required'] });
      const borrower = await Users.findByPk(bodyUserId);
      if (!borrower) throw new CustomError({ type: "NotFound" });
      borrowerId = bodyUserId;
    }
    if (role == "borrower") borrowerId = loggedInUserId;

    const isBorrowed = await Borrowings.findOne({
      where: {
        userId: borrowerId,
        bookId,
        status: { [Op.or]: ["borrowed", "overdue"] },
      },
    });
    if (isBorrowed) throw new CustomError({ type: "ConflictError", message: "Already borrowed by this user" });

    const transaction = await sequelize.transaction();

    try {
      const borrowing = await Borrowings.create(
        {
          userId: borrowerId,
          bookId,
          borrowDate: new Date(),
          dueDate,
          status: "borrowed",
        },
        { transaction }
      );

      await book.update(
        {
          currentQuantity: book.currentQuantity - 1,
        },
        { transaction }
      );

      await transaction.commit();
      return borrowing;
    } catch (error) {
      await transaction.rollback();
      throw new CustomError({
        type: "InternalServerError",
        message: "Error in borrowing request",
      });
    }
  },

  async returnBook(id) {
    const borrowing = await Borrowings.findByPk(id);
    if (!borrowing) throw new CustomError({ type: "NotFound" });
    if (borrowing.status == "returned") throw new CustomError({ type: "ConflictError", message: "Already returned" });

    const book = await Books.findByPk(borrowing.bookId);

    const transaction = await sequelize.transaction();

    try {
      await borrowing.update(
        {
          returnDate: new Date(),
          status: "returned",
        },
        { transaction }
      );

      await book.update(
        {
          currentQuantity: book.currentQuantity + 1,
        },
        { transaction }
      );

      await transaction.commit();
      return borrowing;
    } catch (error) {
      await transaction.rollback();
      throw new CustomError({ type: "InternalServerError" });
    }
  },

  async getUserBorrowings({ userId: bodyUserId }, { id: loggedInUserId, role }, query) {
    let borrowerId = "";
    if (role == "admin") {
      if (!bodyUserId) throw new CustomError({ type: "ValidationError", details: ['"userId" is required'] });
      borrowerId = bodyUserId;
    }
    if (role == "borrower") borrowerId = loggedInUserId;

    const user = await Users.findByPk(borrowerId);
    if (!user) throw new CustomError({ type: "NotFound" });

    const { orderBy = "createdAt", orderDirection = "asc", page = 1, limit = 10 } = query;
    const { count, rows: borrowings } = await Borrowings.findAndCountAll({
      where: { userId: borrowerId, status: { [Op.or]: ["borrowed", "overdue"] } },
      include: [
        { model: Book, attributes: ["title"] },
        { model: User, attributes: ["name"] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [[orderBy, orderDirection]],
    });

    return { borrowings, count };
  },

  async getOverdueBorrowings(query) {
    await this.checkOverdueBorrowings();
    const { orderBy = "createdAt", orderDirection = "asc", page = 1, limit = 10 } = query;
    const { count, rows: overdueBorrowings } = await Borrowings.findAndCountAll({
      where: { status: "overdue" },
      include: [
        { model: Book, attributes: ["title"] },
        { model: User, attributes: ["name"] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [[orderBy, orderDirection]],
    });

    return { overdueBorrowings, count };
  },

  async checkOverdueBorrowings() {
    const batchSize = 100;
    let offset = 0;
    let totalUpdated = 0;

    while (true) {
      const overdueBorrowings = await Borrowings.findAll({
        where: {
          status: "borrowed",
          returnDate: {
            [Op.lt]: new Date(),
          },
        },
        limit: batchSize,
        offset,
      });

      if (overdueBorrowings.length === 0) break;

      const transaction = await sequelize.transaction();
      let updatedCount = 0;
      try {
        [updatedCount] = await Borrowings.update(
          { status: "overdue" },
          {
            where: {
              id: {
                [Op.in]: overdueBorrowings.map((book) => book.id),
              },
            },
          }
        );

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw new CustomError({
          message: `Error updating books with IDs ${overdueBorrowings.map((book) => book.id).join(", ")}: ${
            error.message
          }`,
        });
      }
      totalUpdated += updatedCount;
      console.log(`Updated ${updatedCount} books in batch ${offset + 1}.`);

      offset++;
    }

    return totalUpdated;
  },
};

module.exports = borrowingsService;
