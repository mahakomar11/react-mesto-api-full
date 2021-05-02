const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const auth = require("./middlewares/auth");
const handleErrors = require("./middlewares/errors");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.use(auth);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);
app.use("*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемая страница не найдена" });
});

app.listen(3000);
