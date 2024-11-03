const { Router } = require("express");
const borrowingsController = require("../controller");
const { validateRequest, authenticate, authorize } = require("../../common/middlewares");
const borrowingsSchema = require("../schema");

const router = Router();

router.post(
  "/borrow",
  authenticate,
  authorize(["borrower", "admin"]),
  validateRequest(borrowingsSchema.borrowBook),
  borrowingsController.borrowBook
);
router.patch(
  "/return/:id",
  authenticate,
  authorize(["borrower", "admin"]),
  validateRequest(borrowingsSchema.returnBook),
  borrowingsController.returnBook
);
router.get(
  "/borrower/",
  authenticate,
  authorize(["borrower", "admin"]),
  validateRequest(borrowingsSchema.getUserBorrowings),
  borrowingsController.getUserBorrowings
);
router.get(
  "/overdue",
  authenticate,
  authorize(["admin"]),
  validateRequest(borrowingsSchema.getOverdueBorrowings),
  borrowingsController.getOverdueBorrowings
);

module.exports = router;
