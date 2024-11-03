const { Router } = require("express");
const usersController = require("../controller");
const { validateRequest, authenticate, authorize } = require("../../common/middlewares");
const usersSchema = require("../schema");

const router = Router();

router.post("/", validateRequest(usersSchema.register), usersController.register);
router.patch(
  "/:id",
  authenticate,
  authorize(["admin", "borrower"]),
  validateRequest(usersSchema.updateUser),
  usersController.updateUser
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "borrower"]),
  validateRequest(usersSchema.deleteUser),
  usersController.deleteUser
);
router.get("/", authenticate, authorize(["admin"]), validateRequest(usersSchema.getUsers), usersController.getUsers);

router.post("/login", validateRequest(usersSchema.login), usersController.login);

module.exports = router;
