const { DataTypes } = require("sequelize");
const sequelize = require("../../common/config/database");

const Book = sequelize.define(
  "Book",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title cannot be empty.",
        },
        len: {
          args: [1, 255],
          msg: "Title length must be between 1 and 255 characters.",
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Author cannot be empty.",
        },
        len: {
          args: [1, 255],
          msg: "Author length must be between 1 and 255 characters.",
        },
      },
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "ISBN cannot be empty.",
        },
        isISBN(value) {
          // TODO: Check this to enhance ISBN validation https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
          const isbnRegex =
            /^(?:ISBN(?:-13)?:? )?(?=[-0-9 ]{13}$|(?=[0-9X]{10}$)0?[\dX]{10}|(?:[0-9]{3}[- ]?){3}[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X])[-0-9X ]+$/;
          if (!isbnRegex.test(value)) {
            throw new Error("Invalid ISBN format.");
          }
        },
      },
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        isTotalQuantityValid(value) {
          if (value < this.currentQuantity) {
            throw new Error("Total quantity cannot subceed current quantity.");
          }
        },
      },
    },
    currentQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        isCurrentQuantityValid(value) {
          if (value > this.totalQuantity) {
            throw new Error("Current quantity cannot exceed total quantity.");
          }
        },
      },
    },
    shelfLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Shelf location cannot be empty.",
        },
      },
    },
  },
  {
    tableName: "Books",
    indexes: [
      {
        fields: ["ISBN"],
        unique: true,
      },
      {
        fields: ["title", "author", "ISBN"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

module.exports = Book;
