const { Op } = require("sequelize");
const Books = require("../model");
const Borrowings = require("../../borrowings/model");

const { CustomError } = require("../../common/middlewares/errorHandler");

const booksService = {
  async addBook({ title, author, ISBN, totalQuantity, shelfLocation }) {
    const newBook = await Books.create({
      title,
      author,
      ISBN,
      totalQuantity,
      currentQuantity: totalQuantity,
      shelfLocation,
    });
    return newBook;
  },

  async updateBook(id, bookData) {
    const book = await Books.findByPk(id);
    if (!book) throw new CustomError({ type: "NotFound" });

    const { title, author, ISBN, totalQuantity, shelfLocation } = bookData;
    const updateObj = {};
    if (title) updateObj.title = title;
    if (author) updateObj.author = author;
    if (ISBN) updateObj.ISBN = ISBN;
    if (totalQuantity) {
      const borrowedQuantity = book.totalQuantity - book.currentQuantity;
      if (totalQuantity < borrowedQuantity) {
        throw new CustomError({
          type: "ValidationError",
          message: "New total quantity is smaller than the already borrowed quantitiy",
        });
      }
      updateObj.totalQuantity = totalQuantity;
      updateObj.currentQuantity = totalQuantity - borrowedQuantity;
    }
    if (shelfLocation) updateObj.shelfLocation = shelfLocation;

    const updatedBook = await book.update(updateObj);
    return updatedBook;
  },

  async deleteBook(id) {
    const book = await Books.findByPk(id);
    if (!book) throw new CustomError({ type: "NotFound" });

    const isBorrowed = await Borrowings.findOne({ where: { bookId: id } });
    if (isBorrowed)
      throw new CustomError({ type: "ValidationError", message: "Book is already borrowed, can't be deleted" });

    await Books.destroy({ where: { id } });
  },

  async getBooks(query) {
    const { searchTerm, orderBy = "createdAt", orderDirection = "asc", page = 1, limit = 10 } = query;
    let searchObj = {};

    if (searchTerm)
      searchObj = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${searchTerm}%` } },
          { author: { [Op.iLike]: `%${searchTerm}%` } },
          { ISBN: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      };

    const { count, rows: books } = await Books.findAndCountAll({
      where: searchObj,
      limit,
      offset: (page - 1) * limit,
      order: [[orderBy, orderDirection]],
    });

    return { books, count };
  },
};

module.exports = booksService;
