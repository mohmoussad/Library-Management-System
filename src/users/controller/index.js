const usersService = require("../service");
const {
  httpStatusCodes: { CREATED, OK, NO_CONTENT },
} = require("../../common/constants");
const { USER_CREATED, USER_UPDATED, USER_DELETED, WELCOME } = require("./constants.js");

const usersController = {
  async register(req, res, next) {
    try {
      const { user, token } = await usersService.register(req.body);
      res.status(CREATED).json({ user, token, message: USER_CREATED });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await usersService.updateUser(req.params.id, req.body, req.user);
      res.status(OK).json({ user, message: USER_UPDATED });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      await usersService.deleteUser(req.params.id, req.user);
      res.status(OK).json({ message: USER_DELETED });
    } catch (error) {
      next(error);
    }
  },

  async getUsers(req, res, next) {
    try {
      const { users, count } = await usersService.getUsers(req.query);
      res.status(OK).json({ users, count });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { user, token } = await usersService.login(req.body);
      res.status(CREATED).json({ user, token, message: WELCOME });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = usersController;
