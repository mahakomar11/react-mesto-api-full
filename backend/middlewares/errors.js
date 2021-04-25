const handleErrors = (err, req, res, next) => {
  if (err.name === "CastError")
    return res.status(400).send({ message: "Передан некорректный id" });
  if (err.name === "ValidationError")
    return res.status(400).send({ message: "Переданы некорректные данные" });
  if (err.name === "MongoError" && err.code === 11000)
    return res
      .status(409)
      .send({ message: "Пользователь с данным email уже существует" });
  if (err.name === "CustomError")
    return res.status(err.statusCode).send({ message: err.message });
  if (err)
    return res.status(500).send({ message: "Что-то пошло не так" });
  return next()
};

module.exports = handleErrors;
