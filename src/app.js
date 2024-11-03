const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const router = require("./router");

const { errorHandler, CustomError } = require("./common/middlewares/errorHandler");
const rateLimiter = require("./common/middlewares/rateLimiter");

const app = express();

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(rateLimiter());

app.use("/api", router);
app.get("/", (req, res) => {
  res.json({ message: "Up and Running!" });
});

app.use((req, res, next) => {
  next(new CustomError({ type: "NotFound" }));
});
app.use(errorHandler);

module.exports = app;
