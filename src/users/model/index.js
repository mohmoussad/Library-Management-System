const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../../common/config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [3, 50],
          msg: "Name should be between 3 and 50 characters.",
        },
        is: {
          args: /^[a-zA-Z\s]+$/i,
          msg: "Name can only contain alphabetic characters and spaces.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: {
          msg: "Must be a valid email address.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [8, 30],
          msg: "Password should be between 8 and 30 characters.",
        },
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ["borrower", "admin"],
    },
  },
  {
    tableName: "Users",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    indexes: [
      {
        fields: ["email", "role"],
        unique: true,
      },
      {
        fields: ["name", "email"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

module.exports = User;
