const { DataTypes } = require("sequelize");
const sequelize = require("../../common/config/database");
const Book = require("../../books/model/");
const User = require("../../users/model/");

const Borrowing = sequelize.define(
  "Borrowing",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Books",
        key: "id",
      },
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: "borrowDate must be a valid date.",
        },
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "dueDate must be a valid date.",
        },
        isAfter: {
          args: String(new Date().toISOString().split("T")[0]),
          msg: "dueDate must be a future date.",
        },
      },
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "returnDate must be a valid date.",
        },
        isAfterBorrowDate(value) {
          if (this.borrowDate && value && new Date(value) < new Date(this.borrowDate)) {
            throw new Error("returnDate must be after borrowDate.");
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned", "overdue"),
      allowNull: false,
      defaultValue: "borrowed",
      validate: {
        isIn: {
          args: [["borrowed", "returned", "overdue"]],
          msg: "status must be either 'borrowed', 'returned', or 'overdue'.",
        },
      },
    },
  },
  {
    tableName: "Borrowings",
    // TODO: indexes
    indexes: [],
  }
);

Borrowing.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Borrowing, { foreignKey: "userId" });

Borrowing.belongsTo(Book, { foreignKey: "bookId" });
Book.hasMany(Borrowing, { foreignKey: "bookId" });

module.exports = Borrowing;
