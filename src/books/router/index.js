const { Router } = require("express");
const booksController = require("../controller");
const { validateRequest, authenticate, authorize } = require("../../common/middlewares");
const booksSchema = require("../schema");

const router = Router();

router.post("/", authenticate, authorize(["admin"]), validateRequest(booksSchema.addBook), booksController.addBook);
router.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest(booksSchema.updateBook),
  booksController.updateBook
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest(booksSchema.deleteBook),
  booksController.deleteBook
);
router.get(
  "/",
  authenticate,
  authorize(["admin", "borrower"]),
  validateRequest(booksSchema.getBooks),
  booksController.getBooks
);

module.exports = router;
