const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../model");
const { CustomError } = require("../../common/middlewares/errorHandler");
const { JWT_SECRET } = require("../../common/config/envVars");

const usersService = {
  async register({ name, email, password, role }) {
    const userExists = await Users.findOne({ where: { email, role } });
    if (userExists) {
      throw new CustomError({ type: "ConflictError" });
    }
    const newUser = new Users({
      name,
      email,
      password,
      role,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET);
    return { newUser, token };
  },

  async updateUser(id, userData, { id: loggedInUserId, role }) {
    const user = await Users.findByPk(id);
    if (!user) throw new CustomError({ type: "NotFound" });

    if (role != "admin" && id != loggedInUserId) {
      throw new CustomError({ type: "AuthorizationError" });
    }

    const { name, email, password } = userData;
    const updateObj = {};
    if (name) updateObj.name = name;
    if (email) updateObj.email = email;
    if (password) updateObj.password = password;

    const updatedUser = await user.update(updateObj);
    return updatedUser;
  },

  async deleteUser(id, { id: loggedInUserId, role }) {
    const user = await Users.findByPk(id);
    if (!user) throw new CustomError({ type: "NotFound" });

    if (role != "admin" && id != loggedInUserId) {
      throw new CustomError({ type: "AuthorizationError" });
    }

    const hasBook = await Borrowings.findOne({ where: { userId: id } });
    if (hasBook)
      throw new CustomError({ type: "ValidationError", message: "User borrowed books, can't be deleted" });

    await Users.destroy({ where: { id } });
  },

  async getUsers(query) {
    const {
      searchTerm,
      role = "borrower",
      orderBy = "createdAt",
      orderDirection = "asc",
      page = 1,
      limit = 10,
    } = query;

    let searchObj = {};

    if (searchTerm)
      searchObj = {
        [Op.or]: [{ name: { [Op.iLike]: `%${searchTerm}%` } }, { email: { [Op.iLike]: `%${searchTerm}%` } }],
      };
    if (role) searchObj.role = role;

    const { count, rows: users } = await Users.findAndCountAll({
      where: searchObj,
      limit,
      offset: (page - 1) * limit,
      order: [[orderBy, orderDirection]],
    });

    return { users, count };
  },

  async login({ email, password }) {
    const user = await Users.findOne({
      where: { email },
    });
    if (!user) {
      throw new CustomError({ type: "AuthenticationError", message: "Authentication failed. Wrong credntials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new CustomError({ type: "AuthenticationError", message: "Authentication failed. Wrong credntials." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    return { user: userWithoutPassword, token };
  },
};

module.exports = usersService;
