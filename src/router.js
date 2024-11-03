const { Router } = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const BooksRouter = require("./books/router");
const UsersRouter = require("./users/router");
const BorrowingsRouter = require("./borrowings/router");

const router = Router();

router.use("/books", BooksRouter);
router.use("/users", UsersRouter);
router.use("/borrowings", BorrowingsRouter);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
